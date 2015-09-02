/*
 *目前hotsiteside模块数据获取方式有三种：手动获取、读由二级页开发好并写入json的包含html和js的资源、只获取数据并前端拼装
 *后续可能全部改为第二种方式，因此会有一些冗余代码需要清理。或者按照第二套方案重新设计。
 */

//requirement
var $ = require("common:widget/ui/jquery/jquery.js"),
	cycletabs = require("common:widget/ui/cycletabs/cycletabs.js"),
	UT = require("common:widget/ui/ut/ut.js"),
	Helper = require("common:widget/ui/helper/helper.js"),

	//definition
	slideRef = {},
	sideContainer = $("#hotsite-side-container"),//所有内容的总容器
	contentContainer = $(".hotsiteside_content"),//单个内容的容器
	tabs = $(".hotsiteside_menu li a"),
	_ajaxOptions = conf.hotsiteSide.ajaxOptions,//cms配置，主要是url和更新时间
	slideData = [],//api获取数据时，轮播所需要的数据
	lastClickedTab,//记录最后一次点击的tab，也就是需要展示的tab
	sendingAjax = {};//正在请求某个tab相应内容的标记位
//new slide
//type 需要轮播的组件类型 例如：movie、image
//datas 如果是cms配好的数据，则不需要传datas，使用方法内部的data。如果是api请求数据，则在外部拼装好之后再传进来。
function newSlide(type, datas) {
	var modData = conf.hotsiteSide.datas[type];
	var data = [];
	var itemTpl = '<a href="#{landingpage}" class="main-item" style="width:238px; height:#{height}"><img src="#{imgSrc}" width="238" height="#{height}" data-i="#{index}"><p class="item-slogon" data-i="#{index}">#{description}</p></a>';
	for (var i=0; i<modData.length; i++) {
		$.extend(modData[i], { "index": i });
		data.push({
			'content': Helper.replaceTpl(itemTpl, modData[i]),
			'id': i+1
		});
	};
	var options = {
		offset: 0,
		navSize: 1,
		itemSize: 238,
		autoScroll: true,
		autoScrollDirection: conf.hotsiteSide.dir == 'ltr' ? 'forward' : 'backward',
		containerId: ".hotsiteside-" + type + " .main-item-wrap",
		data: datas ? datas : data,
		defaultId: 1
	};
	slideRef[type] = new cycletabs.NavUI();
	slideRef[type].init($.extend(options, conf.hotsiteSide));
}

//change tab
function changeTab(ele) {
	var menuType = ele.attr("data-type"),
		target = $(".hotsiteside-" + menuType),
		targetTextarea = target.find("textarea"),
		useSlide = ele.attr("data-slide");
		
	//记录最后一次点击的tab
	lastClickedTab = menuType;

	if(target.hasClass("already")){
		switchTab();
		return; 
	}
	//遍历每个需要自动获取内容的模块，如果这个点击的模块在其中
	//如果有already，则不再重复发送请求
	if(_ajaxOptions.hasOwnProperty(menuType) && !sendingAjax[menuType]){

		var thisOption = _ajaxOptions[menuType],
			url = thisOption.url,
			api = thisOption.api,
			curUrl = api ? api : url;

		getDatas(curUrl, menuType, useSlide);
	}
	//该模块首次引入时执行加载内容
	if (targetTextarea.length) {
		var targetContent = targetTextarea.text();
		target.html(targetContent);
		//需要轮播
		if (useSlide) {
			newSlide(menuType);
		}
	//不包含texteare模块，但使用轮播
	} else if (useSlide && !slideRef[menuType]) {	
		newSlide(menuType);
	}

	switchTab();
	//处理tab的样式改变和内容的显示隐藏。
	//复用。
	function switchTab(){
		tabs.removeClass("cur");
		ele.addClass("cur");
		sideContainer.children("div").hide();
		$(".hotsiteside-" + lastClickedTab).show();
	}
	
}

/*
 * @param type tab标签的data-id
 * @param useSlide 是否需要轮播，只是image用到，所以后续image获取数据的方法改变之后可以删掉。
 * api 个性化推荐 @文革、艳青
 */
