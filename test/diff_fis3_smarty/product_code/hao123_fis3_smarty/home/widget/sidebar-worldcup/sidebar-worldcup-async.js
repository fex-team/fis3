var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var helper = require("common:widget/ui/helper/helper.js");
var cycletabs = require('common:widget/ui/cycletabs/cycletabs.js');

var sidebarWorldCup = function(userOption) {
	var wcOption = {
		$wrap: $('#sidebarWorldCup'),
		timeTabTpl: '#{date}<br>#{weekday}',
		contentTpl: '<li class="match-unit"><div class="match-unit-hd"><span class="match-unit-group">#{group}</span><span class="match-unit-info">#{time}<b>|</b>#{stadium}</span></div><div class="match-unit-bd"><p class="match-unit-team"><img src="#{homeimg}"><span title="#{homename}">#{homename}</span></p><span class="match-unit-score">#{homescore}</span><span class="match-unit-line">——</span><span class="match-unit-score">#{awayscore}</span><p class="match-unit-team"><img src="#{awayimg}"><span title="#{awayname}">#{awayname}</span></p></div></li>',
		teamTabTpl: '<li class="team-tab">#{group}</li>',
		apiUrlPrefix: conf.apiUrlPrefix,
		apiUrlTeamParam: "?app=brsoccer&act=schedulecup&country=" + conf.country + "&league=8&round=-1",
		apiUrlOutParam: "?app=brsoccer&act=schedulecup&country=" + conf.country + "&stage=all&round=-1&league=8",
		allConf: conf.worldcup
	};
	$.extend(this, wcOption, userOption);
};

