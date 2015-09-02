/**
* jQuery Cookie Plugin
* @Frank.F
* V1.1.2
* @Change log: 
* @2013.11.07
*   1. Redeclare jQuery namespace, in order to use jQuery.cookie() without jQuery library.
*   2. Change the logic of cookie overflow. Now you cannot write the cookie when it's overflow.
*   3. Add callback function named 'error' into 'set' function's options, it will be called when writing a cookie and it is overflow.
*   4. Simplify jQuery.cookie.set function's logic.
*   5. Commented move and clear functions for safe.
*   6. Some other minor changes and improvements.

* @Usage: 
*   Original jQuery Cookie Set: $.cookie(key, value[, option]);
*   Original jQuery Cookie Get: $.cookie(key);
*   Combined Cookie Set: $.cookie.set(key, value[, expires]);
*   Combined Cookie Get: $.cookie.set(key);
*/

window.jQuery || (window.jQuery = {});

;;(function ($, DOC, NAME) {

    var COOKIENAME = "HCD", // Current cookie name
        ENCODE = encodeURIComponent,
        DECODE = decodeURIComponent,
        NULL = null,
        MAXLENGTH = 2048,   // Max length of the whole cookie data
        // EACHMAXLENGTH = 50, // Max length of each single/combined cookie data
        EXPIREDAYS = 2000,  // The combined cookie's expired days

        /**
         * Whether a string is not empty
         * @param  {String} o  String value
         * @return {Boolean}   True is not empty; false is empty
         */
        notEmpty = function (o) {
            return o + "" === o && o !== "";
        },

        /**
         * Convert expire time's format from day to millisecond
         * @param  {Number} expires Expire days
         * @return {String}         Expire time in duotricemary notation
         */
        toTime = function (expires) {
            var time = expires == 0 ? 0 : ((new Date).getTime() + expires * 86400000);
            // convert to duotricemary notation
            return time.toString(32);
        },

        /**
         * Convert expire time UTC string in millisecond
         * @param  {Number} expires Expire days
         * @return {String}         UTC String of the expire time
         */
        toExpires = function (expires) {
            var date = new Date;
            if (typeof(expires) === "number") {
                if (expires == 0) return "";
                // conver to decimal system
                date.setTime(parseInt(toTime(expires), 32));
            } else {
                date = expires;
            }
            return date.toUTCString();
        },

        /**
         * Set cookie (original usage)
         * @param {String} name   Cookie's name
         * @param {String|Number} value  Cookie's value
         * @param {Object} Option options
         */
        set = function (name, value, option) {

            option = option || {};

            //session cookie as default
            var expires = option.expires;

            // delete the cookie data while value is equal to null
            if (value === NULL) {
                expires = -1;
            }

            // overflow judgement
            if (expires !== -1) {
                var newCookie = DOC.cookie,
                    matchedCookie = newCookie.match('(?:^|; )' + name + '(?:(?:=([^;]*))|;|$)'),
                    setCookie = '; ' + name + '=' + value; // Cookie will be set

                /*if (name !== COOKIENAME && setCookie.length > EACHMAXLENGTH) {
                    // error callback
                    option.error && option.error();
                    // refuse to write cookie when it's overflow
                    return false;
                }*/

                // imitate the new cookie data before writing
                if (matchedCookie) {
                    newCookie = /^;/.test(matchedCookie[0]) ? newCookie.replace(matchedCookie[0], setCookie) : newCookie.replace(matchedCookie[0], name + '=' + value);
                } else {
                    newCookie += setCookie;
                }

                if (newCookie.length > MAXLENGTH) {
                    // error callback
                    option.error && option.error();
                    // refuse to write cookie when it's overflow
                    return false;
                }
            }

            // Write cookie
            DOC.cookie = [
                name, '=',
                value,
                expires ? '; expires=' + toExpires(expires) : '',
                notEmpty(option.domain) ? '; domain=' + option.domain : '',
                notEmpty(option.path) ? '; path=' + option.path : '',
                option.secure ? '; secure' : ''
            ].join('');
        },

        /**
         * Get cookie (original usage)
         * @param  {String} name Cookie's name
         * @return {String}      Cookie's value
         */
        get = function (name) {
            var result = notEmpty(name) ? DOC.cookie.match('(?:^| )' + name + '(?:(?:=([^;]*))|;|$)') : NULL;
            return result ? result[1] : result;
        },

        /**
         * Match data with name, in the format of 'name|value|time'
         * @param  {String} name 
         * @param  {String} data 
         * @return {String}      Matched result
         */
        matchAll = function (name, data) {
            var result = (data || "").match('(?:^|,)(' + ENCODE(name) + '\\|[^,]+)');
            return result && result[1];
        },

        /**
         * Check whether the data is overflow and if do so, delete the last one
         * @param  {String} data   
         * @param  {Number} length Limited length
         * @return {String}        Result data value
         */
        /*checkLength = function (data, length) {
            if (data.length > length) {
                data = data.split(",");
                data.pop();
                data = data.join(",");
                data = checkLength(data, length);
                return data;
            } else {
                return data;
            }
        },*/

        /**
         * $.cookie() function's entrance
         * @param  {String} name   Cookie's name
         * @param  {String|Number} value  Cookie's value, call get func while is empty, otherwise call set func.
         * @param  {Object} option Options
         * @return {[type]}        Set or get cookie function's return value
         */
        _ = function (name, value, option) {
            return (value === "0" || value === 0 || value || value === NULL || value === "") ? set(ENCODE(name), value === NULL ? NULL : ENCODE(value), option) : (get(ENCODE(name)) ? DECODE(get(ENCODE(name))) : NULL);
        };

    /**
     * Set cookie into the combined one, you can set expires only, the other options are default as {domain:"", path:"/", secure:""}
     * @param {String} name    Cookie's name
     * @param {String|Number} value   Cookie's value
     * @param {Object} option Options
     */
    _.set = function (name, value, option) {

        option = option || {};

        //anyway, delete the original cookie data
        set(ENCODE(name), NULL);

        var expires = option.expires,

            result = get(COOKIENAME) || "",

            //old data
            matchData = matchAll(name, result) || "";

        // remove the original cookie and set the new data as the first place
        /*if ((new RegExp("^" + matchData.replace(/\|/g, "\\|"), "g")).test(result)) {
            var newData = result.replace(matchData, [ENCODE(name), ENCODE(value), toTime(expires || 0)].join("|") + (result.length && !matchData ? "," : ""));
        } else {
            var reg = new RegExp(",?" + matchData.replace(/\|/g, "\\|"), "g"),
                newData = ([ENCODE(name), ENCODE(value), toTime(expires || 0)].join("|") + (result.length ? "," : "")).concat(result.replace(reg, ""));
        }*/
        
        /*if ([ENCODE(name), ENCODE(value)].join("|").length > EACHMAXLENGTH) {
            // error callback
            option.error && option.error();
            // refuse to write cookie when it's overflow
            return false;
        }*/

        // remove the original cookie and get the new entire HCD cookie data
        if (new RegExp(matchData.replace(/\|/g, "\\|"), "g").test(result)) {
            var newData = result.replace(matchData, [ENCODE(name), ENCODE(value), toTime(expires || 0)].join("|") + (result.length && !matchData ? "," : ""));
        }

        // if the data's length is overflow, then delete the last one
        // newData = checkLength(newData, MAXLENGTH);

        //expires ==> timestamp
        set(COOKIENAME, newData, { expires: EXPIREDAYS, domain: '', error: option.error });

        return _;
    };

    /**
     * Get cookie from the combined one
     * @param  {String} name Cookie's name
     * @return {String}      Cookie's value
     */
    _.get = function (name) {
        //timestamp
        var _data = get(ENCODE(name));
        if (_data !== NULL) return DECODE(_data);

        var data = get(COOKIENAME) || "",
        matchData = matchAll(name, data);

        //null
        if (!matchData) return matchData;

        matchData = matchData.split("|");

        //is not expired
        if (matchData[2] == 0 || parseInt(matchData[2], 32) > (new Date).getTime()) return DECODE(matchData[1]);

        //delete when the cookie is exist but expired
        _.del(ENCODE(name));
        return NULL;
    };

    /**
     * COMMENTED: Migrate the old cookie data into the combined one
     * @param  {String} name    Cookie's name which need to be migrated
     * @param  {Number} expires Expire days
     */
    /*_.move = function (name, expires) {
        var value = get(ENCODE(name));
        value !== NULL && _.set(name, DECODE(value), expires || 365);
        return _;
    };*/

    /**
     * Delete a cookie from the combined one
     * @param  {String} name Cookie's name which need to be deleted
     */
    _.del = function (name) {
        //anyway, kill old
        set(ENCODE(name), NULL);

        var data = get(COOKIENAME) || "",
        matchData = matchAll(name, data) || "",
        matchReg = new RegExp(",?" + matchData.replace(/\|/g, "\\|") + ",?", "g");
        matchData && set(COOKIENAME, data.replace(matchReg, ""));
        return _;
    };

    /** COMMENTED: Clear the combined cookie */
    /*_.clear = function () {
        set(COOKIENAME, "");
        return _;
    };*/

    _.is = !!navigator.cookieEnabled;


    $[NAME] = _;
})(jQuery, document, "cookie");
