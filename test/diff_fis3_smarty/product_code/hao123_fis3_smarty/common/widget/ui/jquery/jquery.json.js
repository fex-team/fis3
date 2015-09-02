/**
 * jQuery JSON Plugin
 * version: 2.3 (2011-09-17)
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 * Brantley Harris wrote this plugin. It is based somewhat on the JSON.org
 * website's http://www.json.org/json2.js, which proclaims:
 * "NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.", a sentiment that
 * I uphold.
 *
 * It is also influenced heavily by MochiKit's serializeJSON, which is
 * copyrighted 2005 by Bob Ippolito.
 */

(function ($) {
    m = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        $.toJSON = function (value, whitelist) {
                var a,          // The array holding the partial texts.
                        i,          // The loop counter.
                        k,          // The member key.
                        l,          // Length.
                        r = /["\\\x00-\x1f\x7f-\x9f]/g,
                        v;          // The member value.

                switch (typeof value) {
                case 'string':
                        return r.test(value) ?
                                '"' + value.replace(r, function (a) {
                                        var c = m[a];
                                        if (c) {
                                                return c;
                                        }
                                        c = a.charCodeAt();
                                        return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
                                }) + '"' :
                                '"' + value + '"';

                case 'number':
                        return isFinite(value) ? String(value) : 'null';

                case 'boolean':
                case 'null':
                        return String(value);

                case 'object':
                        if (!value) {
                                return 'null';
                        }
                        if (typeof value.toJSON === 'function') {
                                return $.toJSON(value.toJSON());
                        }
                        a = [];
                        if (typeof value.length === 'number' &&
                                        !(value.propertyIsEnumerable('length'))) {
                                l = value.length;
                                for (i = 0; i < l; i += 1) {
                                        a.push($.toJSON(value[i], whitelist) || 'null');
                                }
                                return '[' + a.join(',') + ']';
                        }
                        if (whitelist) {
                                l = whitelist.length;
                                for (i = 0; i < l; i += 1) {
                                        k = whitelist[i];
                                        if (typeof k === 'string') {
                                                v = $.toJSON(value[k], whitelist);
                                                if (v) {
                                                        a.push($.toJSON(k) + ':' + v);
                                                }
                                        }
                                }
                        } else {
                                for (k in value) {
                                        if (typeof k === 'string') {
                                                v = $.toJSON(value[k], whitelist);
                                                if (v) {
                                                        a.push($.toJSON(k) + ':' + v);
                                                }
                                        }
                                }
                        }
                        return '{' + a.join(',') + '}';
                }
        };
        
})(jQuery);
