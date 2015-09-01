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
        // <!-- countdown-conf-start
        _con = _conf.countdown,
        _worldcupConf = _conf.headerWorldcup || {},
        _co = conf.calendar || {},
        timeFor = [],
        yMd = [],
        hms = [],
        tDate = new Date(),
        res = '',
        isNewMo = _con.newMod ? "0" : "",
        timeTpl = '<span class="down-day">#{d}</span><span class="down-dhm"><span class="down-d">' + (_con && _con.day) + '</span><br /><span class="down-hm">#{h}:#{m}</span></span>',
        countTpl = '<div class="down-wrapper"><span class="down-tip">#{content1}<br />#{content2}</span><span class="down-time"></span></div>',
        worldCupTpl =   '<div class="worldcup cf">'
                        +    '<div class="match-info">'
                        +        '<div class="des">#{matchDes}</div>'
                        +        '<div class="time">#{matchTime}</div>'
                        +    '</div>'
                        +    '<div class="team-vs">'
                        +        '<img src="#{firstTeamIcon}" class="first-team" title="#{firstTeamName}" alt="#{firstTeamName}" width="36" height="37" />'
                        +        '<span class="team-vs-icon"></span>'
                        +        '<img src="#{secondTeamIcon}" class="second-team" title="#{secondTeamName}" alt="#{secondTeamName}" width="36" height="37" />'
                        +    '</div>'
                        +'</div>',
        // countdown-conf-end -->
        $wraper = $(".userbar-date-wrapper"),
        $glo = $("#" + el),
        $el = $glo,
        $down = {}, // countdown time change wrapper
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
        },
        formatCount = function() { // get diff between now date and conf date
            var diffRe = {},
                nowDate = new Date();
            if (tDate.getTime() > nowDate.getTime()) {
                diffRe = nowDate.diff(tDate);
                diffRe.d = diffRe.d > 9 ? diffRe.d : isNewMo + diffRe.d;
                diffRe.h = diffRe.h > 9 ? diffRe.h : '0' + diffRe.h;
                diffRe.m = diffRe.m > 9 ? diffRe.m : '0' + diffRe.m;
                return timeTpl.replaceTpl(diffRe);
            } else {
                return "";
            }
        };

	// open calendar
	if (_conf.headerTest && _conf.openCal === "1") {
		$glo.addClass('userbar-date-cal');
		$glo.html(moreTpl);

		$(document.body).on("click", function(e) {
			var $e = $(e.target);
			if (!$e.closest('.userbar-date-cal').length) {
				$glo.removeClass('date-open');
			}
		});
		$(".calendar-wrapper", $glo).on("click", "a", function(e) {
			var $that = $(this),
			    href  = $that.attr("href");
			if(href == "" || href == "#") {
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
			    href  = $that.attr("href");
			if(href == "" || href == "#") {
				e.preventDefault();
				e.stopPropagation();
			}
		});

		// create Calendar
		$glo.one("o.onceload", function() {
			require.async("common:widget/header/clock/calendar-async.js", function(init) {
				var wk = $.extend(true, [], conf.date.lunar && conf.date.lunar.wk);
				init($glo, _conf.moreBtn, url, _co, _co.weeks || wk, _con.time);
			});
		});
		// add UT
		$glo.on("click", function(e) {
			var $e = $(e.target);
			if (!$e.closest('.calendar-wrapper').length) {
				$glo.toggleClass('date-open');
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
		$(window).load(function() {
			$glo.trigger('o.onceload');
		});
		$el = $glo.find(".date-wrapper");

        if( _worldcupConf.isHidden === "0" ){
            var html = worldCupTpl.replaceTpl( _worldcupConf );
            $wraper.addClass( "userbar-data-worldcup" );
            $el.after( html );
            $el.hide();
            // _worldcupConf.width && $glo.css( "width", _worldcupConf.width + "px" );
        }else if (_con && _con.isHidden === "0" && _con.time) { // countdown
            timeFor = _con.time.split("_");
            yMd = timeFor[0].split("-");
            hms = timeFor[1].split(":");

			tDate = new Date(toNum(yMd[0]), toNum(yMd[1]) - 1, toNum(yMd[2]), toNum(hms[0]), toNum(hms[1]), toNum(hms[2]));
	        /*tDate.setFullYear(parseInt(yMd[0], 10));
	        tDate.setDate(parseInt(yMd[2], 10));
		    tDate.setMonth(parseInt(yMd[1], 10) - 1);

	        tDate.setHours(parseInt(hms[0], 10));
	        tDate.setMinutes(parseInt(hms[1], 10));
	        tDate.setSeconds(parseInt(hms[2], 10));*/

	        res = formatCount();
	        if(res) {
	        	if(_con.newMod === "1") {
	        		$wraper.addClass('userbar-date-new_mod userbar-date-new_mod1');
	        		_con.newModImg && $wraper.css("background-image", "url(" + _con.newModImg + ")");
	        		_con.newModWidth && $wraper.css("width", _con.newModWidth + "px");
	        	} else if(_con.newMod === "2") {
	        		$wraper.addClass('userbar-date-new_mod userbar-date-new_mod2');
	        		_con.newModImg && $wraper.css("background-image", "url(" + _con.newModImg + ")");
	        		_con.newModWidth && $wraper.css("width", _con.newModWidth + "px");
	        	}
	        	$el.after(countTpl.replaceTpl(_con));
	        	$glo.addClass('down-show');
	            $down = $glo.find(".down-time");
	            $down.html(res);
	            $el.hide();
	        }
	        var downTimer = setInterval(function() {
		        res = formatCount();
		        if(res) {
	                $down.html(res);
	                $el.hide();
	            } else {
	            	$wraper.removeClass('userbar-date-new_mod userbar-date-new_mod1 userbar-date-new_mod2');
					$wraper.css({
						"background-image": "none",
						"width": "auto"
					});
	                $glo.find(".down-wrapper").remove();
	                $glo.removeClass('down-show');
	                $el.show();
	                clearInterval(downTimer);
	            }
	        }, _con.rate || 20000);
		}
	} else {
		$glo.on("click", "a", function(e) { // old UT log
			UT.send({
				position: "click",
				sort: "click",
				type: "click",
				modId: "date"
			});
		});
		if (!!url) {
			tpl = '<a href="' + url + '" title="' + title + '">' + tpl + '</a>';
		}
	}
	//display local time when initialize
	$el.html(format(new Date));

	timer = setInterval(function() {
		var html = format();
		
		//render the time
		if(html) $el.html(html);
	}, rate);
}