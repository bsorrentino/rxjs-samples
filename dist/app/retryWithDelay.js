System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function retryWithDelay(_self, retryFor, delayTime) {
        return _self.retryWhen(function (errors) {
            return errors.scan(function (errorCount, err) {
                if (errorCount >= retryFor) {
                    throw err;
                }
                return errorCount + 1;
            }, 0)
                .delay(delayTime);
        });
    }
    exports_1("default", retryWithDelay);
    return {
        setters:[],
        execute: function() {
        }
    }
});
