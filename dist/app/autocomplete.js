System.register(["../jspm_packages/npm/rxjs@5.0.0-beta.3/Rx", "jquery"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Rx, jquery_1;
    function rxSearch(term, lastRequest) {
        function cancel() {
            if (lastRequest.xhr != null && !lastRequest.xhr.status) {
                lastRequest.xhr.abort();
                console.log("canceled!");
                lastRequest.xhr = null;
            }
        }
        return Rx.Observable.create(function (observer) {
            cancel();
            lastRequest.xhr = jquery_1.default.ajax({
                url: '/proxy/en.wikipedia.org/w/api.php',
                async: true,
                data: {
                    action: 'opensearch',
                    format: 'json',
                    search: term
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    observer.error(errorThrown);
                    lastRequest.xhr = null;
                },
                success: function (data, textStatus, jqXHR) {
                    observer.next(data);
                    observer.complete();
                    lastRequest.xhr = null;
                }
            });
            return function () {
                cancel();
            };
        });
    }
    function main() {
        console.log("STEP8");
        var $input = jquery_1.default('#textInput'), $results = jquery_1.default('#results');
        var DEBOUNCE_TIME = 50;
        var lastXHR = {
            xhr: null
        };
        Rx.Observable.fromEvent($input, 'keyup')
            .map(function (e) { return e.target['value']; })
            .filter(function (text) { return text.length > 2; })
            .debounceTime(DEBOUNCE_TIME)
            .distinctUntilChanged()
            .flatMap(function (term) { return rxSearch(term, lastXHR).catch(Rx.Observable.empty); })
            .subscribe(function (data) {
            $results
                .empty()
                .append(jquery_1.default.map(data[1], function (v) {
                return jquery_1.default('<li>').text(v);
            }));
        }, function (error) {
            $results
                .empty()
                .append(jquery_1.default('<li>'))
                .text('Error:' + error);
        });
    }
    return {
        setters:[
            function (Rx_1) {
                Rx = Rx_1;
            },
            function (jquery_1_1) {
                jquery_1 = jquery_1_1;
            }],
        execute: function() {
            main();
        }
    }
});
