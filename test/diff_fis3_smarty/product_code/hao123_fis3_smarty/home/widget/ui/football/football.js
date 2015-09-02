var $ = require('common:widget/ui/jquery/jquery.js');
var hex_md5 = require('common:widget/ui/md5/md5.js');
var UT = require('common:widget/ui/ut/ut.js');
var helper = require("common:widget/ui/helper/helper.js");
var dateTool = require("common:widget/ui/date/date.js");
require("common:widget/ui/jquery/widget/jquery.lazyload/jquery.lazyload.js");
var message = require("common:widget/ui/message/src/message.js");

/**
 * 足球模块
 * @author wangmingfei
 * @constructor
 * @this {football}
 */
var football = function(args){
	var that = this;
	// const
	that.CONST_ALL_TYPE = "all";
    // dom
	that.footballWrapper = $("#sideFootball");
	that.footballPanel = that.footballWrapper.find(".mod-side"); // api error handle use
	that.moreLink = that.footballWrapper.find('.charts_more'), // api error handle use
	that.footballError = $("#football-error"); // api error handle use
	that.footballListWrappers = that.footballWrapper.find(".football-game-list-wrapper");
	that.footballLists = that.footballWrapper.find(".football-game-list");
	that.footballUpArrow = $("#footballUpArrow"); // up arrow
	that.footballDownArrow = $("#footballDownArrow"); // down arrow
	// tpl
	that.liTpl = "<li class='#{statusClass}'><div class='football-game-head'><span class='football-game-type' title='#{typeName}'>#{typeName}</span><span>#{startTime}</span><span class='football-game-status' title='#{statusName}'>#{statusName}</span></div><div class='football-game-body'>";
	that.aTpl = "<li class='#{statusClass}'><a href='#{url}'><div class='football-game-head'><span class='football-game-type' title='#{typeName}'>#{typeName}</span><span>#{startTime}</span><span class='football-game-status' title='#{statusName}'>#{statusName}</span></div><div class='football-game-body'>";
	that.scrore = "<span class='football-game-score'>#{homeScore} - #{awayScore}</span>";
	that.homeImgTpl = "#{homeImg}<span title='#{homeName}' class='foot-team-home'>#{homeName}</span>";
	that.awayImgTpl = "<span title='#{awayName}' class='foot-team-away'>#{awayName}</span>#{awayImg}</div>";
	that.homeTpl = "<span title='#{homeName}' class='foot-team-home-non'>#{homeName}</span>";
	that.awayTpl = "<span title='#{awayName}' class='foot-team-away-non'>#{awayName}</span></div>";
	that.liTail ="</li>";
	that.aTail ="</a></li>";
	that.tabTpl = "<li#{classStr} val='#{dateVal}'>#{dateText}#{date}</li>";
	that.noDataTpl = "<p class='football-nodata'>#{noDataText}</p>";
	//config
	that.config = conf.football;
	// data cache
	that.opt = {};
	that.opt.date = []; // cache date
	that.opt.data = {}; // cache game data by date and type dimentions: data = {"date1":{"type1":[{},...,{}],...,"typen":[]},...,"daten":{}}
	that.opt.start = {}; // cache start index by date and type dimentions for calculating init position of game list
	that.opt.total = {}; // cache array length by date and type dimentions for looping
	that.opt.type = []; // cache type data by date and type dimentions
	that.opt.status = that.config.gameState; // map of game status and its local name
	// others
	that.step = 59; // height of one single game section
	that.hasTypeList = false; // whether game type list has initialised
	that.ajaxSucceed = false; // store ajax state, used for error condition
	that.curGameType = that.CONST_ALL_TYPE; // store the current game type chosen, init to "all"
	that.canResetType = false; // whether typelist can reset(only when date is changed)
	//与其它模块通信信道
	that.messageChannel = args.messageChannel;
	// init action
	that.initAfterGetNow();
};

