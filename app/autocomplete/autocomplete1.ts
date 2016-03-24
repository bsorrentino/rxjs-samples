/// <reference path="../../typings/browser.d.ts" />

import * as Rx  from "rxjs/Rx";
import * as $ from 'jquery';


function main() {

    console.log( "MAIN", $ );

    try {
        
    var $input = $('#textInput'),
        $results = $('#results');

    // Get all distinct key up events from the input and only fire if long enough and distinct
    Rx.Observable.fromEvent($input, 'keyup')
        .map( (e:Event) => {
            return e.target.value; // Project the text from the input
        })
        .filter( (text) => {
            return text.length > 2; // Only if the text is longer than 2 characters
        })
        .debounceTime(750 /* Pause for 750ms */ )
        .distinctUntilChanged() // Only if the value has changed
        .subscribe( (e:Event )=> { 
            console.log( "keyup", e);
        })
        
    }
    catch( e ) {
        console.log( "ERROR", e );
    }
}

main(); 
