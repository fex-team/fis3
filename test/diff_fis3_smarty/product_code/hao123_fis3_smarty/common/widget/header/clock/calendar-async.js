var $ = require("common:widget/ui/jquery/jquery.js"),
	__date = require("common:widget/ui/date/date.js"),
	time = require("common:widget/ui/time/time.js"),
	UT = require("common:widget/ui/ut/ut.js");
require("common:widget/ui/date-new/date.js");

var calenPath = { // plugin path
	  'isl': 'isl',
	  'buddhist': 'buddhist',
	  'rokuyou': 'rokuyou',
	  'lunar': 'lunar'
    },
    parseToArr = function(obj, fix) {
    	fix = fix || "value";
    	var i   = 0,
    	    j   = obj.length,
    	    arr = [];
    	for(; i < j; i++) {
    		arr.push(obj[i][fix] || obj[i]);
    	}
    	return arr;
    },
    _conf   = conf.calendar || {},
    seCalen = _conf.secondCalendar, // 副日历名称
    dateMsg = _conf.dateMsg || {},
    holiday = {},
    events  = {},
    festival = {},
    normal  = {},
    lyl     = parseToArr(_conf.rokuyou || []),
    organizeToHash = function(data, kind) {
    	if(!data) {return {};}
    	var newData = {},
    		tmpObj = {};
    	for (var i = 0, j = data.length; i < j; i++) {
    		tmpObj = data[i];
    		if(!tmpObj) continue;
    		newData["d" + tmpObj.date] = {
    			kind: tmpObj.kind || kind,
    			title: tmpObj.title,
    			url: tmpObj.url
    		}
    	}
    	return newData;
    };

holiday = organizeToHash(dateMsg["holiday"], "holiday"); // format data for easy handle
events = organizeToHash(dateMsg["events"], "event"); // format data for easy handle
festival = organizeToHash(dateMsg["festival"], "festival"); // format data for easy handle
normal = organizeToHash(dateMsg["normal"]); // format data for easy handle