/**
 * make sure the first init action is executed after obtaining Gl.serverNow
 *
 * @this {football}
 */
football.prototype.initAfterGetNow = function(){
	var that = this,
		loop = 0,
		timer = setInterval(function(){
			if(Gl.serverNow || loop > 4){ // try 5 times at most until Gl.serverNow is obtained, if failed, get client time instead
				that.now = Gl.serverNow || new Date();
				that.curGameDate = dateTool.format("yyyy-MM-dd",that.now); // store the current date chosen: init to current date
				that.formDateTabs();
				that.init(that.curGameDate,that.curGameType);
				that.bindEvents();
				clearInterval(timer);
			}
			loop++;
		},1000);
};

/**
 * get date tabs
 *
 * @this {football}
 */
football.prototype.formDateTabs = function(){
	var that = this,
		html = "",
		dateStr,
		dateVal;
	for(var i=0,len=that.config.gameDate.length;i<len;i++){
		dateStr = new Date(that.now.getTime() + (i - 1) * that.config.dateSpan * 86400000);
		dateVal = dateTool.format("yyyy-MM-dd",dateStr);
		html += helper.replaceTpl(that.tabTpl,{
			classStr: i == 1 ? " class='cur'" : "",
			dateText: that.config.gameDate[i],
			date: dateTool.format(that.config.dateFormat,dateStr),
			dateVal: dateVal
		});
		that.opt.date[i] = dateVal;
		that.opt.data[dateVal] = {};
		that.opt.total[dateVal] = {};
		that.opt.start[dateVal] = {};
	}
	$("#footballTab").html(html);
};

/**
 * init action: if a specific date is fully loaded(load type "all"), the full data will be stored in local variable. And when this date is chosen again, it will not send request to api but request from the local variable
 *
 * @this {football}
 */
football.prototype.init = function(date,type){
	var that = this;
	if(that.existDataByDayType(date,type)){
		that.requestLocal(date,type);
	}else{
		that.requestApi(date,type);
	}
};

/**
 * bind content events
 *
 * @this {football}
 */
football.prototype.bindEvents = function(){
	var that = this;
	that.footballError.click(function(e){ // apierror link click
		e.preventDefault();
		that.refresh(that.curGameDate,that.curGameType);
	});
	$(".refresh","#panel-football").click(function(){ // refresh button click
		that.refresh(that.curGameDate,that.curGameType);
		that.sendStat(true);
	});
	message.on(that.messageChannel, function(data){
		if(data.type === "refresh") {
			that.footballWrapper.is(":visible") && that.refresh(that.curGameDate,that.curGameType);
		}

	});


	that.footballWrapper.on("click","#footballUpArrow",function(){ // up arrow click
		if(!$(this).hasClass("football-arrow-disable")){
			that.move(1,3);
		}
		that.sendStat(true);
	}).on("click","#footballDownArrow",function(){ // down arrow click
		if(!$(this).hasClass("football-arrow-disable")){
			that.move(-1,3);
		}
		that.sendStat(true);
	}).on("click","#footballTab li",function(){ // date click
		var date = $(this).attr("val").trim();
		if(date != that.curGameDate){
			$(this).addClass("cur").siblings().removeClass("cur");
			that.canResetType = true;
			that.curGameDate = date;
			that.init(date,that.curGameType);
		}
		that.sendStat(true);
	})
	.on("click",".dropdown",function(){
		that.sendStat(true);
	});
	$(document).on("mousedown","#footballTypeList li",function(){ // type click
		that.typelist.target.trigger("change");
	});
};

/**
 * get and format type data
 *
 * @this {football}
 */
football.prototype.formTypeData = function(date,data){
	var that = this,
		newData = [];
	for(var i=0,li;li=data[i];i++){
		newData[i] = {
			id: li,
			name: li
		};
	}
	newData[i] = {
		id: that.CONST_ALL_TYPE,
		name: that.config.allText
	};
	that.setTypelistByDay(date,newData);
};

