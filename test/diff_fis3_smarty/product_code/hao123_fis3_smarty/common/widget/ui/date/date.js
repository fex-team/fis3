/*
author: 斯人
QQ: 103024979
Email: leecade@163.com
update:

2012.9.7

Fixed: mac + firefox13 下农历日期显示为 Undefined
原因：对数组索引的浮点数时处理 有差异 [2.0001] ==> [2]

2011.9.26:
1. 按jsdoc规范更新注释
2. 扩展G.date.format方法
3. 调整接口，参数省略策略统一为 G.date.format/G.date.lunarTpl/G.date.islTpl 允许省略
4. 获取生肖名拆分为独立接口 G.date.toSx()
*/

	
//parse string to array by bit
/*String.prototype.parseToArray = function(bit, s) {
	var ret = this.split(s || "|");
	return bit ? function(l, n){
		for(; l--;) ret[l] = parseInt(ret[l], bit);
		return ret;
	}(ret.length) : ret;
}*/

//fastst trim, form: http://blog.stevenlevithan.com/archives/faster-trim-javascript
String.trim || (String.prototype.trim = function() {
	var str = this,
		str = str.replace(/^\s\s*/, ''),
		ws = /\s/,
		i = str.length;
	while (ws.test(str.charAt(--i)));
	return str.slice(0, i + 1);
});

//replace string by object, like "#{name}"
String.replaceTpl || (String.prototype.replaceTpl = function(o) {
	return this.replace(/#\{([^}]*)\}/mg, function(v, k) {
		return v = o[k.trim()]
	});
});

var WIN = window;

//storage and namespace
WIN.conf || (WIN.conf = {}), WIN.Gl || (WIN.Gl = {});

var	map = conf.date,

