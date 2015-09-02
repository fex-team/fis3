/*
* Weather
*/

var $ = require("common:widget/ui/jquery/jquery.js"),
	helper = require("common:widget/ui/helper/helper.js"),
	date = require("common:widget/ui/date/date.js"),
	UT = require('common:widget/ui/ut/ut.js');

var isTested = true;

var iconGroup = [];

var TPL_CONF = {
	tpl: '<li class="#{className}"><img src="#{' + (isTested? 'iconBig': 'iconSmall') + '}" title="#{descrip}"><div class="weather-info"><p class="text">#{day}</p><span class="temperature_p">#{temperature}</span><span title="#{humidity}" style="display: inline-block;"><i class="dot_img"></i><span class="temperature_hum">#{avehumidity}%</span></span></div></li>',
	tplMoreDate: '<li class="#{className}"><a href="#{link}" data-sort="accu"><p class="wea-fl"><span>#{week}</span><span class="wea-small">#{date}</span></p><img src="#{iconBig}" title="#{descrip}"><p class="wea-fr"><span class="temperature_big">#{temperature}</span></p></a></li>',
	tplMoreDay: '<li class="#{className}"><a href="#{link}" data-sort="accu"><p>#{day}</p><img src="#{iconDefault}" title="#{descrip}"><p><span class="temperature_big">#{temperature}</span>' + (isTested? '<br /><span class="weather-more_tip-remind">#{descrip}</span>': '') + '</p></a></li>',
	tplWeatherRemind: '<div class="userbar-weather_tip"><div class="arrow"><div class="arrow_bg"></div></div><i class="tips-light"></i><p>#{remind}</p><span id="tipsClose" class="tips-close"></span></div>',
	tplWeatherltr: '<div class="userbar-weather_console"><div class="userbar-weather_city"><div class="userbar-weather_city-cur"><a id="selectWeatherCity" onClick="return false;" href="#" title="#{selectCity}"></a></div><div id="weatherCityLayer" class="box box-prompt city-select" style="display:none"><div class="box-prompt-inner">'+ (isTested? '<a href="javascript:void(0)" onClick="return false;" id="weatherCity_close" class="weather_close-btn">X</a><p class="weather_cur-city" id="weatherCurSity"></p>':'') + '<p><label>#{area}</label><select id="weatherCity_area"></select></p><p><label>#{city}</label><select id="weatherCity_city"></select></p><p class="btn-bar"><a id="weatherCity_save" href="#" type="submit" class="mod-btn_normal" onClick="return false">#{okBtn}</a><a id="weatherCity_cancel" href="#" type="submit" class="mod-btn_cancel" onClick="return false">#{cancelBtn}</a></p></div></div></div><a href="#" id="weatherMoreBtn" class="weather-days" hidefocus="true" onclick="return false;"><p>#{moreDays}</p></a></div><div class="fl"><ul id="weatherView"><noscript>#{noScript}</noscript></ul></div>',
	tplWeatherrtl: '<ul id="weatherView" class="fl"><noscript>#{noScript}</noscript></ul><div class="userbar-weather_console"><div class="userbar-weather_city"><div class="userbar-weather_city-cur"><a id="selectWeatherCity" onClick="return false;" href="#" title="#{selectCity}"></a></div><div id="weatherCityLayer" class="box box-prompt city-select" style="display:none"><div class="box-prompt-inner">'+ (isTested? '<a href="javascript:void(0)" onClick="return false;" id="weatherCity_close" class="weather_close-btn">X</a><p class="weather_cur-city" id="weatherCurSity"></p>':'') + '<p><label>#{area}</label><select id="weatherCity_area"></select></p><p><label>#{city}</label><select id="weatherCity_city"></select></p><p class="btn-bar"><a id="weatherCity_save" href="#" type="submit" class="mod-btn_normal" onClick="return false">#{okBtn}</a><a id="weatherCity_cancel" href="#" type="submit" class="mod-btn_cancel" onClick="return false">#{cancelBtn}</a></p></div></div></div><a href="#" id="weatherMoreBtn" class="weather-days" hidefocus="true" onclick="return false;"><p>#{moreDays}></p></a></div>',
	tplWeatherOrigin: '<a href="#{url}" class="weather-origin" id="weatherOrigin" data-sort="accu">#{text}</a>'
};