/**
 * call the common component dropdownlist to instantiate a dropdown list for game type
 *
 * @this {football}
 * @param {string} date The date user chooses, tells dropdown constructor which type needs to be shown on the dropdown list
 * @param {string} defType The default selected type to show on the type dropdown list
 */
football.prototype.formTypeList = function(date,defType){
	var that = this,
		data = that.getTypelistByDay(date),
		defIndex;

	// find default selection index in current type list
	$.each(data,function(key, value){
		that.opt.data[date][value.id] = that.opt.data[date][value.id] || [];
		defType === value.id && (defIndex = key);
	});
	// if defType is not in current type list, default selection is empty
	typeof defIndex === "undefined" && (defIndex = -1);

	if(!that.hasTypeList){// init dropdownlist
		require.async("common:widget/ui/dropdownlist/dropdownlist.js", function (dropdownlist) {
			that.typelist = new dropdownlist({
				selector: "footballType",
				data: data,
				defIndex: defIndex,
				onChange: function(){
					that.curGameType = this.value;
					that.init(that.curGameDate,that.curGameType);
				}
			});
			that.hasTypeList = true;
			that.showTypelist();
		});
	}else{// reset dropdownlist
		if(that.canResetType){
			that.typelist.reset(data,defIndex);
			that.canResetType = false;
		}
		that.showTypelist();
	}
};

/**
 * clear all types of game data in this.opt.data[date] for refresh action
 *
 * @this {football}
 * @param {string} date The date index
 * @param {array} data The data from api according to the condition of date and type
 */
football.prototype.clearDataByDay = function(date,data){
	$.each(data[date],function(key, value){
		data[date][key] = [];
	});
};

/**
 * format game data obtained from api and cache it in this.opt.data[date][type]. Once a specific data&type data is cached, the later same search combination will not request api any more, but request local cache
 *
 * @this {football}
 * @param {string} date The date index
 * @param {string} type The type index
 * @param {array} data The data from api according to the condition of date and type
 */
football.prototype.setDataByDayType = function(date,type,data){
	var that = this;
	that.clearDataByDay(date,that.opt.data);
	for(var i=0,li;li=data[i];i++){
		var tmp = {
			statusClass: "football-game-" + that.opt.status[li.match_status].realType,
			type: li.type,
			typeName: li.competition && li.competition !== "null" ? li.type + " " + li.competition : li.type,
			startTime: li.date.slice(-8,-3),
			status: that.opt.status[li.match_status].realType,
			statusName: that.opt.status[li.match_status].text,
			homeName: li.home.name,
			homeScore: that.opt.status[li.match_status].realType == "notstarted" ? "" : li.home.score,
			awayName: li.away.name,
			awayScore: that.opt.status[li.match_status].realType == "notstarted" ? "" : li.away.score,
			homeImg: li.home.logo ? "<img class='football-game-icon' football-img-lazyload='"+conf.football.imageFolder+li.home.logo+"' width='17'/>" : "",
			awayImg: li.away.logo ? "<img class='football-game-icon' football-img-lazyload='"+conf.football.imageFolder+li.away.logo+"' width='17'/>" : "",
			url: li.url && li.url.length ? li.url.trim() : ""
		};
		type == that.CONST_ALL_TYPE && that.opt.data[date][li.type].push(tmp); // if type is all, also cache the classified data since we've already got the full list of games on that date,
		that.opt.data[date][type].push(tmp);
	}
};

/**
 * get game data by date and type dimentions from local cache
 *
 * @this {football}
 * @param {string} date The date index
 * @param {string} type The type index
 * @return {array} The game data of specified date and type
 */
football.prototype.getDataByDayType = function(date,type){
	var that = this;
	return that.opt.data[date][type];
};

/**
 * get total data by date and type dimentions from local cache
 *
 * @this {football}
 * @param {string} date The date index
 * @param {string} type The type index
 * @return {number} The total number of game data of a specified date and type
 */
