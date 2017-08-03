System.register(["../jspm_packages/npm/rxjs@5.0.0-beta.3/Rx"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Rx;
    return {
        setters:[
            function (Rx_1) {
                Rx = Rx_1;
            }],
        execute: function() {
            Rx.Observable.prototype.retryWithDelay = function (retryFor, delayTime) {
                return this.retryWhen(function (errors) {
                    return errors.scan(function (errorCount, err) {
                        if (errorCount >= retryFor) {
                            throw err;
                        }
                        return errorCount + 1;
                    }, 0)
                        .delay(delayTime);
                });
            };
        }
    }
});
