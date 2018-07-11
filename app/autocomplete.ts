import { Observable, Observer, fromEvent } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import retryWithDelay from "./retryWithDelay";
import $  from "jquery";

/**
 * Search Wikipedia for a given term
 *
 */
function rxSearch(term:string ):Observable<any> {

    return Observable.create( (observer:Observer<any>) => {

        let xhr = $.ajax({
                url: '/proxy/en.wikipedia.org/w/api.php',
                async:true,
                timeout: 1500,
                cache:false,
                data: {
                    action: 'opensearch',
                    format: 'json',
                    search: term
                },
                error: (jqXHR: $.JQueryXHR, textStatus: string, errorThrown: string) => {
                      //console.log( "error", textStatus, errorThrown);
                      observer.error( errorThrown );
                },
                success: (data: any, textStatus: string, jqXHR: $.JQueryXHR) => {
                    //console.log( "data", data);
                    observer.next( data );
                    observer.complete();
                }
          });
          return () => { // On Unsubscribe
            if( xhr!=null && !xhr.status) {
                xhr.abort();
                console.log( "canceled!" );    
            }

          }
    });

  }

function main() {

    console.log( "STEP9");

    var $input = $('#textInput'),
        $results = $('#results')
        ;
    const DEBOUNCE_TIME = 50;

    /**

     -keyup1--keyup2----keyup3-----keyup4----keyup5------>
         |       |         |          |         |
                   MAP( event => value )
         |       |         |          |         |
     ---v1-------v2--------v3---------v4--------v5------->
                   FILTER( condition )
                 |         |                    |
     ------------v2--------v3-------------------v5------->
                   DEBOUNCE( time )
                           |                    |
     ----------------------v3-------------------v5------->
                        DISTINCT
                           |                    |
                  DO( clear result )    DO( clear result )
                           |                    |
     ----------------------v3-------------------v5------->
                  SWITCHMAP( [V] --D--|-> )
                           |                    |
     -----------------------------D1----------------D2--->
                                  |                 |
                        NEXT(append result)    NEXT(append result)

    */
    fromEvent($input, 'keyup')
        .pipe(
            map( (e:Event) => e.target['value'] ), // get the text from the input
            filter( (text:string) => text.length > 2),
            debounceTime(DEBOUNCE_TIME),
            distinctUntilChanged(), // Only if the value has changed
            switchMap( (term:string) => retryWithDelay( rxSearch( term ), 3, 1000 )
                .pipe(
                    catchError( (error:any, caught) => {
                        $results
                            .empty()
                            .append($('<li>'))
                            .text('Error:' + error);
                        return caught;
                    }))))
        .subscribe(
            (data:any) => {
                $results
                    .empty()
                    .append ($.map(data[1], (v) => {
                        return $('<li>').text(v);
                    }));
            }
        );
}

main();