football.prototype.getTotalByDayType = function(date,type){
	return this.opt.total[date][type];
};

/**
 * set total data by date and type dimentions
 *
 * @this {football}
 * @param {string} date The date index
 * @param {string} type The type index
 * @param {number} val The total number of game data of a specified date and type
 */
football.prototype.setTotalByDayType = function(date,type,val){
	//this.opt.data[date][type] = this.opt.data[date][type] || {};
	this.opt.total[date][type] = val;
};

/**
 * get start data by date and type dimentions
 *
 * @this {football}
 * @param {string} date The date index
 * @param {string} type The type index
 * @return {array} The start index of game data of a specified date and type
 */
football.prototype.getStartByDayType = function(date,type){
	return this.opt.start[date][type];
};

/**
 * set start data by date and type dimentions
 *
 * @this {football}
 * @param {string} date The date index
 * @param {string} type The type index
 * @param {number} val The start index of game data of a specified date and type
 */
football.prototype.setStartByDayType = function(date,type,val){
	this.opt.start[date] || (this.opt.start[date] = {});
	this.opt.start[date][type]= val;
};

/**
 * get type data by date dimention
 *
 * @this {football}
 * @param {string} date The date index
 * @return {object} The type data(key-value list) of a specified date
 */
football.prototype.getTypelistByDay = function(date){
	return this.opt.type[date];
};

/**
 * set type data by date and type dimentions
 *
 * @this {football}
 * @param {string} date The date index
 * @param {object} data type data(key-value list) of a specified date
 */
football.prototype.setTypelistByDay = function(date,data){
	this.opt.type = this.opt.type || [];
	this.opt.type[date] = data;
};

/**
 * whether game data of a specified date and type exists
 *
 * @this {football}
 * @param {string} date The date index
 * @param {string} type The type index
 * @return {boolean} Returning false means that date has no such type of game
 */
football.prototype.existDataByDayType = function(date,type){
	var that = this;
	return that.getDataByDayType(date,type) && that.getDataByDayType(date,type).length
};

/**
 * request data from api and handle different situations, such like typelist is null or typelist is not null but gamelist is null
 *
 * @this {football}
 * @param {string} date The date index
 * @param {string} type The type index
 */
football.prototype.requestApi = function(date,type){
	var that = this,
		params = "?app=soccer&act=contents"+(type!=that.CONST_ALL_TYPE?"&type="+type:"")+"&date="+date+"&country="+conf.country;
	$.ajax({
		url: conf.apiUrlPrefix + params,
		// url: "/static/home/widget/football/data_"+date+".json",
		dataType: "jsonp",
		jsonp: "jsonp",
		jsonpCallback: "ghao123_" + hex_md5(params,16),
		// jsonpCallback: "ghao123_b61ba78e22bb999a",
		cache: false
	}).done(function(data){
		// hide ajax error notice
		that.ajaxSucceed = true;
		that.hideError();
		if(data.content.data.typelist.length){ // has type data, then create type list
			// get type and game basic data
			var typeData = data.content.data.typelist,
				gameData = data.content.data.gamelist;
			// format type data and creat type list
			that.formTypeData(date,typeData);
			that.formTypeList(date,type);

			if(gameData.length){ // has game data then get formatting data and append to page
				that.setStartByDayType(date,type,-1);
				that.setDataByDayType(date,type,gameData);
				that.setTotalByDayType(date,type,gameData.length);
				that.appendData(date,type);
			}else{ // game data is empty, then display "no data of this type" information
				that.appendNoData(data,type,that.config.noTypeText);
				$.each(that.getTypelistByDay(date),function(i,v){
					if(v.id === type){
						type = v.name;
					}
				});
				that.footballPanel.find(".dropdown-input").text(type);
			}
		}else{ // type data is empty , then display "no data of this date" information
			that.appendNoData(data,type,that.config.noDataText);
			that.hideTypelist();
		}
	});
	if(!that.ajaxSucceed) that.showError();
};

