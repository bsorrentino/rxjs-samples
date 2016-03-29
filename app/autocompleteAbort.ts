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
                        observer.error( errorThrown );                      
                    },
                    success: (data: any, textStatus: string, jqXHR: JQueryXHR) => {
                        observer.next( data );   
                        observer.complete();                                       
                    }
            });
            return () => { // On Unsubscribe            
                this.cancel();
            }         
        })
        .retryWhen( (errors: Rx.Observable<any>) => {
            return errors.scan( (errorCount:number, err:any) => {
                                return errorCount + 1;
                        }, 0)
                        .takeWhile((errorCount) => {
                            return errorCount < 5;
                        })
                        .delay(1000);
                    })
                    ;

    }
    
}

function main() {

    console.log( "MAIN");

    var $input = $('#textInput'),
        $results = $('#results'),
        wikipedia = new Wikipedia()
        ;

    // Get all distinct key up events from the input and only fire if long enough and distinct
    Rx.Observable.fromEvent($input, 'keyup')
        .map( (e:Event) => {
            return e.target['value']; // Project the text from the input
        })
        .filter( (text:string) => {
            return text.length > 2 ;
        })
        .debounceTime(750 /* Pause for 750ms */ )
        .distinctUntilChanged() // Only if the value has changed
        .switchMap(  (term:string)=> {
            return wikipedia.rxSearch(term);
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
