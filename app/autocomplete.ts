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

    return Rx.Observable.create( (observer:Rx.Observer<any>) => {

        cancel();

        lastRequest.xhr = $.ajax({
                url: '/proxy/en.wikipedia.org/w/api.php',
                async:true,
                data: {
                    action: 'opensearch',
                    format: 'json',
                    search: term
                },
                error: (jqXHR: JQueryXHR, textStatus: string, errorThrown: string) => {
                      observer.error( errorThrown );
                },
                success: (data: any, textStatus: string, jqXHR: JQueryXHR) => {
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

  return rxSearch( term, lastRequest )
        .retryWhen( (errors: Rx.Observable<any>) => {
            return errors.scan( (errorCount:number, err:any) => errorCount + 1, 0)
                        .takeWhile((errorCount) => errorCount < retryFor )
                        .delay(1000);
                    })
                    ;
}

function main() {

    console.log( "STEP8");

    var $input = $('#textInput'),
        $results = $('#results')
        ;
    const DEBOUNCE_TIME = 50;

    let lastXHR = {
      xhr:null
    }

    // Get all distinct key up events from the input and only fire if long enough and distinct
    Rx.Observable.fromEvent($input, 'keyup')
        .map( (e:Event) => e.target['value'] ) // get the text from the input
        .filter( (text:string) => text.length > 2)
        .debounceTime(DEBOUNCE_TIME)
        .distinctUntilChanged() // Only if the value has changed
        .switchMap( (term:string) => rxSearch( term, lastXHR ) )
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