function getDatas( url, type, useSlide ){

	var thisOption = _ajaxOptions[type],
		staticUrl = thisOption.url,
		updateTime = thisOption.updateTime,
		isJsonp = _ajaxOptions[type].jsonp;

	sendingAjax[type] = true;

	$.ajax({

		dataType: isJsonp ? "jsonp" : "json",
		url: setTimeStamp(url, updateTime)

	}).done(function( data ){

		fillContent(data, type, useSlide);
		sendingAjax[type] = false;

	}).fail( function(){

		if(url !== staticUrl){

			getDatas(staticUrl, type, useSlide);
		}
	} );
}
//data ajax货取回来的数据
//type 这条数据属于那个tab
//useSlide 是否需要轮播，只是image用到，所以后续image获取数据的方法改变之后可以删掉。
function fillContent(data, type, useSlide){
	var thisContainer = sideContainer.find(".hotsiteside-" + type);
	if(!$.isEmptyObject(data.data)){
		thisContainer.html(fillImgTpl(data.data, type));
		//需要轮播
		if (useSlide) {
			newSlide(type, slideData);
		}
	}else if(!$.isEmptyObject(data.html)){
		
		thisContainer.html($(data.html));
		Helper.globalEval(data.script);

	}else if(!$.isEmptyObject(data.content)){

		thisContainer.html(fillSoccerTpl( data.content.data.current_content, type ));

	}else{

		return;
	}
	//为已经获取到数据的tab添加already，防止重复获取
	thisContainer.addClass("already");
}
//url 需要时间戳的url
//time 多长时间改变一次时间戳 单位小时，默认4小时，当time==0时，每秒改变一次时间戳
function setTimeStamp(url, time){
	var timeStamp,
		date = (new Date()).getTime();

	if(parseInt(time) === 0){
		timeStamp = date;
	}else{
		time = time || 4;
		timeStamp = Math.floor(date/(time * 36e5));
	}

	timeStamp = "timeStamp=" + timeStamp;
    return url.indexOf("?") < 0 ? (url + "?" + timeStamp) : (url + "&" + timeStamp);
}

function fillSoccerTpl( data, type ){
	if( $.isEmptyObject( data ) ){
		return;
	}
	// <span class="soccer-day">#{day} </span>
	var dayArr = _ajaxOptions[type].week.trim().split("|"),
		option = _ajaxOptions[type],
		LEN = 4,
		soccerStr = "",
		listStr = "",
		soccerTpl = '<div class="soccer-title">#{title}</div><div class="soccer-info"><ul class="soccer-info-ul"></ul></div><div class="soccer-more"><a href="#{link}">#{more}</a></div>',
		listTpl = '<li class="soccer-item #{even}"><div class="item-container"><div class="item-content"><i class="#{homeItem}" title="#{homeName}"></i><span>#{homeScore} X #{awayScore}</span><i class="#{awayItem}" title="#{awayName}""></i></div><div class="item-info"><span class="soccer-date">#{date} </span><span class="soccer-place" title="#{place}">#{place}</span></div></div></li>',
		soccerData = {
			title : option.soccerTitle,
			more : option.moreSoccer,
			link : option.moreLink
		},
		listData = {};

		soccerStr = Helper.replaceTpl(soccerTpl, soccerData);

		for( var i=0; i<LEN; i++ ){

			var curData = data[i];

			listData = {

				homeImg : curData.home.img,
				homeName : curData.home.name,
				awayImg : curData.away.img,
				awayName : curData.away.name,
				// day : dayArr[parseInt(curData.weekday)],
				date : getDateByTimestamp( curData.match_date, dayArr ),
				place : curData.stadium,
				even : i % 2 == 0 ? "" : "soccer-item-even",
				homeScore : curData.home.score,
				awayScore : curData.away.score,
				homeItem : curData.home["class"],
				awayItem : curData.away["class"]
			};

			listStr += Helper.replaceTpl(listTpl, listData);
		}

		soccerStr = $(soccerStr).find(".soccer-info-ul").html(listStr).end();

		return soccerStr;

}

/**
 * 把utc标准时间戳转换成巴西时间
 * @param  {string} timestamp 
 * @param {dayArr} 一周每一天的缩写
 * @return {string}           巴西时间
 */
var getDateByTimestamp = function(timestamp, dayArr){
	timestamp = parseInt(timestamp);
	var offset = 2; //非夏令时的时候为utc-2
	// if(isSummerTime) offset = 1; //夏令时为utc-1
	var localDate = new Date();
	var UTCOffset = localDate.getTimezoneOffset();
	var date = new Date((timestamp + UTCOffset*60 - offset*3600)*1000);
	var day = date.getDate();
	var month = date.getMonth()+1;
	var year = date.getFullYear();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var w = date.getDay();
	//var week = mapWeekday(w == 0 ? 6 : w-1);
	var week = dayArr[w];
	return week + " " + day + "/" + month + "/" + year + " - " +  hour + ":" + (minute === 0 ? "00" : minute);
};