/**
 * request data from local cache
 *
 * @this {football}
 * @param {string} date The date index
 * @param {string} type The type index
 */
football.prototype.requestLocal = function(date,type){
	var that = this;
	that.formTypeList(date,type);
	if(that.existDataByDayType(date,type)){
		that.setStartByDayType(date,type,-1);
		that.appendData(date,type);
	}else{
		that.appendNoData(data,type,that.config.noTypeText);
	}

};

/**
 * append game data to list and move it to the proper position
 *
 * @this {football}
 * @param {string} date The date index
 * @param {string} type The date index
 */
football.prototype.appendData = function(date,type){
	var that = this,
	    html = "",
	    data = that.getDataByDayType(date,type);
	for(var i=0,j=0;li=data[i];i++){
		// [find init position]: find the first inprogress index, if not any, find the first notstarted instead
        if(li.status == "inprogress" || li.status == "notstarted"){
    	    if(that.getStartByDayType(date,type) == -1){
                that.setStartByDayType(date,type,j);
    	    }
        }
        if(type == that.CONST_ALL_TYPE || (type && li.type == type)){
        	var imgLTpl = li.homeImg ? that.homeImgTpl : that.homeTpl,
        		imgRTpl = li.awayImg ? that.awayImgTpl : that.awayTpl,
        	 	tpl = li.url.length ? that.aTpl + imgLTpl + that.scrore + imgRTpl + that.aTail : that.liTpl + imgLTpl + that.scrore + imgRTpl + that.liTail;
        	html += helper.replaceTpl(tpl,li);
        	j++;
        }
    }
    // [find init position]: if there's not any inprogress or notstarted game, then get the last index
    if(that.getStartByDayType(date,type) == -1){
         that.setStartByDayType(date,type,j);
    }
    that.appendTplToPanel(html,$.inArray(date,that.opt.date));
    //lazyload team icon
    $(".football-game-icon",that.footballWrapper).lazyload({
	    container: $("#footballGameLists"),
	    imgClass:"football-img-lazyload",
	    autoFireEvent: null,
	    event: "clickArrow.football"
	});
};

/**
 * append no data notice if there's no such type of game data or no games at all on that date
 *
 * @this {football}
 * @param {string} date The date index
 * @param {string} type The date index
 * @param {string} text The content of no data notice
 */
football.prototype.appendNoData = function(date,type,text){
	var that = this;
	var html = helper.replaceTpl(that.noDataTpl,{noDataText:text}); // if the selected type returns no data, then show "No data" notice
	that.appendTplToPanel(html,$.inArray(date,that.opt.date));
	that.hideArrow();
};

/**
 * append assembled tpl to the right panel section
 *
 * @this {football}
 * @param {string} tpl The assembled tpl to be appended
 * @param {string} panelIndex The index of content panel to append to
 */
football.prototype.appendTplToPanel = function(tpl,panelIndex){
	var that = this;
	that.footballLists.eq(panelIndex).html(tpl).css("top",0);
	that.showArrow();
	that.footballListWrappers.hide().eq(panelIndex).show();
	that.moveToCurrent();
};

/**
 * arrow buttons' move action
 *
 * @this {football}
 * @param {number} direction Move direction: up => 1; down => -1
 * @param {number} pace Pace number for clicking arrow once
 */
football.prototype.move = function(direction,pace){
	var that = this,
		curIndex = $.inArray(that.curGameDate,that.opt.date),
		curPanel = that.footballLists.eq(curIndex),
		liLength = that.footballLists.eq(curIndex).children().length,
		height = (liLength < 3 ? 3 : liLength) * that.step, //tackle with a problem when pre-loading on hover event. can't use "height = that.footballLists.eq(that.curIndex).height()", because it's hidden when preloading on hover event
		bottomBorder = -height + 3 * that.step,
		topValue = parseInt(curPanel.css("top"),10) + direction * pace * that.step;

	topValue = that.adjustOnBorder(topValue,bottomBorder); // adjust the top value
	curPanel.css("top",topValue); // move the list to the new position
	that.changeArrowStatus(topValue,bottomBorder); // change button status if the list comes to the border
	$("#footballGameLists").trigger("clickArrow.football");
};

