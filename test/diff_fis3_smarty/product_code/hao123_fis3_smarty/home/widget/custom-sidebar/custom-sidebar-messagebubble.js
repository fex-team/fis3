var $ = require("common:widget/ui/jquery/jquery.js");
var helper = require("common:widget/ui/helper/helper.js");
var UT = require("common:widget/ui/ut/ut.js");
var lazyload = require("common:widget/ui/jquery/widget/jquery.lazyload/jquery.lazyload.js");
var T = require("common:widget/ui/time/time.js");
var $cookie = require('common:widget/ui/jquery/jquery.cookie.js');
var hex_md5 = require('common:widget/ui/md5/md5.js');

var messageBubble = function (option,api) {
	var that = this;

	//手动配置的消息提醒
	that.config = option;
	//自动的api信息
	that.api = api;

	that.tpl = '<i class="message">#{value}</i>';
	that.sidebar = $(".mod-custom-sidebar");
	that.cookieName = "sidebarMessage";
	that.status = conf.customSidebar.status;
	
};

/**
  *初始化消息提醒气泡
*/
messageBubble.prototype.init = function () {
	var that = this,
		config = that.config,
		app = $(".si-" + config.id);

	that.setType();
	that.bindEvents();
	that.handleApiMessage();
	that.getVisibility(app) && 
	that.setMessage( app,config.value ) && 
	(that.status.messageBubble = config.id);
};

/**
  *设置app的消息提醒
*/
messageBubble.prototype.setMessage = function ( el,value,id ) {
	var message = el.find(".message"),
		status = this.status;

	if( status.inProcess || status.app == id ){
		return;
	} else if( value && value != 0 && el.length ) { 
		//显示消息
		message.length ? message.text(value) : el.append(helper.replaceTpl(this.tpl,{"value":value}));		
		//如果sidebar是关着的，就把消息都加起来
		status.isClose && this.collectMessage();
		
	}

	return this;
};

/**
  获取策略类型	
*/
messageBubble.prototype.setType = function () {
	var type = 4,
		config = this.config;
	if( config.once ){
		type = 1;
	}
	else if(  config.userOption  ){
		type = 2;
	} else if( config.timeOption ){
		type = 3;
	} 
	this.type = type;
};

/**
  *设置cookie
*/
messageBubble.prototype.setCookie = function (time) {
	$.cookie.set(this.cookieName,this.type,{expires:time})
};

/**
  *获取显隐值	
*/
messageBubble.prototype.getVisibility = function (app) {
	var that = this,
		cookie = $.cookie.get(that.cookieName),
		visible = true;	

	if( !cookie ){
		that.config.once && that.setCookie(30);
	} else if( cookie ) {
		cookie == that.type ? (visible = false) : that.setCookie(-1);
	}

	!app.length && (visible = false);

	return visible;
};
/**
  *重设cookie	
*/
messageBubble.prototype.resetCookie = function () {
	var that =  this,
		config = that.config,
		name = that.cookieName,
		type = that.type,
		time = -1;

	that.status.messageBubble = "";

	if( type == 4 || type == 1){
		return;
	}  else if( type == 2 ){
		time = 30;
	} else if( type == 3 ){
		time = parseInt( config.timeOption,10 );		
	} 

	that.setCookie(time);
};

/**
  *绑定事件
*/
messageBubble.prototype.bindEvents = function () {
	var that = this,
		sidebar = this.sidebar;

	sidebar.on("resetMessageCookie",function(){
		that.resetCookie();
	})
	.on("setMessage",function( e,el,value ){
		that.setMessage( el,value );
	})
	.on("removeMessage",function(e,id,el){
		el = el || ".si-" + id;

		$(el).find(".message").remove();
	});
};

/**
  *处理api消息
*/
messageBubble.prototype.handleApiMessage = function () {
	var that = this,
		api = that.api;

	for( var i = 0;i < api.length;i++ ){
		var data = api[i];
		if( data.type == "news" ){
			if( data.interval ){
				setInterval(function(){
					that.getNews( data.id );	
				},data.interval * 10000);
			} else {
				that.getNews( data.id );	
			}			
		}
	}
};


/**
  *获取新闻的未读消息数
*/
messageBubble.prototype.getNews = function ( id ) {
	var list = conf.customSidebar.newsTypeList,
		typeList = [],
		result = "",
		that = this,
		newsApp = $(".si-"+id),
		params = "?app=newscount&act=contents&vk=1&country=" + conf.country + "&type=";

	for( var i = 0;i < list.length;i++ ){
		var type = list[i].id || i;
		typeList.push(type);
	}
	params = params + typeList.join("|");
	$.ajax({
		url :  conf.apiUrlPrefix + params,
		dataType: "jsonp",
		jsonp : "jsonp",
        jsonpCallback: "ghao123_" + hex_md5(params,16),
        success: function(result){
        	that.setMessage(newsApp,result.content.data[0].count,id);
        }
	});
};

/**
  *如果sidebar处于关闭的状态，就把所有的消息汇总显示
*/
messageBubble.prototype.collectMessage = function () {
	var result = 0,
		that = this,
		con = this.sidebar.find(".arrow-wrap"),
		el = con.find(".message");

	$(".app-icons-wrap").find(".message").each(function(i){
		var text = $.trim($(this).text()),
			num;

		if( !text.length ){
			return true;
		} else {
			num = parseInt( text,10 );
			if( !num && num !== 0  ) {
				result = "•••";
				return false;
			} else {
				result = num + result;
			}
		}	
		
	});
 
	el.length ? el.text(result) : con.append(helper.replaceTpl(this.tpl,{"value":result}));
};


module.exports = messageBubble;










