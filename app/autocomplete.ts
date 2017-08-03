/// <reference path="../typings/browser.d.ts" />

//import * as Rx  from "rxjs/Rx";
import * as Rx from "../jspm_packages/npm/rxjs@5.0.0-beta.3/Rx";
import $  from "jquery";


class Wikipedia  {

    private xhr:JQueryXHR;

    private cancel() {
        if( this.xhr != null ) {
            this.xhr.abort();
            console.log( "canceled!" );
            this.xhr = null;
        }
    }

    // Search Wikipedia for a given term
    rxSearch(term:string):Rx.Observable<any> {

        return Rx.Observable.create( (observer:Rx.Observer<any>) => {

            this.cancel();

            this.xhr = $.ajax({
                    url: '/proxy/en.wikipedia.org/w/api.php',
                    async:true,
                    data: {
                        action: 'opensearch',
                        format: 'json',
                        search: term
                    },
                    error: (jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => {
                        this.xhr = null;
                        observer.error( errorThrown );
                    },
                    success: (data: any, textStatus: string, jqXHR: JQueryXHR) => {
                        this.xhr = null;
                        observer.next( data );
                        observer.complete();
                    }
            });
            return () => { // On Unsubscribe
                this.cancel();
            }
        })

    }

}

function main() {

    console.log( "STEP8");

    var $input = $('#textInput'),
        $results = $('#results'),
        wikipedia = new Wikipedia()
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
                  FLATMAP( [V] --D--|-> )
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
        .flatMap( (term:string) => wikipedia.rxSearch(term).catch( Rx.Observable.empty ) )
        .subscribe(
            (data:any) => {
                $results
                    .empty()
                    .append ($.map(data[1], (v) => {
                        return $('<li>').text(v);
                    }));
            },
            (error:Error) => {
                $results
                    .empty()
                    .append($('<li>'))
                    .text('Error:' + error);
            });
}

main();
