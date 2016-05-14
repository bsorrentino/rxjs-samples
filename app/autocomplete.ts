/// <reference path="../typings/browser.d.ts" />

//import * as Rx  from "rxjs/Rx";
import * as Rx from "../jspm_packages/npm/rxjs@5.0.0-beta.3/Rx";
import $ from "jquery";



function main() {

    console.log( "STEP3");

    var $input = $('#textInput');

    /**

     -keyup1--keyup12---keyup13----keyup14---keyup15----->
         |       |         |          |         |
                   MAP( event => value )
         |       |         |          |         |
     ---v1-------v2--------v3---------v3--------v4------->
                   FILTER( condition )
                 |         |                    |
     ------------v2--------v3-------------------v4------->

     */
    Rx.Observable.fromEvent($input, 'keyup')
        .map( (e:Event) => {
            return e.target['value']; // map event to input text
        })
        .filter( (text:string) => {
            return text.length > 2; // Only if the text is longer than 2 characters
        })
        .subscribe(
            (e:Event) => {
                console.log( "event", e );
        });
}

main();
