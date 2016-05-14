/// <reference path="../typings/browser.d.ts" />

//import * as Rx  from "rxjs/Rx";
import * as Rx from "../jspm_packages/npm/rxjs@5.0.0-beta.3/Rx";
import $ from "jquery";



function main() {

    console.log( "STEP3");

    var $input = $('#textInput');

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

     */
    Rx.Observable.fromEvent($input, 'keyup')
        .map( (e:Event) => {
            return e.target['value']; // Project the text from the input
        })
        .filter( (text:string) => {
            return text.length > 2; // Only if the text is longer than 2 characters
        })
        .debounceTime(750 /* Pause for 750ms */ )
        .subscribe(
            (e:Event) => {
                console.log( "event", e );
        });
}

main();
