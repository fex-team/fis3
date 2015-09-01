var $ = require("common:widget/ui/jquery/jquery.js");
var History = function() {

    // whether support html5 history API
    var supportHistory = null;

    // History instance returned to the outer scope
    var self = null;

    /* extract hash part from a given url */
    var _getHash = function(url) {
        url = url || window.location.href;
        return window.location.hash.substr(1); // url.replace( /^[^#]*#?(.*)$/, '$1' )
    };

    /* set a new hash in the location bar */
    var _setHash = function(newHash) {
        window.location.hash = newHash;
    };

    /* bind history listener */
    var _bind = function() {
        if(supportHistory){
            $(window).on("popstate", function(e){
                var hash = _getHash();
                $(self).trigger("popstate", [hash]);
                // console.log("%c popstate "+hash, "color: #f00");
            });
        }else{
            $(window).on("hashchange", function(e) {
                var hash = _getHash();
                $(self).trigger("popstate", [hash]);
                // console.log("%c hash "+hash, "color: #f00");       //+" "+e.oldURL+" -> "+e.newURL
            });
        }
    };

    /* init */
    var _init = function() {
        var self = this;
        supportHistory = (function() {
            return !!(window.history && window.history.pushState && window.history.replaceState);
        })();
        _bind();
    };

    // initialization entrance
    _init();

    /* return outer interface */
    // 1) instance object for capturing custom event "popstate"
    return self = {
        // 2) a method triggering history to change
        pushState: function(newHash) {
            if(supportHistory){
                window.history.pushState(null, null, "#"+newHash);
                $(self).trigger("popstate", [newHash]); // callback(newHash);
            }else{
                _setHash(newHash); // trigger hashchange event
            }
        }
    };

};

module.exports = History;