_ = {
	
	/**
	*检查是否date对象
	*@method: isDate
	*@param: {Date}
	*@return: {Bool}
	*/
	isDate: function(date) {
		return date instanceof Date && !isNaN(date);
	},
	
	/**
	*获取日期
	*@method: getDate
	*@param: {Date} || new Date()
	*@return: {y: 年, m: 月, d: 日}
	*/
	getDate: function(date) {
		!_.isDate(date) && (date = new Date());
		return {
			y: date.getFullYear(),			
			m: (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1),
			d: date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
		};
	},
	
	/**
	*格式化日期对象(from youa)
	*@method: format
	*@param: {String} || 'yyyy-MM-dd', 如："yyyy年M月d日", "yyyy-MM-dd", "MM-dd-yy", "yyyy-MM-dd hh:mm:ss"
	*@param: {Date} || new Date()
	*@return: {Bool}
	*@notice: 为区分minute, month对应大写M
	*@notice: 位数不全: 1. 年份 "yyyy" --> 2011, "yyy" --> 011, "y" --> 1; 2. 其他均为 single --> 不补0, double --> 补0
	*/
	format: function(pattern, date) {
		date = date || new Date();
		pattern = pattern || 'yyyy-MM-dd';
		
		var d = _.getDate(date),		//y, m, d
			o = {
				M: d.m,					//month
				d: d.d,					//day
				h: date.getHours(),		//hour
				m: date.getMinutes(),	//minute
				s: date.getSeconds()	//second
			},
			li;
			
		for(var k in o) {
			li = o[k];
			pattern = pattern.replace(new RegExp('(' + k + '+)', 'g'), function(a, b) {
				return (((typeof li == "number" && li < 10) || (typeof li == "string" && li.length < 2)) && b.length > 1) ? '0' + li : li;
			});
		}
		
		//replace year
		return pattern.replace(/(y+)/ig, function(a, b) {
			return (d.y + "").substr(4 - Math.min(4, b.length));
		});
	},
	
	/**
	*返回返回农历月份天数
	*@method: getDaysByLunarMonth
	*@param: {Num} lunar year
	*@param: {Num} lunar month
	*@return: {Num}
	*/
	getDaysByLunarMonth: function(y, m) {
		return map.lunar.leap[y-1900] & (0x10000 >> m) ? 30 : 29;
	},
		
	/**
	*返回公历年份的闰月月份
	*@method: getLeapMonth
	*@param: {Num} year
	*@return: {Num} || 0
	*/
	getLeapMonth: function(y) {
		return map.lunar.leap[y-1900] & 0xf;
	},
	
	/**
	*返回公历年份的闰月天数
	*@method: getLeapDays
	*@param: {Num} year
	*@return: {Num} || 0
	*/
	getLeapDays: function(y) {
		return _.getLeapMonth(y) ? (map.lunar.leap[y-1900] & 0x10000) ? 30 : 29 : 0;
	},
		
	/**
	*返回公历月份天数
	*@method: getDaysByMonth
	*@param: {Num} year
	*@param: {Num} month
	*@return: {Num}
	*/
	getDaysByMonth: function(y, m) {
		
		//table lookup except month == 2
		return m == 2 ? ((y%4 == 0) && (y%100 != 0) || (y%400 == 0)) ? 29 : 28 : map.days[m-1];
	},
	
	/**
	*返回公历年份天数
	*@method: getDaysByYear
	*@param: {Num} year
	*@return: {Num}
	*/
	getDaysByYear: function(y) {
		for(var i=0x8000, sum=348; i>0x8; i>>=1) sum += (map.lunar.leap[y-1900] & i) ? 1 : 0;
		return sum + _.getLeapDays(y);
	},
	
	/**
	*返回公历年份的第n个节气日期
	*@method: getDateBySolar
	*@param: {Num} year
	*@param: {Num} 0 --> 小寒
	*@return: {m:month, d:year}
	*/
	getDateBySolar: function(y, n) {
		var d = new Date((31556925974.7*(y-1900) + map.lunar.jqmap[n]*60000) + Date.UTC(1900,0,6,2,5));
		return {
			m:d.getUTCMonth() + 1,
			d:d.getUTCDate()
		}
	},
	
	/**
	*返回日期（公历/农历）对应节日名
	*@method: getFeast
	*@param: {Num} month
	*@param: {Num} day
	*@param: {Bool}(0 and 1) || 1 节日map(0 || null --> 公历，1 --> 农历，为空则默认为公历)
	*@param: {Num} year
	*@return: {String} || ""
	*@notice: 年、月、日须与type保持一致，当且仅当需要匹配“除夕”，才需传y(年份)
	*/
	/*getFeast: function(m, d, type, y) {
		
		var name = (type ? map.lunar.feast : map.feast)[m + '-' + d] || "";
		
		//fix"除夕"(农历12月最后一天)
		type && y && m == 12 && _.getDaysByLunarMonth(y, 12) == d && (name = "除夕");
		return name;
	},*/

	/**
	*返回公历日期对应节气名
	*@method: getSolar
	*@param: {Num} year
	*@param: {Num} month
	*@param: {Num} day
	*@return: {String} || ""
	*/
	/*getSolar: function(y, m, d) {
		
		var solarNames = map.lunar.jqnames,
			l = solarNames.length,
			solarName;
		while(l--) {
			solarName = _.getDateBySolar(y, l);
			if(solarName.m == m && solarName.d == d) return solarNames[l];
		}
		return "";	
	},*/
	
	/**
	*根据序号返回干支组合名
	*@method: cyclical
	*@param: {Num} 序号 (0 --> 甲子，以60进制循环)
	*@return: {String}
	*/
	cyclical: function(n) {
		return(map.lunar.tg[n%10] + map.lunar.dz[n%12]);
	},

	/**
	 * 修正农历闰年两个闰月问题
	 * @param  {Array} data 配置修复数据
	 * @param  {Number} y    年
	 * @param  {Number} m    月
	 * @param  {Number} d    日
	 * @param  {Number} maxY    可修正的最大年份(2025)
	 * @param  {Number} minY    可修正的最小年份(2000)
	 * @return {[number]}   1为农历闰月，2不为农历闰月，3无法判断
	 */
	fixLeapMonth: function(data, y, m, d, maxY, minY) {
		maxY = maxY || 2025;
		minY = minY || 2000;
		var r = 2;
		if (y > maxY || y < minY) return 3;
		if (data && data.length) {
			var l = data.length,
				_match = function(y, m, d, str, pre, suf) {
					str = str.split("~");
					str[1] = str[1] || str[0];
					pre = str[0].split("-");
					suf = str[1].split("-");
					return new Date(y, m-1, d) >= new Date(pre[0], pre[1]-1, pre[2]) && new Date(y, m-1, d) <= new Date(suf[0], suf[1]-1, suf[2])
				};

			for(var i = 0; i < l; i++) {
				if(_match(y, m, d, data[i])) {
					r = 1;
					break;
				}
			}
			return r;
		} else {
			return 3;
		}
	},

	/**
     * 对异常日期结果进行修正
     * @param  {Array} data 配置修复数据
     * @param  {Number} y    年
     * @param  {Number} m    月
     * @param  {Number} d    日
     * @return {Object}      {y, m, d}
     * fixDate: ["2013-1-11=0|-1|1", "2013-1-12~2013-2-9=0|-1|0"]
     */
    fixResult: function(data, Y, M, D, y, m, d) {
        if(data && data.length) {
            var l = data.length,
            _match = function(y, m, d, str, pre, suf) {
                str = str.split("~");
                str[1] = str[1] || str[0];
                pre = str[0].split("-");
                suf = str[1].split("-");
                return new Date(y, m, d) >= new Date(pre[0], pre[1], pre[2]) && new Date(y, m, d) <= new Date(suf[0], suf[1], suf[2])
            },
            val,
            li;
            while(l--) {
                li = data[l].split("=");
                val = li[1].split("|");
                _match(Y, M, D, li[0]) && (y = y + ~~(val[0]), m = m + ~~(val[1]), d = d + ~~(val[2]));
            }
        }
        return {
            y: ~~y,
            m: ~~m,
            d: ~~d
        }
    },
	
	/**
	*根据公历日期返回农历日期
	*@method: toLunar
	*@param: {Num} year
	*@param: {Num} month
	*@param: {Num} day
	*@return: {cy: 农历年, cm: 农历月, cd: 农历日, CM: 农历月（中文）, CD: 农历日（中文）, isleap: 是否闰月}
	*@notice: 遵从农历习惯表达方式，如一月 --> 正月，十二月 --> 腊月，闰月等
	*/
	toLunar: function(Y, M, D) {
		var m = 1900,														//起始年份
			n = 0,
			d = (new Date(Y, M-1, D) - new Date(1900, 0, 31))/86400000,	//起始date
			leap = _.getLeapMonth(Y),									//当年闰月
			isleap = false,													//标记闰月
			_y;
		var isLeapMonth = _.fixLeapMonth(map.lunar.fixMonth, Y, M, D), // 标记日期是否为农历闰月
		    showLeap; // 是否显示润字
			
		for(; m < 2050 && d>0; m++){n = _.getDaysByYear(m); d -= n};
	
		if(d < 0){d += n, m--};
	
		_y = m;
			
		for(m=1; m<13 && d>0; m++) {
	
			if(leap>0 && m == leap+1 && isleap === false){--m; isleap = true; n = _.getLeapDays(_y)}
	
			else{n = _.getDaysByLunarMonth(_y, m)};
	
			if(isleap == true && m == (leap+1)) isleap = false; 
	
			d -= n;
		};
	
		if(d == 0 && leap > 0 && m == leap + 1 && !isleap) --m;
	
		if(d < 0){d += n; --m};
		
		//修正闰月下一月第一天为非闰月
		if(d == 0) isleap = m == leap;
		
		//转换日期格式为1开始
		d = d + 1;

		var _fixDate = _.fixResult(map.lunar.fixDate,
            Y, M, D,

            // BUG?
            Y - ( M < m ? 1 : 0),   //如果公历月份小于农历就是跨年期，农历年份比公历-1
            m, d);

		if (isLeapMonth === 1) {
			showLeap = true;
		} else if (isLeapMonth === 2) {
			showLeap = false;
		} else if (isleap) {
			showLeap = true;
		}
		
        return {
            cy: _fixDate.y,
            cm: _fixDate.m,
            cd: _fixDate.d,
            CM: (showLeap ? "闰" : "") + ((_fixDate.m > 9 ? '十' : '') + map.lunar.c1[_fixDate.m%10]).replace('十二','腊').replace(/^一/,'正') + '月',
            CD: {'10': '初十', '20': '二十', '30': '三十'}[_fixDate.d] || (map.lunar.c2[Math.floor(_fixDate.d/10)] + map.lunar.c1[~~_fixDate.d%10]),
            isleap: isleap
        }
	},
	
	/**
	*公历转干支
	*@method: toGz
	*@param: {Num} year
	*@param: {Num} month
	*@param: {Num} day
	*@return: {gy:干支年, gm:干支月, gd:干支日}
	*/
	toGz: function(y, m, d) {
		var getDateBySolar = _.getDateBySolar,
			cyclical = _.cyclical;
			
		m = m - 1;	//换算月份为0起始(考虑对代码压缩友好，日期未换算)
		
		//fix: 生肖以农历年份计算
		return {
			gy: (m >= 2 || (m==1 && d>=getDateBySolar(y, 2).d)) ? cyclical(y-1864) : cyclical(y-1865),
			gm: d >= getDateBySolar(y, m*2).d ? cyclical((y-1900)*12+m+13) : cyclical((y-1900)*12+m+12),
			gd: cyclical(Date.UTC(y,m,1,0,0,0,0)/86400000+25576+d)
		}
	},
	
	/**
	*公历转生肖
	*@method: toSx
	*@param: {Num} year
	*@param: {Num} month
	*@param: {Num} day
	*@return: {String}
	*/
	toSx: function(y, m, d) {
		
		//by lunar year
		return map.lunar.sx[(_.toLunar(y, m, d).cy-4)%12];
	},
	
	/**
	*公历转中文格式化农历
	*@method: formatLunar
	*@param: {Num} year
	*@param: {Num} month
	*@param: {Num} day
	*@return: {y: 年,m: 月,d: 日,w: 星期（数字）,W: 星期（中文）,cm: 农历月（数字）,cd: 农历日（数字）,CM: 农历月（中文）,CD: 农历日（中文）,gy: 干支年,gm: 干支月,gd: 干支日,so: 节气,cf: 农历节日,gf: 公历节日,sx: 生肖,isleap: 是否闰月}
	*/
	formatLunar: function(y, m, d) {
		
		var gz = _.toGz(+y, +m, +d),				//干支
			lunar = _.toLunar(+y, +m, +d),			//农历
			w = new Date(y, m-1, d).getDay();	//星期
			
		return {
			y: y,													//年
			m: m,													//月
			d: d,													//日	
			w: w,													//星期（数字）
			W: map.lunar.wk[w],										//星期（中文）
			// jpW:map.lunar.jpwk.charAt(w),								//星期（日文）
			thy: y + 543,											//佛历年
			
			cm: lunar.cm, 											//农历月（数字）
			cd: lunar.cd, 											//农历日（数字）
			CM: lunar.CM, 											//农历月（中文）
			CD: lunar.CD, 											//农历日（中文）
			
			gy: gz.gy, 										//干支纪年
			gm: gz.gm,										//干支纪月
			gd: gz.gd, 										//干支纪日
			
			// so: _.getSolar(y, m, d),  								//节气
			// cf: _.getFeast(lunar.cm, lunar.cd, 1, lunar.cy),		//农历节日
			// gf: _.getFeast(m, d), 									//公历节日
			sx: map.lunar.sx[(lunar.cy-4)%12], 				//生肖
			isleap: lunar.isleap 									//是否闰月
		} 
	},
	
	/**
	*公历日期按模板返回农历
	*@method: lunarTpl
	*@param: {Num} year
	*@param: {Num} month
	*@param: {Num} day
	*@param: {String} null --> 默认内置模板
	*@return: {String} || {}
	*@notice: 参数允许为{Date}/{y, m, d}
	*@example:
	G.date.lunarTpl() --> 今日+内置模板
	G.date.lunarTpl(tpl) --> 今日+tpl
	G.date.lunarTpl(y, m, d) --> y, d, m+内置模板
	G.date.lunarTpl(date) --> date+内置模板
	G.date.lunarTpl(date, tpl) --> date+tpl
	*/
	/*lunarTpl: function(y, m, d, tpl) {
		//check and fix arguments
		if(arguments.length < 4 && typeof d !== "number") {
			var isDate = _.isDate(y),
				today = isDate ? _.getDate(y) : _.getDate();
			isDate && (tpl = m);
			typeof y === "string" && (tpl = y);
			y = today.y;
			m = today.m;
			d = today.d;
		}
		return (tpl || map.lunar.tpl).replaceTpl(_.formatLunar(y, m, d));
	},*/
	
	/**
	*公历转伊历
	*@method: toIsl
	*@param: {Num} year
	*@param: {Num} month
	*@param: {Num} day
	*@return: {iy: 伊历年,im: 伊历月,id: 伊历日,iw: 伊历第几周,jd: 儒略日}
	*/
	toIsl: function(Y, M, D) {
		
		var y = Y,
			m = M,
			d = D;
		
		if(m<3) {
			y -= 1;
			m += 12;
		}
	
		var a = Math.floor(y/100.),
			b = 2-a+Math.floor(a/4.),
			jd, bb, cc, dd, ee;
			
		if(y<1583) b = 0;
		if(y==1582) {
			if(m>10)  b = -10;
			if(m==10) {
				b = 0;
				if(d>4) b = -10;
			}
		}
	
		//求儒略日(julian day)
		jd = Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+b-1524;
	
		b = 0;
		
		if(jd>2299160){
			a = Math.floor((jd-1867216.25)/36524.25);
			b = 1+a-Math.floor(a/4.);
		}
		bb = jd+b+1524;
		cc = Math.floor((bb-122.1)/365.25);
		dd = Math.floor(365.25*cc);
		ee = Math.floor((bb-dd)/30.6001);
		d = (bb-dd)-Math.floor(30.6001*ee);
		m = ee-1;
		if(ee>13) {
			cc += 1;
			m = ee-13;
		}
		y = cc-4716;
		
		
		/*
		从儒略日计算星期几
		function gmod(n,m){
			return ((n%m)+m)%m;
		}
		*/
		var wd = (((jd+1)%7)+7)%7+1,
			iyear = 10631./30.,
			epochastro = 1948084,
			epochcivil = 1948085,
			shift1 = 8.01/60.,
			z = jd-epochastro,
			cyc = Math.floor(z/10631.),
			j,iy,im,id;
			
		z = z-10631*cyc;
		j = Math.floor((z-shift1)/iyear);
		iy = 30*cyc+j;
		z = z-Math.floor(j*iyear+shift1);
		im = Math.floor((z+28.5001)/29.5);
		if(im==13) im = 12;
		id = z-Math.floor(29.5001*im-29);

		var _fixDate = _.fixResult(map.isl.fixDate, Y, M, D, iy, im, id);
        return {
            iy: _fixDate.y,     //islamic year
            im: _fixDate.m,     //islamic month
            id: _fixDate.d,     //islamic date
            
            iw: wd,     //weekday number
            jd: jd-1    //julian day number
        }
	},
	
	/**
	*公历转格式化伊历
	*@method: formatIsl
	*@param: {Num} year
	*@param: {Num} month
	*@param: {Num} day
	*@return: {y: 年,m: 月,d: 日,iy: 伊历年,im: 伊历月,id: 伊历日,iw: 伊历第几周,jd: 儒略日,IW: 伊历星期名,MW: 马来语星期名,IM: 伊历月份名,MM: 马来语月份名}
	*/
	formatIsl: function(y, m, d) {
		
		var isl = _.toIsl(+y, +m, +d),
			_map = map.isl,
			iw = isl.iw,
			im = isl.im;
			
		return {
			y: y,									//年
			m: m,									//月
			d: d,									//日
			iy: isl.iy,  							//伊历年
			im: im,									//伊历月
			id: isl.id,								//伊历日
	 		iw: iw,									//伊历第几周
			jd: isl.jd,								//儒略日
			
			M: _map.gMonthNames[m - 1],				//公历月份的伊历名
			IW: _map.weekNames[iw - 1],				//伊历星期名
			// MW: _map.weekNames_Malay[iw - 1],		//马来语星期名
			
			IM: _map.monthNames[im - 1]			//伊历月份名
			// MM: _map.monthNames_Malay[im - 1] 		//马来语月份名
		};
	}
	
	/**
	*公历日期按模板返回伊历模板
	*@method: islTpl
	*@param: {Num} year
	*@param: {Num} month
	*@param: {Num} day
	*@param: {String} null --> 默认内置模板
	*@return: {String}
	*@notice: 参数允许为{Date}/{y, m, d}
	*@example:
	G.date.islTpl() --> 今日+内置模板
	G.date.islTpl(tpl) --> 今日+tpl
	G.date.islTpl(y, m, d) --> y, d, m+内置模板
	G.date.islTpl(date) --> date+内置模板
	G.date.islTpl(date, tpl) --> date+tpl
	*/
	/*islTpl: function(y, m, d, tpl) {
		//判断全为数字: isFinite(t) && !/infinity/.test(t)
		
		//check and fix arguments
		if(arguments.length < 4 && typeof d !== "number") {
			var isDate = _.isDate(y),
				today = isDate ? _.getDate(y) : _.getDate();
			isDate && (tpl = m);
			typeof y === "string" && (tpl = y);
			y = today.y;
			m = today.m;
			d = today.d;
		}
		return (tpl || map.isl.tpl).replaceTpl(_.formatIsl(y, m, d));
	},*/
	
	
	//debug
	/*debug: function(y, m) {
		var i = 0,
			l = Gl.date.getDaysByMonth(y, m);
		for(;i<l;i++) {
			//console.log(y, m, i+1, G.date.toGanzhi(y, m, i+1))
			//console.log(y, m, i+1, G.date.toLunar(y, m, i+1))
			console.log(Gl.date.lunarTpl(y, m, i+1))
		}
	}*/
}

//copy to G.date
Gl.date = _;

module.exports = Gl.date;