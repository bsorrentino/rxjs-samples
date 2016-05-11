/// <reference path="../typings/browser.d.ts" />

//import * as Rx  from "rxjs/Rx";
import * as Rx from "../jspm_packages/npm/rxjs@5.0.0-beta.3/Rx"
import $  from "jquery"

// Search Wikipedia for a given term
function searchWikipedia (term:string) {
    return Rx.Observable.fromPromise(
        $.ajax({
            url: 'http://en.wikipedia.org/w/api.php',
            dataType: 'jsonp',
            data: {
                action: 'opensearch',
                format: 'json',
                search: term
            }
    }));
}

function main() {

    console.log( "MAIN");

    var $input = $('#textInput'),
        $results = $('#results');

    // Get all distinct key up events from the input and only fire if long enough and distinct
    var keyup = Rx.Observable.fromEvent($input, 'keyup')
        .map( (e:Event) => {
            return e.target['value']; // Project the text from the input
        })
        .filter( (text:string) => {
            return text.length > 2; // Only if the text is longer than 2 characters
        })
        .debounceTime(750 /* Pause for 750ms */ )
        .distinctUntilChanged(); // Only if the value has changed

    keyup.switchMap(searchWikipedia)
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
