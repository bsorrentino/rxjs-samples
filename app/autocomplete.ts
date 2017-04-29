/// <reference path="../typings/browser.d.ts" />

//import * as Rx  from "rxjs/Rx";
import * as Rx from "../jspm_packages/npm/rxjs@5.0.0-beta.3/Rx";
import $  from "jquery";

/**
 * Search Wikipedia for a given term
 *
 */
function rxSearch(term:string, lastRequest:{xhr:JQueryXHR} ):Rx.Observable<any> {

    function cancel() {
        if( lastRequest.xhr!=null && !lastRequest.xhr.status) {
          lastRequest.xhr.abort();
          console.log( "canceled!" );
          lastRequest.xhr = null;
        }
    }

    cancel();

    return Rx.Observable.create( (observer:Rx.Observer<any>) => {

        lastRequest.xhr = $.ajax({
                url: '/proxy/en.wikipedia.org/w/api.php',
                async:true,
                timeout: 1500,
                cache:false,
                data: {
                    action: 'opensearch',
                    format: 'json',
                    search: term
                },
                error: (jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => {
                      //console.log( "error", textStatus, errorThrown);
                      observer.error( errorThrown );
                },
                success: (data: any, textStatus: string, jqXHR: JQueryXHR) => {
                    //console.log( "data", data);
                    observer.next( data );
                    observer.complete();
                }
          });
          return () => { // On Unsubscribe
              cancel();
          }
    });

  }

/**
 * Search Wikipedia for a given term and retry on failure
 *
 */
function rxSearchAndRetry( retryFor:number, term:string, lastRequest:{xhr:JQueryXHR} ):Rx.Observable<any> {

    /**

                       RXSEARCH()
     ----X-----------------X--------------------R1-|----->
         |       ^         |          ^         
         |       |         |          |         
             RETRYWHEN( errorCount < retryFor )
         |       |         |          |         
     --- 1-------+---------2----------+------------------>
                      DELAY( 10000 )
         |       |         |          |
     ------------D1-------------------D2----------------->

    */
    return rxSearch( term, lastRequest )
            //.retry(retryFor)
            .retryWhen( (errors: Rx.Observable<any>) => {
                return errors.scan( (errorCount:number, err:any) => {
                    if( errorCount >= retryFor ) {
                    throw err;
                    }
                    return errorCount + 1;
                } , 0)
                .delay(1000);
            })
            ;
}

function main() {

    console.log( "STEP9");

    var $input = $('#textInput'),
        $results = $('#results')
        ;
    const DEBOUNCE_TIME = 50;

    let lastXHR:any = {
      xhr:null
    }

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
    Rx.Observable.fromEvent($input, 'keyup')
        .map( (e:Event) => e.target['value'] ) // get the text from the input
        .filter( (text:string) => text.length > 2)
        .debounceTime(DEBOUNCE_TIME)
        .distinctUntilChanged() // Only if the value has changed
        .switchMap( (term:string) => rxSearchAndRetry( 4, term, lastXHR ) )
        .catch( (error:any, caught) => {
            $results
                .empty()
                .append($('<li>'))
                .text('Error:' + error);
            return caught;
        })
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
