/// <reference path="../../typings/browser.d.ts" />

//import * as Rx  from "rxjs/Rx";
import * as Rx from "../../jspm_packages/npm/rxjs@5.0.0-beta.3/Rx";
import $  from "jquery";

// Search Wikipedia for a given term
function searchWikipedia(term:string):Rx.Observable<any> {
    
    return Rx.Observable.create( (observer:Rx.Observer<any>) => {
        
        let xhr = $.ajax({
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
        return () => {
            
            xhr.abort();
        }         
    });

}

function main() {

    console.log( "MAIN");

    var $input = $('#textInput'),
        $results = $('#results');

    // Get all distinct key up events from the input and only fire if long enough and distinct
    var keyup = Rx.Observable.fromEvent($input, 'keyup')
        .map( (e:Event) => {
            return e.target.value; // Project the text from the input
        })
        .filter( (text:string) => {
            return text.length > 2 ;
        })
        .debounceTime(750 /* Pause for 750ms */ )
        .distinctUntilChanged(); // Only if the value has changed

    
    let s = keyup.switchMap(  (term:string)=> {
        return searchWikipedia(term);
    })
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
