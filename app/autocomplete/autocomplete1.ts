
import * as Rx  from "rxjs/Rx";
import $ from 'jquery';


function main() {

console.log( "MAIN", $ );

try {
    
Rx.Observable.of(1,2,3).map(x => x + '!!!');    
    
}
catch( e ) {
    console.log( "ERROR", e );
}
}

main(); 
