/**
 * jQuery calendar plugin
 * @author yuji@baidu.com
 * @update 2013/10/17
 *
 * Compatibility:
 * 1. IE 6-10, Firefox, Opera, Chrome, Safari
 * 2. ltr/rtl
 * 3. Windows / Mac
 *
 * TODO:
 *
 */
!function(WIN, DOC, $, undef) {

    $ = $ || window.require && require("common:widget/ui/jquery/jquery.js");

    if (!$) return;
    var noop = function() {}
        , replaceTpl = window.require && require("common:widget/ui/helper/helper.js").replaceTpl || function(tpl, data, label) {
            var s = label || /#\{([^}]*)\}/mg,
                trim = function (str) {
                        return str.replace(/^\s+|\s+$/g, '')
                    };
            return (tpl + "").replace(s, function (value, name) {
                return value = data[trim(name)] || "";
            });
        }
        , calendar = function($el, args) {

            var that = this;

            that.$el = $el;
            that.el = $el[0];

            that.args = $.extend({

                /**
                 * You may provide a new date object to rewrite now
                 * @type {Date}
                 */
                now: new Date

                /**
                 * Default module selector prefix
                 * @type {String}
                 */
                , selectorPrefix: "mod-calendar"

                /**
                 * Default text of weeks
                 * @type {Array}
                 */
                , weeks: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

                /**
                 * Menu tpl
                 * @type {String}
                 */
                , tplMenu: '<option value="#{val}" #{selected}>#{name}</option>'

                /**
                 * Week cell tpl
                 * @type {String}
                 */
                , tplWeek: '<li>#{name}</li>'

                /**
                 * Day cell tpl
                 * @type {String}
                 */
                , tplDay: '<li #{className}><a href="#{url}" class="#{noLink}"><dl><dt>#{d}</dt><dd>#{info}</dd></dl></a></li>'

                /**
                 * Footer html snippets
                 * @type {String}
                 */
                , footer: ""

                /**
                 * Custom min date or the offset of begin date
                 * @notice support: "2014-3-1" | 2 | "-1"
                 * @notice Built-Lunar only supports 1901-1-1 ~ 2049-12-31
                 * @type {String | Number}
                 */
                , minDate: "2004-3-1"

                /**
                 * Custom max date or the offset of end date
                 * @notice support: "2014-3-1" | 2 | "-1"
                 * @notice Built-Lunar only supports 1901-1-1 ~ 2049-12-31
                 * @type {String | Number}
                 */
                , maxDate: "2024-3-1"

                /**
                 * Abbreviation week(3 letters, uppercase)
                 * @type {Boolean}
                 */
                , isAbbrWeek: true

                /**
                 * the beginning week name of the week
                 * @type {Number}
                 */
                , beginDay: 1

                /**
                 * Whether to allow loop switch
                 * @type {Boolean}
                 */
                , switchLoop: false

                /**
                 * Custom switch date handle
                 * @type {[Function]}
                 */
                , onSwitch: noop

                /**
                 * Custom click handle
                 * @type {[Function]}
                 */
                , onClick: noop

                /**
                 * The filter of day render
                 * @param  {[Object]} o {className, d, y, M, info, url}
                 * @return {[Object]}
                 */
                , onFilterDays: function(o) {
                    return o;
                }
            }, args);

            that.pre = that.args.selectorPrefix;

            that.args.weeks = that.args.weeks.splice(that.args.beginDay, that.args.weeks.length).concat(that.args.weeks.splice(0, that.args.beginDay + 1));

            that.now = new Date(that.args.now);

            that.minDate = (+(that.minDate = that.args.minDate) ? that.now.add(+that.minDate) : new Date(that.minDate)).format();

            that.maxDate = (+(that.maxDate = that.args.maxDate) ? that.now.add(+that.maxDate) : new Date(that.maxDate)).format();

            that.now = that.now.format();

            that.state = {};

            that.init();
        }

        , fn = calendar.prototype;

    /**
     * Initialization
     * @return {[type]} [description]
     */
    fn.init = function() {
        var that = this
            , $el = that.$el
            , render = that.render;

        $("year|month|weeks|days|prev|next|ft".split("|")).map(function(i, li) {
            that["$" + li] = $el.find("." + that.pre + "_" + li);
        })

        // render year
        that.render(that.$year, that.args.tplMenu, new Array(that.maxDate.y - that.minDate.y + 1), function(li, i) {
            var year = i + that.minDate.y
                , name = year;

            if(that.args.fixYear) name = that.args.fixYear(year);

            return {
                val: year
                , name: name
                , selected: year === that.now.y ? 'selected="selected"' : ""
            }
        });

        that.render(that.$weeks, that.args.tplWeek, that.args.weeks, function(li, i) {
            return {
                name: that.args.isAbbrWeek ? li.slice(0, 3).toUpperCase() : li
            }
        });

        that.$ft.html(that.args.footer);
        that.renderMonths(that.now.y, that.now.M);
        that.renderDays(that.now.M, that.now.y);
        that.fixBtnStatus(that.now.y, that.now.M);
        that.bindEvents();
    }

    fn.renderMonths = function(y) {
        var that = this
            , l = 12;

        if(y === that.maxDate.y) l = that.maxDate.M;
        if(y === that.minDate.y) l = l - that.minDate.M + 1;

        that.render(that.$month, that.args.tplMenu, new Array(l), function(li, i) {
            i = i + (y === that.minDate.y ? that.minDate.M : 1);
            return {
                val: i
                , name: that.args.fixMonth ? that.args.fixMonth(i) : i
                , selected: i === that.now.M ? 'selected="selected"' : ""
            }
        });
    }

    // handle events.
    fn.filterDays = function(y, M, d, className, info, url) {
        var that = this;
        return that.args.onFilterDays.call(that, {
            className: className
            , d: d
            , y: y
            , M: M
            , info: info
            , url: url || "#"
        });
    }

    fn.renderDays = function(M, y, filter) {
        var that = this;

        that.render(that.$days, that.args.tplDay, new Array(7 * 6), function(className, d, info) {

            var begin = new Date(y, M - 1, 1).format().w - 1 - that.args.beginDay
                , total = Date.days(M, y)
                , _M = M;

            if(begin < -1) begin = begin + 7;
            d = d - begin;
            info = "";
            className = "";

             // fix month
            if(d < 1) {
                _M = M - 1;
                d = d + (!_M ? Date.days(12, y - 1) : Date.days(_M, y));
                className = 'class=' + that.pre + "-holder";
            }
            else if(d > total) {
                d = d - total;
                _M = M + 1;
                className = 'class=' + that.pre + "-holder";
            }
            else if(y === that.now.y && _M === that.now.M && d === that.now.d) {
                className = 'class=' + that.pre + "-today";
            }

            // fix selectable date range
            if(new Date(that.minDate.y, that.minDate.M - 1, that.minDate.d).diff(new Date(y, _M - 1, d - 1)).d < 0
            || new Date(that.maxDate.y, that.maxDate.M - 1, that.maxDate.d).diff(new Date(y, _M - 1, d + 1)).d > 0)
            className = 'class=' + that.pre + "-holder";

            return that.filterDays(y, _M, d, className, info);
        });
    }

    fn.render = function($el, tpl, data, filter) {
        data = $.isArray(data) ? data : [data];
        var ret = [];
        $.map(data, function(li, i) {
            ret.push(replaceTpl(tpl, filter ? filter(li, i) : data));
        });
        $el.html(ret.join(""));
    }

    fn.fixBtnStatus = function(y, M) {
        var that = this
            , className = that.pre + "-disable";
        if(that.args.switchLoop) return;
        $(that.$next).removeClass(className);
        $(that.$prev).removeClass(className);
        y = y || +that.$year.val();
        M = M || +that.$month.val();
        M === 1 || y === that.minDate.y && M === that.minDate.M && that.$prev.addClass(className);
        M === 12 || y === that.maxDate.y && M === that.maxDate.M && that.$next.addClass(className);
    }

    fn.bindEvents = function() {
        var that = this
            , switchHandle = function(e) {
                that.fixBtnStatus();
                that.renderDays(+that.$month.val(), +that.$year.val());
                that.args.onSwitch.call(that, {
                    y: +that.$year.val()
                    , M: +that.$month.val()
                }, that.$year, that.$month);
            };
        that.$year.change(function(e) {
            var curMonth = +that.$month.val();
            that.renderMonths(+that.$year.val());
            that.$month.val(curMonth);
            switchHandle(e);
        });
        that.$month.change(switchHandle);

        that.$prev.click(function(e) {
            e.preventDefault();
            if($(this).hasClass(that.pre + "-disable")) return;
            var M = +that.$month.val()
                , y = +that.$year.val();

            // redraw month panel
            y === that.maxDate.y && M === 1 && that.renderMonths(y - 1);

            that.args.switchLoop && y === that.minDate.y && M === that.minDate.M && that.renderMonths(that.maxDate.y);

            // overflow handle
            if(y === that.minDate.y && M === that.minDate.M) {

                // keep loop
                if(that.args.switchLoop) {
                    that.$month.val(that.maxDate.M);
                    that.$year.val(that.maxDate.y);
                }
            }

            else {
                if(M === 1) {
                    that.$month.val(12);
                    that.$year.val(y - 1);
                }
                else {
                    that.$month.val(M - 1);
                }
            }

            switchHandle();
        });

        that.$next.click(function(e) {
            e.preventDefault();
            if($(this).hasClass(that.pre + "-disable")) return;
            var M = +that.$month.val()
                , y = +that.$year.val();

            // redraw month panel
            y === that.minDate.y && M === that.minDate.M && that.renderMonths(y - 1);

            that.args.switchLoop && y === that.maxDate.y && M === that.maxDate.M && that.renderMonths(that.minDate.y);

            // overflow handle
            if(y === that.maxDate.y && M === that.maxDate.M) {

                // keep loop
                if(that.args.switchLoop) {
                    that.$month.val(1);
                    that.$year.val(that.minDate.y);
                }
            }

            else {
                if(M === 12) {
                    that.$month.val(1);
                    that.$year.val(y + 1);
                }
                else {
                    that.$month.val(M + 1);
                }
            }
            switchHandle();
        });

        that.$days.on("click", "li", function(e) {
            //e.preventDefault();
            !$(this).hasClass("mod-calendar-holder") && that.args.onClick.call(this, that.$year.val(), that.$month.val(), $(this).text());
        });
    }

    // jQuery plugin wraper
    $.fn.extend({
        /**
         * plugin
         *
         * @param {Object} argument comment
         */
        calendar: function(args) {
            return new calendar(this, args);
        }
    });

}(window, document, window.jQuery);
