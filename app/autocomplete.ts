/// <reference path="../typings/browser.d.ts" />

//import * as Rx  from "rxjs/Rx";
import * as Rx from "../jspm_packages/npm/rxjs@5.0.0-beta.3/Rx";
import $ from "jquery";



/**
  Search Wikipedia for a given term

  Create an observable that emit the result of the related promise
*/
function searchWikipedia(term:string):Rx.Observable<[any]> {
    return Rx.Observable.fromPromise<[any]>(
        $.ajax({
            url: 'http://en.wikipedia.org/w/api.php',
            dataType: 'jsonp',
            data: {
                action: 'opensearch',
                format: 'json',
                search: term
            }
         }) as any) 
        ;
}


function main() {

    console.log( "STEP7");

    var $input = $('#textInput'),
         $results = $('#results');

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
        .map( (e:Event) => e.target['value'] ) // map event to input text
        .filter( (text:string) => text.length > 2 )  // Only if the text is longer than 2 characters
        .debounceTime(750 ) // Pause for 750ms
        .distinctUntilChanged() // Only if the value has changed
        .do( () => $results.empty() ) // Clear the output
        .flatMap( (term) => searchWikipedia(term) )
        .do( (elements) => console.log(elements) )
        //.map( (elements) => elements[1] )
        .subscribe(
            (data) => $results
                        .append( $.map(data[1], (v) => $('<li>').text(v)) )
        ,
            (error:Error) => $results
                              .append($('<li>'))
                              .text('Error:' + error)
        );
}

main();
