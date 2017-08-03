System.register(["../jspm_packages/npm/rxjs@5.0.0-beta.3/Rx", "jquery"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Rx, jquery_1;
    var Wikipedia;
    function main() {
        console.log("STEP8");
        var $input = jquery_1.default('#textInput'), $results = jquery_1.default('#results'), wikipedia = new Wikipedia();
        var DEBOUNCE_TIME = 50;
        Rx.Observable.fromEvent($input, 'keyup')
            .map(function (e) { return e.target['value']; })
            .filter(function (text) { return text.length > 2; })
            .debounceTime(DEBOUNCE_TIME)
            .distinctUntilChanged()
            .flatMap(function (term) { return wikipedia.rxSearch(term).catch(Rx.Observable.empty); })
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
            Wikipedia = (function () {
                function Wikipedia() {
                }
                Wikipedia.prototype.cancel = function () {
                    if (this.xhr != null) {
                        this.xhr.abort();
                        console.log("canceled!");
                        this.xhr = null;
                    }
                };
                Wikipedia.prototype.rxSearch = function (term) {
                    var _this = this;
                    return Rx.Observable.create(function (observer) {
                        _this.cancel();
                        _this.xhr = jquery_1.default.ajax({
                            url: '/proxy/en.wikipedia.org/w/api.php',
                            async: true,
                            data: {
                                action: 'opensearch',
                                format: 'json',
                                search: term
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                _this.xhr = null;
                                observer.error(errorThrown);
                            },
                            success: function (data, textStatus, jqXHR) {
                                _this.xhr = null;
                                observer.next(data);
                                observer.complete();
                            }
                        });
                        return function () {
                            _this.cancel();
                        };
                    });
                };
                return Wikipedia;
            }());
            main();
        }
    }
});
