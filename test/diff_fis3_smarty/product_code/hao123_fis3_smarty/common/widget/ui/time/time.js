/*
*	UI component for get server time and date format
*	V1.1.0
*	@Frank Feng
*/

var $ = require('common:widget/ui/jquery/jquery.js'),
	D = require('common:widget/ui/date/date.js');

window.Gl || (window.Gl = {});

Gl.time = function () {
	var imgUrl = "/static/web/common/img/gut.gif",
		rate = 1000,
		i = 0,
		isGet = false,	//whether has got the server time
		_date;
	return {
		getTime: function (callback) {
			//add callback parameter for other modules to do their own business after obtaining the server time
			//get the time difference to prevent the errors which caused by users changed the local time
			//two ways to fix the bug: 1. setInterval 2. local time difference, the 2nd way takes precedence

			var render = function (date) {
				date = date ? ((date = date.getResponseHeader("Date")) ? new Date(date) : new Date) : new Date;
				var startTime = new Date,	//get time stamp of the xhr
				diff = function() {
					var n = new Date - startTime,	//2. local time difference
						_n = ++i * rate;		//1. setInterval

					//calc in 1 minute
					return Math.abs(n - _n) > 1000*60 ? _n : n;
				},
				timer = setInterval(function() {
					//render time with the time difference
					(_date = new Date(date.getTime())).setMilliseconds(_date.getMilliseconds() + diff());
					//obligate interface to get the server time
					Gl.serverNow = _date;
				}, rate);

				isGet = true; // get time process is done
			},

			get = function () {
				var xhr = $.ajax({
					url: imgUrl,
					cache: false,
					error: function() {
						//if there has an error such as 404, we can also get the head
						render(xhr);
						callback && callback();
					},
					success: function(data, textStatus, jqXHR) {
						render(jqXHR);
						callback && callback();
					}
				});
			};

			if(!isGet){
				get();
			}else{
				callback && callback();
			}

			return _date ? _date : new Date;
		},

		getForm: function(date) {
			var ymd,
				islYmd,
				lunarDate,
				islDate,
				newDate = new Date(),
				_date = {},
				islDateFix = conf.clock.islDateFix ? ~~conf.clock.islDateFix : 0,
				n;

			date = date ? date : Gl.time.getTime();

			ymd = D.getDate(date);

			//set date controler to date
			newDate.setTime(date);
			newDate.setDate(date.getDate() + islDateFix);

			islYmd = D.getDate(newDate);

			lunarDate = D.formatLunar(ymd.y, ymd.m, ymd.d);
			islDate = D.formatIsl(islYmd.y, islYmd.m, islYmd.d);
			// mix isl and lunar date
			$.extend(_date, islDate, lunarDate);

			// set hours, minutes and seconds
			_date.hh = date.getHours() < 10 ? "0" + date.getHours(): date.getHours();
			_date.mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
			_date.ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

			return _date;
		},

		/**
		 * Set Date object's time zone
		 * @param {String} tz   Timezone string, eg. '+8', '-2'
		 * @param {Date Obj} date The date Object you want to set, if empty it will use the server time.
		 */
		setTimezone: function (tz, date) {
			var _date = new Date();

			date = date ? date : Gl.time.getTime();

			_date.setTime(_date.getTime() + date.getTimezoneOffset() * 6e4 + tz * 36e5);

			return _date;
		}
	}
}();

module.exports = Gl.time;
