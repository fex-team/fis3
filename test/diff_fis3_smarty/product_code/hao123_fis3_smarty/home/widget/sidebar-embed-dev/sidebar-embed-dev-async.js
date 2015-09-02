var $ = require( "common:widget/ui/jquery/jquery.js" ),
	message = require( "common:widget/ui/message/src/message.js" ),
	UT = require( "common:widget/ui/ut/ut.js" );

function SidebarEmbedDev( opt ){
	var that = this;
	that.opt = opt;
	that.id = "sidebarEmbedDev" + that.opt.appType;
	that.srcUrl = that.opt.iframeUrl;
	that.height = that.opt.height;
	that.width = that.opt.width || 239;
	that.mod = $( "#" + that.id );
	
	that.init();
}

SidebarEmbedIframe.prototype = {
	init : function(){
		var that = this,
			iframe = that.mod.find( "iframe" ),
			iframeStr = '<iframe src="' + that.srcUrl + '" width="' + that.width + '" height="' + that.height + '" style="overflow:hidden; display:none;"  sidebarIframe="true" scrolling="no" frameborder="0"></iframe>';
		if( iframe.length < 1 ){
			that.mod.prepend( iframeStr );
		}	
		that.bindEvent();
	},

	hideLoading : function(){
		var that = this;
		that.mod.find( ".loading" ).hide();
	},
	showIframe : function(){
		var that = this;
		that.mod.find( "iframe" ).show();
	},
	
	bindEvent : function(){
		var that = this;
		// 每一个ifame需要一个自动义事件，通过cms配置，该自定义事件需要和被引入的iframe中的自定义事件一致，
		// 具体@余老板的message插件
		message.on( "iframe." + that.opt["event"] + "Sidebar.modReady", function(data){
			if( data === true || data === "true" ){
				that.hideLoading();
				that.showIframe();
			}
		} );
		// that.mod.find( "iframe" ).on( "load", function(){
		// 	that.hideLoading();
		// } );
		that.mod.find( "iframe" ).on( "load", function(){
			that.hideLoading();
			that.showIframe();
		} );
	}
};

module.exports = SidebarEmbedIframe;