var calenTpl = '<div class="ui-bubble ui-bubble-t mod-calendar"><b class="ui-arrow ui-bubble_out"></b><b class="ui-arrow ui-bubble_in"></b><div class="mod-calendar_hd"><span class="mod-calendar_next">→</span><span class="mod-calendar_prev">←</span><select class="mod-calendar_year" id="calYear"></select><select class="mod-calendar_month" id="calMonth"></select></div><div class="mod-calendar_bd"><ul class="mod-calendar_grid mod-calendar_weeks cf"></ul><ul class="mod-calendar_grid mod-calendar_days cf"></ul></div><div class="mod-calendar_ft"></div></div>',
    toDate = function(y, M, d) {
    	/*var date = new Date();
    	date.setFullYear(y);
    	date.setDate(d);
    	date.setMonth(M - 1);*/
	    return new Date(y, M - 1, d);
    },
    formatDate = function(y, M, d) {
    	return ('d' + y + '-' + M + '-' + d);
    },
    getItemData = function(y, M, d) {
    	var str = formatDate(y, M, d),
    	    obj = {},
    	    ymd = {};

    	obj = normal[str] || events[str] || holiday[str] || festival[str] || null;
    	if(obj) {
    		if(obj.kind) {
    			ymd.className = 'class=mod-calendar-' + obj.kind;
    		}
    		if(obj.title) {
    			ymd.info = obj.title;
    		}
    		if(obj.url) {
    			ymd.url = obj.url;
    		}
    		ymd.noLink = "";
    		if(obj.url == "" || obj.url == "#") {
    			ymd.noLink = "no-link";
    		}
    	}
    	return ymd;
    },
    calenFuncMap = {
    	'isl': function(y, M, d) {
    		var date = Date.toIsl(toDate(y, M, d)),
    		    islM = parseToArr(_conf.islMonth || []);
    		if(islM && date.id == "1") {
    			return islM[date.im - 1] || "";
    		}
    		return date.id || "";
    	},
    	'rokuyou': function(y, M, d) {
    		var date = toDate(y, M, d);
    		return lyl[Date.toLyl(date).jl] || "";
    	},
    	'lunar': function(y, M, d) {
    		var lunarObj = __date.toLunar(y, M, d),
    		    str      = lunarObj.cd || "";
		    if (_conf.lunarNumber === "1") {
			    return str + (str == "1" ? ("/" + lunarObj.cm) : "");
		    } else {
			    return str == "1" ? lunarObj.CM : (lunarObj.CD || "");
		    }
    	},
    	'buddhist': function(y, M, d) {
    		return "";
    	}
    },
    callback = function($glo, moreBtn, url, _co, week, countDown) {
    	var params = {
			footer: moreBtn ? ('<a href="' + url + '">' + moreBtn + '</a>') : '',
			onFilterDays: function(data) {
				data.noLink = "no-link";
				if(seCalen && calenFuncMap[seCalen]) {
					data.info = calenFuncMap[seCalen](data.y, data.M, data.d);
				}
				$.extend(data, getItemData(data.y, data.M, data.d));
				return data;
			},
			onSwitch: function(data, $y, $m) {
				$("#calYearList").find("li").filter(function() {
					return $(this).attr("value") == data.y;
				}).trigger("mousedown.dropdownlist");
				$("#calMonthList").find("li").filter(function() {
					return $(this).attr("value") == data.M;
				}).trigger("mousedown.dropdownlist");
			},
			countDown: countDown ? countDown : ""
		};
		if(_co.useAbbrMonth === '1' && _co.abbrMonth) {
			var abbrM = parseToArr(_co.abbrMonth);
			params.fixMonth = function(i) {
				return abbrM[i - 1] || "";
			};
		}
		if(seCalen === "buddhist") {
			params.fixYear = function(i) {
				return i + (parseInt(_co.fixYear, 10) || 543);
			};
		}
		if (_co.yearFrom) {
			params.minDate = _co.yearFrom;
		}
		if (_co.yearTo) {
			params.maxDate = _co.yearTo;
		}
		if (_co.isAbbrWeek === "1") {
			params.isAbbrWeek = true;
		} else {
			params.isAbbrWeek = false;
		}
		if (_co.beginDay) {
			params.beginDay = parseInt(_co.beginDay, 10);
		}
		if (week && week.length) {
			params.weeks = parseToArr(week);
		}
		params.switchLoop = true;
		$('.mod-calendar', $glo).calendar(params);
		require.async("common:widget/ui/dropdownlist/dropdownlist.js", function(dropdown) {
			new dropdown({
				selector: "calYear",
				defIndex: $("#calYear").get(0).selectedIndex,
				supportSubmit: 1
			});
			new dropdown({
				selector: "calMonth",
				defIndex: $("#calMonth").get(0).selectedIndex,
				supportSubmit: 1
			});
		});
    };
// require的文件必须为字符串吗？变量拼接的获取不到！
var init = function($glo, moreBtn, url, _co, week, countDown) {
	$('.calendar-wrapper', $glo).html(calenTpl);
	if (seCalen && calenPath[seCalen]) {
		if (calenPath[seCalen] === "rokuyou") {
			require.async(["common:widget/ui/calendar/calendar.js", "common:widget/ui/date-new/plugin/rokuyou.js"], function() {
				callback($glo, moreBtn, url, _co, week, countDown);
			});
		} else if (calenPath[seCalen] === "isl") {
			require.async(["common:widget/ui/calendar/calendar.js", "common:widget/ui/date-new/plugin/isl.js"], function() {
				callback($glo, moreBtn, url, _co, week, countDown);
			});
		} else if (calenPath[seCalen] === "buddhist") {
			require.async(["common:widget/ui/calendar/calendar.js", "common:widget/ui/date-new/plugin/buddhist.js"], function() {
				callback($glo, moreBtn, url, _co, week, countDown);
			});
		} else if (calenPath[seCalen] === "lunar") {
			require.async(["common:widget/ui/calendar/calendar.js", "common:widget/ui/date-new/plugin/lunar.js"], function() {
				callback($glo, moreBtn, url, _co, week, countDown);
			});
		}
	} else {
		require.async(["common:widget/ui/calendar/calendar.js"], function() {
			callback($glo, moreBtn, url, _co, week, countDown);
		});
	}
};
module.exports = init;