sidebarWorldCup.prototype = {
	init: function(){
		// this._initToptab();
		this._getTeamData();
	},
	/*****初始化顶部tab*****/ 
	_initToptab: function(){
		var me = this,
			$wrap = me.$wrap,
			$tabControlEles = $wrap.find('.sidebar-worldcup-control li'),
			$tabContentEles = $wrap.find('.sidebar-worldcup-content li');

		$tabControlEles.on( 'click', function(){
			var _this = $(this),
				toptabIndex = $tabControlEles.index(_this);

			$tabControlEles.removeClass('cur');
			_this.addClass('cur');
			$tabContentEles.hide();
			$tabContentEles.eq(toptabIndex).show();

			var utObj = {
				"type": "click",
				"modId": "sidebar-worldcup",
				"sort":"topTab",
				"sequence": toptabIndex
			};
			UT && UT.send(utObj);
		});

		// 增加底部banner统计
		$wrap.find('.worldcup-banner').on('click', function(){
			var utObj = {
				"type": "click",
				"modId": "sidebar-worldcup",
				"sort":"banner"
			};
			UT && UT.send(utObj);
		});
	},
	/*****获取小组赛数据*****/ 
	_getTeamData: function(){
		var me = this,
			apiUrlPrefix = me.apiUrlPrefix,
			apiUrlTeamParam = me.apiUrlTeamParam;

		$.ajax({
	        url: apiUrlPrefix + apiUrlTeamParam,
	        dataType: "jsonp",
	        jsonp: "jsonp",
	        cache: false
	    }).done(function(result){
	    	var data = result.content.data.current_content;
	        me._getKnockoutData(data);
	    });
	},
	/*****获取淘汰赛数据*****/ 
	_getKnockoutData: function( teamData ){
		var me = this,
			apiUrlPrefix = me.apiUrlPrefix,
			apiUrlOutParam = me.apiUrlOutParam;

		$.ajax({
	        url: apiUrlPrefix + apiUrlOutParam,
	        dataType: "jsonp",
	        jsonp: "jsonp",
	        cache: false
	    }).done(function(result){
	    	var data = result.content.data.current_content;
	        me._formatApiData(teamData, data);
	    });
	},
	/*****整合两个接口数据*****/ 
	_formatApiData: function( teamData, knockoutData ){
		if(!teamData || !knockoutData) return;

		var me = this,
			_teamData = $.extend(true, teamData, knockoutData ),
			timeData = {},
			timeKeyData = [],
			teamKeyData = [];

    	for( var key in _teamData ){
    		
    		var group = key.length > 1 ? "" : key;
    		for (var i = 0; i < _teamData[key].length; i++) {
    			var tmpData = _teamData[key][i],
    				matchDate = tmpData.match_date.split(" ");
    			var _tmpData = {
    				date: matchDate[0],
    				time: matchDate[1],
    				awayimg: tmpData.away.img,
    				awayname: tmpData.away.name,
    				awayscore: tmpData.away.score ? tmpData.away.score : "",
    				homeimg: tmpData.home.img,
    				homename: tmpData.home.name,
    				homescore: tmpData.home.score ? tmpData.home.score : "",
    				group: group,
    				_date: matchDate[0].split('/')[1] + '/' + matchDate[0].split('/')[0]
    			};

    			$.extend( tmpData, _tmpData );
    			_teamData[key][i] = tmpData;

    			var searchDate = tmpData._date;
    			
    			if (timeData[searchDate]) {
    				//该日期已存在比赛,push
    				timeData[searchDate].push(tmpData);
    			}else{
    				//该日期不存在比赛,创建数组
    				var _arr = [];
    				_arr[0] = tmpData;
    				timeData[searchDate] = _arr;

    				//timeKeyData：时间tab导航信息
    				timeKeyData.push(searchDate);
    			}
    		}

    		//teamKeyData：小组tab导航数据
    		if (group) {
    			teamKeyData.push({ group: group});
    		}
    	}

    	//获得slide导航按时间排序数组timeKeyData
    	timeKeyData = timeKeyData.sort();
    	//渲染内容
  		me._renderSlide (timeData, timeKeyData);
  		// me._renderTeam(_teamData, teamKeyData);
	},
	/*****渲染时间slidetab*****/ 
	_renderSlide: function( newdata, timeKeyData ){
		if( !newdata || !timeKeyData ) return;

		var me = this,
			$wrap = me.$wrap,
			$firstTabContent = $wrap.find('.worldcup-slide-panel'),
			timeTabTpl = me.timeTabTpl,
			contentTpl = me.contentTpl,
			datas = [],
			dayFlag = 0,
			navID = 1;

		//获得当天日期
		var startDay = me._calToday();
		//获得轮播规范格式数据
		var navItemsData = me._formatNavData(timeKeyData);

		//slide data
		for ( var i=0, len=navItemsData.length; i<len; i++ ){
			if (navItemsData[i].show == 1 ) {
				datas.push({
					"content": helper.replaceTpl( timeTabTpl, navItemsData[i] ),
					"id": navID,
					"date": navItemsData[i].month + '/' + navItemsData[i].day
				});
				navID++;
			}
			
			if (navItemsData[i].date == startDay) {
				//dayFlag:渲染当天数据标志(如果当天没有比赛 渲染将来最近的一天)
				dayFlag = navItemsData[i].dayFlag;
			}
		}
		//初始化slide控件
		var slide = new cycletabs.NavUI(),
			slideOptions = {
				containerId: '.worldcup-nav-wrap',
				offset: 0,
				data: datas,
				defaultId: dayFlag + 1,  
				navSize: 4,
				itemSize: 65,
				autoScroll: false,
				dir: conf.dir
			};
		
		slide.init( slideOptions );

		me._renderTabContent( newdata[timeKeyData[dayFlag]], contentTpl, $firstTabContent );
		
		$(slide).on('e_change',function(e, data){
			var itemObj = data.itemObj,
				id = itemObj.id,
				date = itemObj.date;
			
			me._renderTabContent( newdata[date], contentTpl, $firstTabContent );

    		var utObj = {
				"type": "click",
				"modId": "sidebar-worldcup",
				"sort":"date-tab",
				"date": date
			};
			UT && UT.send(utObj);
		});
	},
	/*****渲染小组tab*****/ 
	_renderTeam: function( teamData, teamKeyData ){
		var me = this,
			$wrap = me.$wrap,
			$secondTabNav = $wrap.find('.worldcup-teamnav-wrap'),
			$secondTabContent = $wrap.find('.worldcup-scroll-panel'),
			teamTabTpl = me.teamTabTpl,
			contentTpl = me.contentTpl;

		//小组tab初始化
		me._renderTabContent( teamKeyData, teamTabTpl, $secondTabNav );
		me._renderTabContent( teamData[teamKeyData[0].group], contentTpl, $secondTabContent );
		
		var scrollObj = $secondTabContent;
		require.async("common:widget/ui/scrollable/scrollable.js", function () {
			scrollbar = scrollObj.scrollable({
				autoHide: false
			});
		});

		var $teamTab = $wrap.find('.team-tab');
		$teamTab.on( 'click', function(){
			var teamIndex = ~~$teamTab.index($(this));
			me._renderTabContent( teamData[teamKeyData[teamIndex].group], contentTpl, $secondTabContent );

			//切换tab默认scroll从头
			var scrollFlag = $('.mod-sidebar-worldcup .mod-scroll');
			if (scrollFlag.length) {
				scrollbar.goTo({y:0});
			}

			var utObj = {
				"type": "click",
				"modId": "sidebar-worldcup",
				"sort":"team-tab",
				"group": teamKeyData[teamIndex].group
			};
			UT && UT.send(utObj);
		});
	},
	/*****渲染tabContent*****/ 
	_renderTabContent: function( contentData, contentTpl, container ){
		var tabContentHtml = '';
		for (var i = 0; i < contentData.length; i++) {
			tabContentHtml += helper.replaceTpl( contentTpl, contentData[i]);
		}
		container.html(tabContentHtml);
	},
	/*****获得当天日期*****/ 
	_calToday: function(){
		var me = this,
			serverDate = Gl.time.getTime(),
			month = serverDate.getMonth() + 1,
			day = serverDate.getDate();

		month = month < 10 ? me._singleAddZero(month) : month;
		day = day < 10 ? me._singleAddZero(day) : day;

		return day + '/' + month;
	},
	/*****获得slide导航信息(包含日期星期，标记没有比赛日期)*****/ 
	_formatNavData: function (timeKeyData){
		var me = this,
			allConf = me.allConf,
			weekText = allConf.weekdayText.split('|'),
			startMatchWeekday = allConf.startMatchWeekday,
			navItems = [],
			timeNavs = [],
			_start = ~~timeKeyData[0].split('/')[1],
			len = ~~timeKeyData[timeKeyData.length-1].split('/')[1] + 30;
		
		// 遍历注意：不是每天都有比赛  i:定日期(从timeKeyData取) j:定循环次数 k:定星期 
		for (var i=0, j=_start, k=0; j <= len; i++, j++, k++) {
			var _timeKey = timeKeyData[i],
				_timeEles = _timeKey.split('/'),
				_time1 = ~~_timeEles[0],
				_time2 = _time1 == 7 ? ~~_timeEles[1] + 30 : ~~_timeEles[1];

			timeNavs[i] = _time2;

			var timeNav, 
				timeIndex,
				timeShow;
			
			if( timeNavs[i] == j ){
				//timeNavs[i] == j表示当天有比赛
				timeNav = timeNavs[i];
				timeIndex = i;
				timeShow = 1;
			}else{
				timeNav = j;
				timeIndex = i;
				timeShow = 0;
				//当天没有比赛 i--
				i--;
			}

			var weekdayIndex = (~~startMatchWeekday + k - 1) % 7,
				timeNav = timeNav > 30 ? me._singleAddZero(timeNav - 30) + '/07' : timeNav +'/06';
			navItems.push({
				"date": timeNav,
				"weekday":weekText[weekdayIndex],
				"dayFlag": timeIndex,
				"show": timeShow,
				"month": timeNav.split('/')[1],
				"day": timeNav.split('/')[0]
			});
		}
		
		return navItems;
	},
	/*****个位数前补零*****/ 
	_singleAddZero: function(num){
		if (num < 10) {
			return '0' + num;
		}else{
			return num;
		}
	}
};
module.exports = sidebarWorldCup;