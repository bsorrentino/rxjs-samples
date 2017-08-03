System.register(["../jspm_packages/npm/rxjs@5.0.0-beta.3/Rx", "jquery"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Rx, jquery_1;
    function searchWikipedia(term) {
        return Rx.Observable.fromPromise(jquery_1.default.ajax({
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
        console.log("STEP7");
        var $input = jquery_1.default('#textInput'), $results = jquery_1.default('#results');
        Rx.Observable.fromEvent($input, 'keyup')
            .map(function (e) { return e.target['value']; })
            .filter(function (text) { return text.length > 2; })
            .debounceTime(750)
            .distinctUntilChanged()
            .do(function () { return $results.empty(); })
            .flatMap(function (term) { return searchWikipedia(term); })
            .do(function (elements) { return console.log(elements); })
            .subscribe(function (data) { return $results
            .append(jquery_1.default.map(data[1], function (v) { return jquery_1.default('<li>').text(v); })); }, function (error) { return $results
            .append(jquery_1.default('<li>'))
            .text('Error:' + error); });
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
