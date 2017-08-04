System.register(["../jspm_packages/npm/rxjs@5.0.0-beta.3/Rx", "./retryWithDelay", "jquery"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Rx, retryWithDelay_1, jquery_1;
    function rxSearch(term) {
        return Rx.Observable.create(function (observer) {
            var xhr = jquery_1.default.ajax({
                url: '/proxy/en.wikipedia.org/w/api.php',
                async: true,
                timeout: 1500,
                cache: false,
                data: {
                    action: 'opensearch',
                    format: 'json',
                    search: term
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    observer.error(errorThrown);
                },
                success: function (data, textStatus, jqXHR) {
                    observer.next(data);
                    observer.complete();
                }
            });
            return function () {
                if (xhr != null && !xhr.status) {
                    xhr.abort();
                    console.log("canceled!");
                }
            };
        });
    }
    function main() {
        console.log("STEP9");
        var $input = jquery_1.default('#textInput'), $results = jquery_1.default('#results');
        var DEBOUNCE_TIME = 50;
        Rx.Observable.fromEvent($input, 'keyup')
            .map(function (e) { return e.target['value']; })
            .filter(function (text) { return text.length > 2; })
            .debounceTime(DEBOUNCE_TIME)
            .distinctUntilChanged()
            .switchMap(function (term) { return retryWithDelay_1.default(rxSearch(term), 3, 1000); })
            .catch(function (error, caught) {
            $results
                .empty()
                .append(jquery_1.default('<li>'))
                .text('Error:' + error);
            return caught;
        })
            .subscribe(function (data) {
            $results
                .empty()
                .append(jquery_1.default.map(data[1], function (v) {
                return jquery_1.default('<li>').text(v);
            }));
        });
    }
    return {
        setters:[
            function (Rx_1) {
                Rx = Rx_1;
            },
            function (retryWithDelay_1_1) {
                retryWithDelay_1 = retryWithDelay_1_1;
            },
            function (jquery_1_1) {
                jquery_1 = jquery_1_1;
            }],
        execute: function() {
            main();
        }
    }
});
