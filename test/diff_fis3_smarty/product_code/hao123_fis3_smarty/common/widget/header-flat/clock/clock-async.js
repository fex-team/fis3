/*
 * CLOCK
 */
window.Gl || (window.Gl = {});

var $ = require("common:widget/ui/jquery/jquery.js"),
    __date = require("common:widget/ui/date/date.js"),
    time = require("common:widget/ui/time/time.js"),
    UT = require("common:widget/ui/ut/ut.js");
require("common:widget/ui/date-new/date.js");
//clock
//time & date & calendar
Gl.clock = function(el) {
    var _conf = conf.clock,
        $wraper = $(".userbar-date-wrapper"),
        $glo = $("#" + el),
        $el = $glo,
        url = _conf.url || "",
        title = _conf.title || "",
        tpl = _conf.tpl || '#{y}<span>/</span>#{m}<span>/</span>#{d}',
        moreTpl = '<div class="date-wrapper"></div><div class="date-tip"></div><div class="calendar-wrapper"></div>', // when has calendar
        rate = _conf.rate || 500,
        ssCache = 0, //seconds cache
        tim,  // for calendar timetamp
        format = function() {
            var date = time.getForm();

            if (date.ss === ssCache) return "";
            ssCache = date.ss; //update seconds
            return tpl.replaceTpl(date);
        },
        toNum   = function(n) {
            return parseInt(n, 10);
        };

    // open calendar
    if (_conf.headerTest && _conf.openCal === "1") {
        $glo.addClass('userbar-date-cal');
        $glo.html(moreTpl);

        $(document.body).on("click", function(e) {
            var $e = $(e.target);
            if (!$e.closest('.userbar-date-cal').length) {
                $glo.removeClass('date-open');
                $wraper.removeClass('userbar-date-new_mod-show');
            }
        });
        $(".calendar-wrapper", $glo).on("click", "a", function(e) {
            var $that = $(this),
                href = $that.attr("href");
            if (href == "" || href == "#") {
                e.preventDefault();
                e.stopPropagation();
            } else {
                UT.send({
                    position: "clickable",
                    sort: href,
                    type: "click",
                    modId: "date"
                });
            }
        }).on("mousedown", "a", function(e) {
            var $that = $(this),
                href = $that.attr("href");
            if (href == "" || href == "#") {
                e.preventDefault();
                e.stopPropagation();
            }
        });

        // create Calendar
        $glo.one("o.onceload", function() {
            $.ajax({
                url: "http://"+conf.country+".hao123.com/cmsdata?country="+conf.country+"&module=date&basemerge=true",
                dataType: "jsonp"
            }).done(function ( result ) {
                conf.calendar = result.data.calendar;
                require.async("common:widget/header-flat/clock/calendar-async.js", function(init) {
                    var wk = $.extend(true, [], conf.date.lunar && conf.date.lunar.wk );
                    init($glo, _conf.moreBtn, url, conf.calendar, conf.calendar.week || wk);
                });
            });
        });
        // add UT
        $glo.on("click", function(e) {
            var $e = $(e.target);
            if (!$e.closest('.calendar-wrapper').length) {
                $glo.toggleClass('date-open');
                $wraper.toggleClass('userbar-date-new_mod-show');
                UT.send({
                    ac: "b",
                    position: "control",
                    sort: $glo.hasClass('date-open') ? "open" : "close",
                    type: "click",
                    modId: "date"
                });
                e.preventDefault();
            }
        }).one("mouseenter", function() {
            $glo.trigger('o.onceload');
        }).on("click", ".mod-calendar_next", function(e) {
            UT.send({
                ac: "b",
                position: "control",
                sort: "next",
                type: "click",
                modId: "date"
            });
        }).on("click", ".mod-calendar_prev", function(e) {
            UT.send({
                ac: "b",
                position: "control",
                sort: "prev",
                type: "click",
                modId: "date"
            });
        }).on("click", ".dropdown", function(e) {
            UT.send({
                ac: "b",
                position: "control",
                sort: "select",
                type: "click",
                modId: "date"
            });
        }).on("mouseover", function(e) {
            var $e = $(e.target);
            if (!$e.closest('.calendar-wrapper').length) {
                $glo.addClass('calendar-open');
            } else {
                $glo.removeClass('calendar-open');
            }
        }).on("mouseout", function(e) {
            $glo.removeClass('calendar-open');
        });
        $(document.body).on("click", function(e) {
            //clearTimeout(tim);
            //tim = setTimeout(function() {
                $('.userbar-date .dropdown-arrow').each(function(index, ele) {
                    var that = $(this),
                        par = that.closest('.dropdown-trigger');
                    if (that.hasClass('dropdown-arrow-up')) {
                        par.addClass('dropdown-ctrl-open');
                    } else {
                        par.removeClass('dropdown-ctrl-open');
                    }
                });
            // }, 10);
        });
        $(window).load(function() {
            setTimeout( function() {
                $glo.trigger('o.onceload');
            }, 200);
        });
        $el = $glo.find(".date-wrapper");
    } else {
        $glo.on("click", "a", function(e) { // old UT log
            UT.send({
                position: "click",
                sort: "click",
                type: "click",
                modId: "date"
            });
        });
        if ( !! url) {
            tpl = '<a href="' + url + '" title="' + title + '">' + tpl + '</a>';
        }
    }
    //display local time when initialize
    $el.html(format(new Date));
    $wraper.addClass('animate-opacity');

    timer = setInterval(function() {
        var html = format();

        //render the time
        if (html) $el.html(html);
    }, rate);
}
