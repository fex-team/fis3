/**
 * @author chenliang
 * @email chenliang08@baidu.com
 * @time 2013/12/05
**/
var $ = require("common:widget/ui/jquery/jquery.js"),
	UT = require("common:widget/ui/ut/ut.js"),
	Helper = require("common:widget/ui/helper/helper.js"),
	Time = require("common:widget/ui/time/time.js");

function Football( type ){
	var that = this;
	that.mod = $( "#" + conf.recommand.id );
	that.type = type; 
	that.options = conf.recommand.options[that.type];
	that.SHOWNUM = 4; // 显示的信息条数为4条，后端返回10条 
	that.fragment = "";
	that.infoContainer = that.mod.find( ".football-info-ul" );
	that.moreBtn = that.mod.find( ".football-more" );
}

var proto = Football.prototype;

proto.init = function(){

	this.getDate();
	this.bindEvent();
	this.bindLog();
};

proto.getDate = function(){

	var that = this;

	$.ajax( {

		url : conf.apiUrlPrefix + "?round=" + that.options.round + "&app=brsoccer&act=entrance&country=br&league=1&jsonp=?",
		dataType : "jsonp"

	} ).done( function( data ){

		that.fragment = that.createFragment( data );
		that.render();

	} ).fail( function(){

		// alert(1);
	} );
};

/**
 * 获取到数据后拼装DOM碎片
 * @param {json}
 * @return {String} 
 */
proto.createFragment = function( data ){

	if( $.isEmptyObject( data ) ) return;

	var that = this,
		str = "",
		tpl = '<li class="football-item #{even}"><div class="item-container"><div class="item-content"><i class="#{homeItem}" title="#{homeName}"></i><span>#{homeScore} X #{awayScore}</span><i class="#{awayItem}" title="#{awayName}"></i></div><div class="item-info"><span class="football-date">#{date} </span><span class="football-place" title="#{place}">#{place}</span></div></div></li>',
		data = data.content.data.current_content,
		tplData = {};

	if( $.isEmptyObject( data ) ) return;

	for( var i=0; i<that.SHOWNUM; i++ ){

		var curData = data[i];

		listData = {

			homeImg : curData.home.img,
			homeName : curData.home.name,
			awayImg : curData.away.img,
			awayName : curData.away.name,
			// day : dayArr[parseInt(curData.weekday)],
			date : that.formatLocalDate( curData.match_date ),
			place : curData.stadium,
			even : i % 2 == 0 ? "" : "football-item-even",
			homeScore : curData.home.score,
			awayScore : curData.away.score,
			homeItem : curData.home["class"],
			awayItem : curData.away["class"]
		};

		str += Helper.replaceTpl(tpl, listData);
	}

	return str;
};

proto.render = function(){
	this.infoContainer.html( this.fragment );
};

// proto.bindEvent = function(){

// };

proto.bindLog = function(){
	var that = this;
	that.moreBtn.on( "click", function(){
		that.sendLog( "moreBtn", "moreBtn" );
	} );
};

proto.sendLog = function( position, sort ){
	var that = this;
	UT.send( {
		modId : "recommand-" + that.type,
		position : position,
		sort : sort
	} );
};


/**
 * 把utc标准时间戳转换成巴西时间
 * @param  {string} timestamp 
 * @param {dayArr} 一周每一天的缩写
 * @return {string}           巴西时间
 */
proto.formatLocalDate = function( timestamp ){

	
	var timestamp = parseInt(timestamp),
		offset = this.options.timezoneOffset,
		localDate = new Date(),
		UTCOffset = localDate.getTimezoneOffset(),
		date = new Date((timestamp + UTCOffset*60 - offset*3600)*1000),
		day = date.getDate(),
		month = date.getMonth()+1,
		year = date.getFullYear(),
		hour = date.getHours(),
		minute = date.getMinutes(),
		weekDay = date.getDay(),
		weekStr = this.options.week.split( "|" )[weekDay];
		
	return weekStr + " " + day + "/" + month + "/" + year + " - " +  hour + ":" + (minute === 0 ? "00" : minute);
};

module.exports = Football;