window.Gl || (window.Gl = {});
Gl.weather = {
	loadImgOnce: false,
	weatherWrap: "",
	rendered: false,
	tn: helper.getQuery(location.href).tn,
	init: function(weatherCityDir) {
		if($.store("weatherCity")){
			if($.store("weatherCity").indexOf("zmw:") > -1){
				$.store("weatherCity", conf.weather.defaultCity, {expires: 2000});
			}
		}else if($.cookie("weatherCity")){
			$.cookie("weatherCity", null);
		}
		var that = this,
			//default city
			cityId = that.cityId = ($.store("weatherCity") || conf.weather.defaultCity);

		conf.weather.bigIconPath = conf.weather.bigIconPath + "/";
		conf.weather.smallIconPath = conf.weather.smallIconPath + "/";

		// faster to see weather
        setTimeout(function() {
			$("#weather").html(helper.replaceTpl(TPL_CONF["tplWeather" + conf.dir], conf.weather.dataGroup));

			$.getJSON(weatherCityDir, function(data) {

				conf.weatherCity = data;
				that.bindEvent(that);
				that.requestData();
				$("#weatherWrap").css("visibility", "visible");

			});
		}, 60);
		//});
	},

	requestData: function() {
		var that = Gl.weather,
			cityId = that.cityId,
			weatherView = $("#weatherView"),
			url = conf.weather.prefixUrl + cityId + ".js?" + ~(new Date()/144e5);
		//define "weatherData" before request
		conf.weatherData || (conf.weatherData = {});

		//clear the weatherView because there maybe show error info
		weatherView.html("");

		//request weather data and render
		$.getScript(url, function() {

			// console.log(conf.weatherData[cityId]);
			that.render(conf.weatherData[cityId]);
			//that.loadSuc = true;
		}, function() {

			//still show the city name so that user can change another one
			$("#selectWeatherCity").html(conf.weatherCity[cityId]);

			//if request failed or timeout tell user retry
			weatherView.html('<span onClick="Gl.weather.requestData()" style="text-decoration:underline; cursor:pointer;">' + conf.weather.tips.loadError + '</span>');
		});
	},

	/*
	 *是否来自指定的渠道
	 *PM会配置一个以|分割的字符串，用来区分多个渠道
	 */
	isFromSpTn : function(){
		var _conf = conf.weather,
			oldWeather = _conf.userFrom,
			newWeather = _conf.testUserFrom,
			arr = [],
			bool = false;

		isTested ? arr = newWeather.split( "|" ) : arr = oldWeather.split( "|" );

		for(var i=0, len=arr.length; i<len; i++){

			if(this.tn === arr[i]){

				bool =  true;
				break;
			}
		}

		return bool;
	},

	/*
	 * 当该用户来自PM指定的渠道时，默认展开weather
	 * 兼容新版和旧版weather
	 *  @param userFrom 标记用户来自哪个渠道的tn值
	 */
	showWeather : function(){

		var moreWrap = $( "#weatherMoreWrap" ),
			moreBtn = $( "#weatherMoreBtn" ),
			weatherWrapTest  = $("#weatherWrap"),
			//weatherArrowTest = $(".weather-wrap_arrow", weatherWrapTest),
			weatherClkTip    = $("#weatherClkTip"),
			changeCity       = $("#selectWeatherCity"),
			changeCityPar    = changeCity.parent(),
			weatherControl   = $(".userbar-weather_console");

		if( isTested ){
			moreWrap.attr("data-status", "1");
			moreWrap.css("display", "block");
			//weatherArrowTest.css("display", "block");
			weatherClkTip.addClass("weather-tip_up");
			weatherWrapTest.addClass('weather-wrap-open');
			changeCityPar.css("display", "block");
			weatherControl.css("display", "block");

		}else{

			moreWrap.addClass( "weather-more_show" );
			moreBtn.addClass( "weather-days_click" );
			moreWrap.hide();
			moreWrap.slideDown( 400 );
		}
	},

	bindEvent: function(that) {
		var moreWrap         = $("#weatherMoreWrap"),
			moreBtn          = $("#weatherMoreBtn"),
			weatherWrapTest  = $("#weatherWrap"),
			//weatherArrowTest = $(".weather-wrap_arrow", weatherWrapTest),
			weatherClkTip    = $("#weatherClkTip"),
			cityLay          = $("#weatherCityLayer"),
			changeCity       = $("#selectWeatherCity"),
			changeCityPar    = changeCity.parent(),
			weatherControl   = $(".userbar-weather_console"),
			thi         = this,
			tipsClose   = $("#tipsClose"),
			cityListDir = "common:widget/ui/weather/" + conf.country + "/" + conf.country + "_flat.js",
			loadImageAsync = function() {
				if(!thi.rendered && thi.weatherWrap) {
					$("#weatherMore").html(thi.weatherWrap);
					$("li:even", weatherMore).addClass("weather-more_odd");
					thi.rendered = true;
				}
			};

		$( window ).one( "weather.show", function() {

			loadImageAsync();
			that.showWeather();

		} );

		var changeStatus = that.changeStatus = function(status) {
			if (status) {
				moreWrap.attr("data-status", "0");
				moreWrap.hide();
				//weatherArrowTest.hide();
				weatherClkTip.removeClass("weather-tip_up");
				weatherWrapTest.removeClass('weather-wrap-open');
				changeCityPar.hide();
				weatherControl.hide();
			} else {
				moreWrap.attr("data-status", "1");
				moreWrap.show();
				//weatherArrowTest.show();
				weatherClkTip.addClass("weather-tip_up");
				weatherWrapTest.addClass('weather-wrap-open');
				changeCityPar.show();
				weatherControl.show();
			}
		};

		//bind weatherCity select
		changeCity.on("click", function(e) {
			if(isTested) {
				$("#weatherCurSity").html($(e.target).html());
			}
			that.cityLayerChanger();
			require.async(cityListDir);
		});

		moreBtn.on("click.old", function () {
			if ($(this).hasClass("weather-days_click")) {
				moreWrap.slideUp(400, function () {
					moreBtn.removeClass("weather-days_click");
					moreWrap.removeClass("weather-more_show");
					moreWrap.show();
				});
			} else {
				moreWrap.addClass("weather-more_show");
				moreBtn.addClass("weather-days_click");
				moreWrap.hide();
				moreWrap.slideDown(400);
			}

		}).on("mouseenter click", function () {
			loadImageAsync();
		});

		$(window).on("load", function() {
			loadImageAsync();
		});
		if (isTested) {
			moreBtn.off(".old");
			$("#weather .fl,#weatherClkTip").on("mouseenter click", function() {
				loadImageAsync();
			}).on("click", function() {
				if (moreWrap.attr("data-status") === "1") {
					changeStatus(true);
				} else {
					changeStatus();
				}
			});
			cityLay.on("click", "a", function() {
				//weatherArrowTest.hide();
				weatherClkTip.removeClass("weather-tip_up");
				weatherWrapTest.removeClass('weather-wrap-open');
			});
			$("#weatherCity_close").on("click",function() {
				cityLay.hide();
			});
			$("#weatherCity_save, #weatherCity_cancel").on("click",function() {
				cityLay.hide();
				setTimeout(function() {
					changeStatus();
				}, 2);
			});

			// UT
			$("#weather").on("click", function(e) {
				var $tar = $(e.target);
				if ($tar.closest("a").length > 0) {
					UT.send({
						position: "click",
						sort: "click",
						type: "click",
						modId: "weather"
					});
				} else if ($tar.closest("#weatherView").length > 0) {
					UT.send({
						position: "click",
						ac: "b",
						sort: "click",
						type: "click",
						modId: "weather"
					});
				} else if ($tar.closest('.dropdown').length > 0) {
					UT.send({
						position: "click",
						ac: "b",
						sort: "click",
						type: "click",
						modId: "weather"
					});
				}
			});
		}

		$(document).on("mousedown", function (e) {
			var el = e.target;
			el.parentNode === moreBtn[0] && (el = el.parentNode);
			if (isTested) {
				if ($(el).closest("#weatherWrap").length < 1) {
					changeStatus(true);
				}
			} else {
				if ($(el).parents(".userbar-wrap").length === 0 && el !== moreBtn[0] && el !== moreWrap[0] && !jQuery.contains(moreWrap[0], el)) {
					moreWrap.slideUp(400, function() {
						moreBtn.removeClass("weather-days_click");
						moreWrap.removeClass("weather-more_show");
						moreWrap.show();
					});
				}
			}
		});

		tipsClose.live("mouseover", function() {
			$(this).addClass("tips-close_hover");

		}).live("mouseout", function() {
			$(this).removeClass("tips-close_hover");

		}).live("click", function() {
			var date = new Date();
			date.setTime(date.getTime() + 4*60*60*1000);
			$.store("weatherTipClose", $.store("weatherCity") || conf.weather.defaultCity, {expires: date});
			$(".userbar-weather_tip").remove();
		});
	},

	//control the cityLayer show or hide
	cityLayerChanger: function(hide) {
		var parent = $("#selectWeatherCity").parent(),
			wrap = $("#weatherCityLayer"),
			style = wrap.css("display");

		var moreWrap = $("#weatherMoreWrap"),
			weatherWrapTest = $("#weatherWrap"),
			//weatherArrowTest = $(".weather-wrap_arrow", weatherWrapTest),
			weatherClkTip = $("#weatherClkTip");

		if(isTested) {
			moreWrap.attr("data-status", "0");
			moreWrap.hide();
			parent.hide();
		}
		if(style === "none") {
			parent.addClass("city-click");
			wrap.show();
			if(isTested) {
				//weatherArrowTest.show();
				weatherClkTip.addClass("weather-tip_up");
				weatherWrapTest.addClass('weather-wrap-open');
			}
		} else {
			parent.removeClass("city-click");
			wrap.hide();
			if(isTested) {
				//weatherArrowTest.hide();
				weatherClkTip.removeClass("weather-tip_up");
				weatherWrapTest.removeClass('weather-wrap-open');
			}
		}
	},

	fixData: function(data) {
		//data.city = conf.weatherCity[data.city];
		data.date = data.date.split("-")[2];
		data.week = conf.date.lunar.wk[data.week];
		data.day = conf.date.day[data.day];
		// data.url = "http://www.weather.com/weather/today/" + this.cityId;
		return data;
	},

	//format the native data
	formatData: function(data, n) {
		var _conf = conf.weather,
			curHour = (Gl.serverNow || new Date).getHours(),
			date = data.date.split("-"),
			dateFormat = _conf.dateFormat || 'ymd',
			dateMap = [],
			connector = _conf.connector || '/',
			week = new Date();
		week.setFullYear(date[0]);
		week.setDate(date[2]);
		week.setMonth(Number(date[1])-1); //set date first to prevent wrong month when the date is 31
		week = week.getDay();

		dateMap['y'] = date[0];
		dateMap['m'] = date[1];
		dateMap['d'] = date[2];

		data = 6 < curHour && curHour < 18 ? (data.day || data.night) : (data.night || data.day);

		//this.iconPath.push(_conf.bigIconPath + data.icon + ".png"); // weather image async loaded

		var iconBigPath   = "";
		var iconSmallPath = "";
		if(isTested) {
			iconSmallPath = _conf.testSmallIcon;
			iconBigPath = _conf.testBigIcon + "1/";
		} else {
			iconSmallPath = _conf.smallIconPath;
			iconBigPath = _conf.bigIconPath;
		}
		var frontTemp = _conf.tempHtoL ? Math.round(data.hi) : Math.round(data.low);
		var backTemp = _conf.tempHtoL ? Math.round(data.low) : Math.round(data.hi);
		return {
			hi: data.hi !== "" ? "~" + Math.round(data.hi) : "",
			low: Math.round(data.low),
			temperature: _conf.tempHtoL ? frontTemp + _conf.tempUnit + _conf.tempConcat + backTemp + _conf.tempUnit : frontTemp + '~' + backTemp + '℃',
			icon: data.icon,
			iconDefault: _conf.testDefaultIcon + data.icon + ".png",
			iconSmall: iconSmallPath + data.icon + ".png",	//only show daytime's icon
			iconBig: iconBigPath + data.icon + ".png",	//only show daytime's icon
			title: _conf.tips.click,
			humidity: _conf.humidity || "humidity",
			tips: data.tips,
			descrip: data.des, // weather description
			day: conf.date.day[n],
			date: dateMap[dateFormat.charAt(0)] + connector + dateMap[dateFormat.charAt(1)] + connector + dateMap[dateFormat.charAt(2)],
			week: conf.date.lunar.wk[week],
			avehumidity:data.avehumidity,
			// url: "http://www.weather.com/weather/"+ _conf.dayUrl[n] +"/" + this.cityId,
			className: data.hi !== "" ? "" : "onlyone"	//add a new key about className and set the default value
		};
	},
	render: function(datas) {

		var	that = this,
			data = datas.data,
			temp = "",
			tempMore = "",
			cls = "",
			tpl = TPL_CONF.tpl,
			tplMoreDate = TPL_CONF.tplMoreDate,
			tplMoreDay = TPL_CONF.tplMoreDay,
			tplWeatherRemind = TPL_CONF.tplWeatherRemind,
			tplWeatherOrigin = TPL_CONF.tplWeatherOrigin,
			weatherView = $("#weatherView"),
			weatherMore = $("#weatherMore"),
			weatherBar = $(".userbar-weather").eq(0),
			weatherRemind = "",
			curDate = (Gl.serverNow || new Date).getDate(),
			isFromSpcTn = that.isFromSpTn(),
			weatherMoreLine = $('#weatherMoreWrap').find('.weather-more_line'),
			weatherOrigin = $('#weatherOrigin'),
			weatherWrap = $('#weatherWrap');

		//modify the data ref from native data
		if (isTested && (data[0].date.split("-"))[2] != curDate) {
			data = data.slice(1, conf.weather.dataLength+1);
		} else {
			data = data.slice(0, conf.weather.dataLength);
		}
		// data = conf.weather.dataRef(data);

		//updata cityName by cookie or default
		$("#selectWeatherCity").html(conf.weatherCity[that.cityId]);

		iconGroup = [];

		$.each(data, function(key, val) {
			var dateSub = ~~(data[key].date.split("-")[2]) - curDate;
			if ( dateSub === 0 ) {
				val = that.formatData(val, 0);
				weatherRemind = val.tips;
				if (key === 4) {
					val.className += " l-g0";
				} else {
					val.className += " l-g1-5";
				}
				val.className += " weather-more_today";
				tempMore += helper.replaceTpl(tplMoreDay, $.extend(val, { link: datas.link }));
			} else {
				val = that.formatData(val, key);
				if (key === 4) {
					val.className += " l-g0";
				} else {
					val.className += " l-g1-5";
				}
				tempMore += helper.replaceTpl(tplMoreDate, $.extend(val, { link: datas.link }));
			}
			iconGroup.push(val.icon);
		});

		if (conf.weather.infoFromText) {
			weatherMoreLine.addClass('weather-origin_wrap');
			tempMore += helper.replaceTpl(tplWeatherOrigin, {text:conf.weather.infoFromText, url:datas.link});
		}
		if(that.loadImgOnce) {
			weatherMore.html(tempMore);
			$("li:even", weatherMore).addClass("weather-more_odd");
		} else {
			that.loadImgOnce = true;
			that.weatherWrap = tempMore;
		}

		// diff today to weather data's date
		data.splice(0, curDate - ~~(data[0].date.split("-")[2]));
		$.each(data, function(key, val) {
			val = that.formatData(val, key);
			//modify the className by key or length
			// key === 0 && (val.className += " cur");
			key === 1 && (val.className += " weather_last");
			//val.week.length <= 9 && (val.className += " short");

			//at most view 2 col
			if(key === 2) return false;
			temp += helper.replaceTpl(tpl, val);
		});
		weatherView.html(temp);
		weatherWrap.addClass('animate-opacity');

		$(".userbar-weather_tip").remove(); // remove before tips

		// weather remind show when remind switch on && cookie expires && remind words exist
		if(conf.weather.remindSwitch === 'on' && ( ($.store("weatherTipClose") !== $.store("weatherCity")) || !$.store("weatherTipClose")) && weatherRemind) {
			weatherBar.append(helper.replaceTpl(tplWeatherRemind, {remind: weatherRemind}));
		}

		if(isTested) {
			weatherView.find(".text").html(conf.weatherCity[that.cityId]);
			if($.trim(conf.weather.testWidth)) {
				$("#weather").find(".fl").width(conf.weather.testWidth);
			}
		}

		//当用户来自PM设置的特殊渠道时会被触发
		if( isFromSpcTn ){
			$( window ).trigger( "weather.show" );
		}
	}
};

module.exports = Gl;
