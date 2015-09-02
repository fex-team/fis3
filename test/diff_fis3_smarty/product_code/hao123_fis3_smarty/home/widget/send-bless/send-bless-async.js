/**
 * 送祝福活动
 * @author chenliang
 * @time 2013.12.05
 * @email chenliang08@baidu.com
 */

var $ = require( "common:widget/ui/jquery/jquery.js" ),
	UT = require( "common:widget/ui/ut/ut.js" );

function SendBless(){
	var that = this;
	that.mod = $( "#" + conf.sendBless.id );
	that.opt = conf.sendBless.opt;
	that.apiPreFix = conf.apiUrlPrefix;
	that.blessBtn = that.mod.find( ".bless-btn" );
	that.cakeLink = that.mod.find( ".cake-link" );
	that.landingLink = that.mod.find( ".landing-btn a" );
	that.numContainer = that.mod.find( ".num-container" );
	that.closeBtn = that.mod.find(".close");
	that.shouldInit = !!$.cookie( "hideSendBless" ) ? false : true;
	// 用户是否有权限送祝福的标记
	that.hasAuthority = false;
	// 已送祝福的数量
	that.blessNum = 0,
	// 数字的总位数，UI上最多只能展示7位
	that.NUMTOLLEN = 7,
	// 所能接受的祝福最大数字
	that.MAXNUM = 9999999,
	// api参数，多个方法用到，所以放到这里
	that.urlParam = "&uid=" + $.cookie( "BAIDUID" ) + "&jsonp=?"; //
}

var proto = SendBless.prototype;

/**
 * 入口
 * 获取已经送祝福的数量并展示
 * 检测用户是否有权限送祝福
 * 绑定统计信息
 **/
proto.init = function(){
	// 在初始化内部判断是否需要初始化似乎有些奇怪
	if( !this.shouldInit ) return;

	var that = this,
		// 获取已经送祝福的数量
		gotBlessNum = this.getBlessInfo(),
		// 验证是否有权限送祝福
		checkedAut = this.checkAuthority(); 

	// 使用deferred，分离逻辑，将异步获取数据和处理数据解耦合
	$.when( gotBlessNum ).done( function(){
		// 检查是不是超过最大值
		that.checkNum();
		that.setBlessNum( that.formatNum( that.blessNum ) );
	} );

	$.when( checkedAut ).done( function(){
		that.changeBtnStatus();
	});
	that.bindEvent();
	that.bindLog();
	that.show();
	// test
	// that.checkNum();
	// that.setBlessNum( that.formatNum( that.blessNum ) );
};
/**
 * 关闭送祝福模块
 */
proto.close = function(){
	this.mod.hide();
};
/**
 * 显示送祝福模块
 */
 proto.show = function(){
 	this.mod.show();
 };
/**
 * 绑定事件
 */
proto.bindEvent = function(){
	var that = this;

	// 当用户点击送祝福按钮时，如果有送祝福的权限就向后台发送请求
	that.blessBtn.on( "click", function(){
		if( that.hasAuthority ){
			that.sendBless( that.blessNum );
		}
	} );

	that.closeBtn.on( "click", function(){
		that.close();
		$.cookie( "hideSendBless", 1, { expires: that.getCookieTime() } );
	} );
};
/**
 * 检测用户是否有权限送祝福
 * 是否有权限的字段在构造函数中定义，改变该字段的值
 */
proto.checkAuthority = function(){
	var that = this,
		// jQuery的回调机制
		deferred = $.Deferred();

	$.ajax( {
		url : that.apiPreFix + that.opt.checkAutApi + that.urlParam,
		dataType : "jsonp"
	} )
	.done( function( data ){
		if( data.content.data.status === 1){
			that.hasAuthority = true;
			deferred.resolve();
		}
	} );

	return deferred.promise();
};
/**
 * 检查祝福数是否已经超过最大值
 */
proto.checkNum = function(){
	if( this.blessNum >= this.MAXNUM ){
		this.blessNum = this.MAXNUM;
	}
}
/**
 * 发送祝福信息到后台
 * 改变祝福的数字并取消用户送祝福的权限
 **/
proto.sendBless = function(){
	var that = this;

	$.ajax( {
		url : that.apiPreFix + that.opt.sendBlessApi + that.urlParam,
		dataType : "jsonp"
	} );

	that.hasAuthority = false;
	that.changeBtnStatus();
	that.blessNum += 1;
	// 检查是不是超过最大值
	that.checkNum();
	that.setBlessNum( that.formatNum( that.blessNum ) );
};
/**
 * 到后台请求已祝福的相关信息，主要是数量
 */
proto.getBlessInfo = function(){
	var that = this,
		deferred = $.Deferred();

	$.ajax( {
		url : that.apiPreFix + that.opt.getBlessApi + that.urlParam,
		dataType : "jsonp"
	} )
	.done( function( data ){ 
		that.blessNum = parseInt( data.content.data.num );
		deferred.resolve();
		// that.setBlessNum( that.formatNum( data ) );
	} );
	// test
	// that.setBlessNum( that.formatNum( "123" ) );

	return deferred.promise();
	
};
/**
 * 将得到的数字补齐7位，不够的前面补0
 */
proto.formatNum = function( num ){
	var totalLen = this.NUMTOLLEN, 
        numStr = String( num ),
        numArr = numStr.split(""),
        len = numArr.length;

 	return Array(totalLen - numArr.length + 1).join(0) + numStr;
};
/**
 * 将数字插入DOM
 */
proto.setBlessNum = function( numStr ){
	var totalLen = this.NUMTOLLEN;
		container = this.numContainer,
		singleCons = container.find( ".con" ),
		numArr = String( numStr ).split( "" ),
		len = numArr.length;

	$.each( singleCons, function( i, val ){
		if( i > totalLen - ( len + 1 ) ){
			$( val ).html( numArr[len- ( totalLen - i )] ); //+ '<em class="line"></em>'
		}
	} );
};
/**
 * 改变btn的状态
 */
proto.changeBtnStatus = function(){
	if( this.hasAuthority ){
		this.blessBtn.addClass( "bless-able" );
	}else{
		this.blessBtn.removeClass( "bless-able" );
	}
};
/**
 * 获取第二天0:00时间点的date对象
 * @return date对象
 */
proto.getCookieTime = function(){
	var d = new Date(),
		year = d.getFullYear(),
		month = d.getMonth(),
		day = d.getDate(),
		nextDay = new Date( year, month, ( day + 1 ), 00, 00, 00 );

		return nextDay;
},
/**
 * 绑定事件发送统计信息
 */
proto.bindLog = function(){
	var that = this;

	that.cakeLink.on( "click", function(){
		sendLog( "cakeLink" );
	} );

	that.landingLink.on( "click", function(){
		sendLog( "landingLink" );
	} );

	that.blessBtn.on( "click", function(){
		if( that.hasAuthority ){
			sendLog( "blessBtn", true );
		}
	} );
	that.closeBtn.on( "click", function(){
		sendLog( "closeBtn", true );
	} );

	function sendLog( pos, ac ){
		var utObj = {
			modId: "sendBless",
			position: pos
		};
		if (ac) {
			utObj.ac = "b";
		}
		UT.send(utObj);
	}
};

module.exports = SendBless;