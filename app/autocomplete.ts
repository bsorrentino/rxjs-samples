/// <reference path="../typings/browser.d.ts" />

//import * as Rx  from "rxjs/Rx";
import * as Rx from "../jspm_packages/npm/rxjs@5.0.0-beta.3/Rx";
import $ from "jquery";



function main() {

    console.log( "STEP1");

    var $input = $('#textInput');

    /**
     
     -keyup1--keyup12---keyup13----keyup14---keyup15----->
         |       |         |          |         |
     ---------------------------------------------------->
     
     */
    Rx.Observable.fromEvent($input, 'keyup')
        .subscribe(
            (e:Event) => {
                console.log( "event", e );
            });
}

main();