/**
 * move the list to the proper position: generally to the first "inprogress" game, if not any to the first "notstarted" game instead, if still not any to the last "finished" game
 *
 * @this {football}
 */
football.prototype.moveToCurrent = function(){
	var that = this;
	that.move(-1,that.getStartByDayType(that.curGameDate,that.curGameType));
};

/**
 * if the list comes to the top/bottom border, adjust its top value to avoid overflowing
 *
 * @this {football}
 * @param {number} topValue The newly calculated top value of game list
 * @param {object} bottomBorder The top value when game list reaching its bottom
 * @return {number} The adjusted top value of game list
 */
football.prototype.adjustOnBorder = function(topValue,bottomBorder){
	var that = this;
	if(topValue > 0){
		topValue = 0;
	}else if(topValue < bottomBorder){
		topValue = bottomBorder;
	}
	return topValue;
};

/**
 * change top/bottom arrow status if the list comes to the top/bottom border
 *
 * @this {football}
 * @param {number} topValue The current top value of game list
 * @param {object} bottomBorder The top value when game list reaching its bottom
 */
football.prototype.changeArrowStatus = function(topValue,bottomBorder){
	var that = this;
	if(topValue == 0){
		that.footballUpArrow.addClass("football-arrow-disable");
	}else{
		that.footballUpArrow.hasClass("football-arrow-disable") && that.footballUpArrow.removeClass("football-arrow-disable");
	}
	if(topValue == bottomBorder){
		that.footballDownArrow.addClass("football-arrow-disable");
	}else{
		that.footballDownArrow.hasClass("football-arrow-disable") && that.footballDownArrow.removeClass("football-arrow-disable");
	}
};

/**
 * make arrows invisible
 *
 * @this {football}
 */
football.prototype.hideArrow = function(){
	var that = this;
	that.footballUpArrow.css("visibility","hidden");
	that.footballDownArrow.css("visibility","hidden");
};

/**
 * make arrows visible
 *
 * @this {football}
 */
football.prototype.showArrow = function(){
	var that = this;
	that.footballUpArrow.css("visibility","visible");
	that.footballDownArrow.css("visibility","visible");
};

/**
 * hide type dropdown list
 *
 * @this {football}
 */
football.prototype.hideTypelist = function(){
	this.typelist && this.typelist.newSelector.hide();
};

/**
 * show type dropdown list
 *
 * @this {football}
 */
football.prototype.showTypelist = function(){
	this.typelist.newSelector.show();
};

/**
 * refresh action, always request api
 *
 * @this {football}
 */
football.prototype.refresh = function(date,type){
	var that = this;
	clearTimeout(that.errorTimeout);
	that.errorTimeout = setTimeout(function(){
		that.ajaxSucceed = false;
		that.requestApi(date,type);
	},200);
};

/**
 * show ajax error notice
 *
 * @this {football}
 */
football.prototype.showError = function(){
	var that = this;
	that.footballWrapper.css('height' , '300px');
	that.footballPanel.hide();
	that.moreLink.hide();
	that.footballError.show();
};

/**
 * hide ajax error notice
 *
 * @this {football}
 */
football.prototype.hideError = function(){
	var that = this;
	that.footballWrapper.css('height' , 'auto');
	that.footballPanel.show();
	that.moreLink.show();
	that.footballError.hide();
};

/**
 * send statistic action
 *
 * @this {football}
 */
football.prototype.sendStat = function(ac){
	var utObj = {
        type:"click",
        level:1,
        modId:"football",
        country:conf.country
    };
    if(ac) {
    	utObj.ac = "b";
    }
	UT.send(utObj);
};

module.exports = football;
