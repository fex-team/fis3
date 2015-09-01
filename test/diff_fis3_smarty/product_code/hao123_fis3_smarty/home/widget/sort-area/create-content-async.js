/**
 * tab的特殊情况处理（例如日本购物）
 * 此方法目前只在日本购物使用
 * 通过同时发送两条请求获取模板和数据，并在成功后写入到页面
 * @author chenliang
 * @email chenliang08@baidu.com
 * @time 2013/12/27
**/
var $ = require("common:widget/ui/jquery/jquery.js");
	helper = require("common:widget/ui/helper/helper.js");
/**
 * 构造函数
 * @param tab{string} tab的类型（和tab模板中的data-type一致）
 * @param dataUrl{string} apps中用到
 * @param defaultData{string} 支持配置的数据替换接口中的数据
 */
function CreateContent( tab, dataUrl, defaultData ){
	var that = this;
	that.dataUrl = dataUrl;
	that.opt = conf.sortArea;
	that.mod = $( "#" + that.opt.id );
	that.tabOpt = that.opt.sortAreaTab[tab];
	that.container = that.mod.find( ".container" );
	that.content = that.container.find( "." + tab );
	that.loadingFlower = that.container.find( ".loading" );
	that.defaultData = defaultData;
	// save tpl and data from ajax request, render will use them
	// that.cache = {
	// 	tpl : null,
	// 	data : null
	// };
	that.showLoadingFlower();
	that.render( tab );
}

CreateContent.prototype = {
	/**
	 * 1、将获取到的tpl的html、css插入页面。2、将数据推到conf.sortArea.data供tpl中的js使用。3、globalEvaltpl中的js
	 * @param tab{string} tab的类型（和tab模板中的data-type一致）
	 *
	 */
	render : function( tab ){
		var that = this,
			gotResource = that.getResource();
		$.when( gotResource )
			.done( function( tpl, data ){
				that.hideLoadingFlower();
				// 将html、css插入页面
				that.content.html( tpl.html );
				that.opt.data = data;
				// 执行js，并到conf.sortArea.data中拿到数据拼装页面
				helper.globalEval( tpl.script );
			} );
	},
	/**
	 * 同时发送两条请求分别获取模板（包括html、css、js）和数据（api提供）
	 * @param tab{string} tab的类型（和tab模板中的data-type一致）
	 ***/
	getResource : function(){
		var that = this,
			deferred = $.Deferred(),
			tplUrl = that.tabOpt.url,
			apiPre = that.tabOpt.apiPre,
			dataUrl = ( apiPre ? apiPre : conf.apiUrlPrefix )  + ( that.dataUrl ? that.dataUrl : that.tabOpt.dataUrl ) + "&jsonp=?",
			updateTime = that.tabOpt.updateTime, //"http://api.dev.hao123.com:8999/api.php"
			ajaxTpl,
			ajaxData,
			defaultData = that.defaultData;
		// 获取模板
		ajaxTpl = $.ajax( {
			url : tplUrl,
			dataType : "json"
		} );
		// 获取数据
		ajaxData = $.ajax( {
			url : dataUrl,
			dataType : "jsonp"
		} );
		// 同时监控获取模板和获取数据
		$.when( ajaxTpl, ajaxData )
			.done( function( tpl, data ){
				// that.cache.tpl = tpl[0];
				// that.cache.data = data[0];
				// 标记两条ajax都成功，并将模板和数据传递给render方法处理
				if( defaultData ){
					data[0]["defaultData"] = defaultData;
				}
				deferred.resolve( tpl[0], data[0]);
			} )
			.fail( function(){
				// 标记两条请求没有都成功
				deferred.reject();
			} );

		return deferred.promise();
	},
	/**
	 * 隐藏菊花
	 */
	showLoadingFlower : function(){
		var that = this;
		that.loadingFlower.css( "display", "block" );
	},
	/**
	 * 显示菊花
	 */
	hideLoadingFlower : function(){
		var that = this;
		that.loadingFlower.hide();
	}
};
module.exports = CreateContent;