//生成image部分的html
//图片接口和其它接口不同，
function fillImgTpl(data, type){
	if($.isEmptyObject(data)){
		return;
	}
	var imgStr = '',
		bigImgStr = '',
		bigImgTpl = '<div class="main-item-wrap#{useSlide}"><a href="#{landingpage}" class="main-item" style="width:238px; height:184px"><img src="#{imgSrc}" width="238" height="178" style="margin-top:6px;" data-i="0"/><p class="item-slogon" data-i="0">#{description}</p></a></div>',
		bigImgListTpl = '<a href="#{landingpage}" class="main-item" style="width:238px; height:184px"><img src="#{imgSrc}" width="238" height="178" style="margin-top:6px;" data-i="0"/><p class="item-slogon" data-i="0">#{description}</p></a>',
		smallImgStr = '<div class="detail-item-wrap cf">',
		smallImgListTpl = '<a href="#{landingpage}"><img src="#{imgSrc}" width="73" height="73"><div class="item-mask hide" data-index="#{index}"></div></a>',
		smallImgListStr = '',
		bigImgData = {
			useSlide : conf.hotsiteSide.datas.hasOwnProperty("image") ? " slide-wrap" : ""
		},
		bigImgListData = {}, //填充大图模板需要的数据
		smallImgListData = {},//填充小图模板需要的数据
		bigDatas = data[0],//后端传回的大图数据
		smallDatas = data[1]; //后端传回的小图数据
	//拼装需要轮播的大图的数据，提供给轮播插件使用
	for(var i=0; i<bigDatas.length; i++){
		bigImgListData = {
			landingpage : bigDatas[i].url || "/image",
			imgSrc : setTimeStamp(bigDatas[i].img_ext),
			description : bigDatas[i].title
		};
		bigImgData.landingpage = bigDatas[0].url || "/image";
		bigImgData.imgSrc = setTimeStamp(bigDatas[0].img_ext);
		bigImgData.description = bigDatas[0].title;
		slideData.push({
			'content': Helper.replaceTpl(bigImgListTpl, bigImgListData),
			'id': i+1
		});
	}
	//获得大图部分的html
	bigImgStr = Helper.replaceTpl(bigImgTpl, bigImgData);
	//获得小图部分的html
	for(var i=0; i<smallDatas.length; i++){
		smallImgListData = {
			landingpage : smallDatas[i].url  || "/image",
			imgSrc : setTimeStamp(smallDatas[i].img_ext),
			index : i
		};

		smallImgListStr += Helper.replaceTpl(smallImgListTpl, smallImgListData);
	}
	smallImgStr += smallImgListStr + '</div>';

	imgStr += bigImgStr + smallImgStr + '<a href="' + _ajaxOptions[type].moreLandingpage + '" class="content-more">' + _ajaxOptions[type].moreTitle + '<i class="arrow_r">&rsaquo;</i></a>';

	return imgStr;
}
//bind log event
function bindLog() {
	sideContainer.parents(".hotsite-side-wrap").on("mousedown", function(e) {
		var target = $(e.target);
		var log = {
			modId: target.parents(".hotsiteside_content").attr("log-mod"),
			position: target[0].tagName == "A" ? "links" : "images",
			sort: "detail"
		};
		if(target[0].tagName != "A") {
			log.ac = "b";
		}
		var index = target.closest("[data-i]").attr("data-i");
		if (index || index == 0) {
			log.sort = index;
		}
		if (target.parents(".main-item-wrap").length > 0) {
			if (target.hasClass("arrow-prev") || target.hasClass("arrow-next")) {
				log.sort = "prev-next";
			} else {
				log.sort = "main";
			}
		} else if (target.hasClass("content-more")) {
			log.sort = "more";
		} else if (target.parents(".item-literal-wrap").length > 0) {
			if (target.hasClass("item-title")) {
				log.sort = "detail-title";
			} else if (target.hasClass("item-desc")) {
				log.sort = "detail-desc";
			}
		} else if (target.parents(".hotsiteside_menu").length > 0) {
			log.modId = target.parents("li").attr("log-mod");
			log.sort = "menu";
		}
		UT.send(log);
	});
}

//bind event
function bindEvent() {
	//图片hover，半透明效果
	$(document).on("hover", ".detail-item-wrap a", function() {
		$(this).find(".item-mask").toggleClass("hide");
	});

	//menu的点击响应
	tabs.on("click", function(e) {
		e.preventDefault();
		changeTab($(this));
	});

	//发送日志绑定
	bindLog();
}

//initial
function init() {
	//初始化第一个模块
	changeTab(tabs.eq(0));
	bindEvent();
}
init();
