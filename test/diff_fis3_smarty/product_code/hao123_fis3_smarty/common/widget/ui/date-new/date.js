/*
Time Landscape
@VERSION 0.0.1
@AUTUAR yuji@baidu.com

--
y  year
M  month
d  day

h hour
m minute
s second

w week
z timezone offset
----
 */

!function(WIN, D, undef) {

    var _ = {}

        , scale = {
            d: 864e5
            , h: 36e5
            , m: 6e4
            , s: 1e3
            , ms: 1
        }

        , pad = function(num, len) {
            len = Math.pow(10, len || 2);
            return num < len ? ((len + num) + "").slice(1) : num + "";
        }

        , each = function(obj, cb) {
            if(obj.length !== undef) {
                for(var i = 0, l = obj.length; i<l; i++) {
                    if(i in obj) {
                        if(cb.call(obj[i], obj[i], i, obj) === !1) break;
                    }
                }
            }
            else {
                for(var i in obj) {
                    if(obj.hasOwnProperty(i)) {
                        if(cb.call(obj[i], obj[i], i, obj) === !1) break;
                    }
                }
            }
        };

    _.VERSION = "0.0.1";

    /**
     * Check for a Date Object
     * @param  {Date}  date [description]
     * @return {Boolean}      [description]
     */
    _.is = function(date) {
        return date instanceof D && !isNaN(date);
    }

    /**
     * Detect if the Date Object is bwtween the start and the end
     * @param  {[type]} date  [description]
     * @param  {[type]} start [description]
     * @param  {[type]} end   [description]
     * @return {[type]}       [description]
     */
    _.contains = function(date, start, end) {
        date = date.getTime();
        return date >= start.getTime() && date <= end.getTime();
    }

    /**
     * [clone description]
     * @param  {[type]} date [description]
     * @return {[type]}      [description]
     */
    _.clone = function(date) {
        return new D(+date); 
    };

    /**
     * Returns a timestamp of now
     * @return {Number} [description]
     */
    _.now = D.now || function() {
        return +new D;
    }

    /**
     * Converts a Date object into unix timestamp
     * @return {Number} [description]
     */
    _.toUnix = function(date) {
        return Math.round(date.getTime() / scale.s);
    }

    /**
     * Converts a Date object into UTC(GMT) time
     * @return {Number} [description]
     */
    _.toUTC = function(date) {
        return new D(date.getTime() + date.getTimezoneOffset() * scale.m);
    }


/*    _.toAmPM: function(date) {
        return date.getHours() >= 12 ? 'PM' : 'AM';
    },*/

    /**
     * Converts a Date object into ISO 8601 formatted string
     * @see: http://en.wikipedia.org/wiki/ISO_8601
     * @param  {[type]} date [description]
     * @return {[type]}       "YYYY-MM-DDTHH:mm:ss.sssZ"
     */
    _.toISOString = function(date) {
        return date.getUTCFullYear()
            + '-' + pad(date.getUTCMonth() + 1)
            + '-' + pad(date.getUTCDate())
            + 'T' + pad(date.getUTCHours())
            + ':' + pad(date.getUTCMinutes())
            + ':' + pad(date.getUTCSeconds())
            + '.' + ((date.getUTCMilliseconds() / scale.s).toFixed(3) + "").slice(2, 5)
            + 'Z';
    }

    /**
     * format Date object
     * @param  {Date} date    [description]
     * @param  {String} pattern  "yyyy-MM-dd hh:mm:ss"
     * @return {Object | String}         [description]
     * 
     * y: year
     * M: month
     * h: hour
     * m: minute
     * s: seconds
     * w: week
     * z: timezone offset in hours
     * 
     * @notice
     * 1. "yyyy" --> "2011", "yyy" --> "011", "y" --> "1";
     * 2. otherwise: "m" --> "1", "mm" --> "01"
     */
    _.format = function(date, pattern) {

        var result = {
            y: date.getFullYear()
            , M: date.getMonth() + 1
            , d: date.getDate()
            , h: date.getHours()
            , m: date.getMinutes()
            , s: date.getSeconds()
            , w: date.getDay()
            , z: date.getTimezoneOffset() / 60 * -1
        };

        if(!pattern) return result;

        each(result, function(v, k) {
            pattern = pattern
            .replace(/(y+)/g, function(a, b) {
                return (v + "").substr(4 - Math.min(4, b.length));
            })
            .replace(new RegExp("(" + k + "+)", "g"), function(a, b) {
                return pad(v, b.length);
            });
        });

        return pattern;
    }

    /**
     * Returns the Date Object by specified timezone offset
     * @param {Date} date     [description]
     * @param {Number} timezone  timezone offset
     * @return {Date}         [description]
     */
    _.timezone = function(date, timezone) {
        date.setTime(_.toUTC(date).getTime() + (timezone || 0) * scale.h);
        return date;
    }

    /**
     * Check if the Date object is a leap year
     * @param  {Date | Number}  date    Date object or year
     * @return {Boolean}      [description]
     */
    _.isLeapYear = function(y) {
        if(_.is(y)) y = y.getFullYear();
        return (((y % 4 === 0) && (y % 100 !== 0)) || (y % 400 === 0)); 
    };

    /**
     * Get days in month
     * @param  {[type]} year  [description]
     * @param  {[type]} month [description]
     * @return {[type]}       [description]
     * new Date().days()
     * Date.days(10)
     * Date.days(10, 1983)
     */
    _.days = function(M, y) {
        if(_.is(M)) {
            y = M.getFullYear();
            M = M.getMonth() + 1;
        }
        return [31, (_.isLeapYear(y || (new D).getFullYear()) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][M - 1];
    };

    /**
     * [add description]
     * @param {[type]} date   [description]
     * @param {Number | Object} offset [description]
     * new Date().add(2)
     * new Date().add({
     *     y: 3
     *     , w: 1
     *     , M: 1
     *     , d: 1
     *     , h: 1
     *     , m: 1
     *     , s: 1
     *     , ms: 1
     * })
     */
    _.add = function(date, offset) {

        if(offset === +offset) offset = {
            d: offset
        }
        offset = offset || {};

        var addMonths = function (date, n) {
            var _d = date.getDate();
            date.setDate(1);
            date.setMonth(date.getMonth() + n);
            date.setDate(Math.min(_d, _.days(date)));
            return date;
        };

        each(offset, function(v, k) {
            if(k === "M") date = addMonths(date, v);
            if(k === "y") date = addMonths(date, v * 12);
            scale[k] && date.setMilliseconds(date.getMilliseconds() + scale[k] * v);
        });

        return date;
    }

    /**
     * Diffent between two Date object
     * @param  {Date} date  [description]
     * @param  {Date} _date [description]
     * @return {Object}       [description]
     */
    _.diff = function(date, _date) {
        var diff = _date - date
            , result = {};

        each(scale, function(v, k) {
            var n = 0;
            if(Math.abs(diff) > v) {
                n = Math.floor(diff / v);
                diff = diff % v;
            }
            result[k] = n;
        });

        return result;
    }

    /**
     * Date extend
     * @param  {[type]} source [description]
     * @param  {[type]} target [description]
     * @return {[type]}        [description]
     * Date.extend({
     *     hi: function(date) {
     *         console.log("hi: " + date);
     *      }
     *  })
     *  Date.hi(new Date(2000,10,20))
     *  new Date(2000,10,20).hi()
     */
    _.extend = function(source, target) {
        target = target || D;
        source = source || this;
        var args = arguments;
        each(source, function(v, k) {
            target[k] = v;
            v !== args.callee
            && target.prototype[k] === undef
            && (target.prototype[k] = function() {
                var self = this;
                return v.apply(self, [].concat.apply(self, [].slice.call(arguments)));
            });
        });
        return _;
    }

    _.extend();

}(window, window.Date);