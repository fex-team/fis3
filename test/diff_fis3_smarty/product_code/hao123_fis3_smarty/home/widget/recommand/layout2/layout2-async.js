/**
 * @author chenliang
 * @email chenliang08@baidu.com
 * @time 2013/11/25
**/
var $ = require("common:widget/ui/jquery/jquery.js"),
	UT = require("common:widget/ui/ut/ut.js"),
	cycletabs = require("common:widget/ui/cycletabs/cycletabs.js"),
	Helper = require("common:widget/ui/helper/helper.js");
/**
 * 构造函数
 * @param type{string} 模块的类型 例子："movie"
 */
function Layout2( type ){
	var that = this;
	that.mod = $( "#" + conf.recommand.id );
	that.type = type; 
	that.options = conf.recommand.options[that.type]; 

	that.mainBanner = that.mod.find( ".layout2-big" );
	that.smallItems = that.mod.find( ".layout2-small" );
	that.moreBtn = that.mod.find( ".layout2-more" );

	that.init();
}

Layout2.prototype = {

	init : function(){
		var that = this;
		that.slide();
	},

	slide : function( datas ) {
		var that = this,
			bannerData = that.options.banner,
			data = [],
			tpl = '<a href="#{landingpage}" class="big" data-sort="#{type}-banner#{index}"><img src="#{imgSrc}" width="238" height="184" style="display:block;"/><p class="des">#{description}</p></a>';

		for (var i=0; i<bannerData.length; i++) {
			$.extend( bannerData[i], { "index": i+1, "type": that.type } );
			data.push({
				'content': Helper.replaceTpl(tpl, bannerData[i]),
				'id': i+1
			});
		};

		var options = {
			offset : 0,
			navSize : 1,
			itemSize : 238,
			autoScroll : false,
			autoScrollDirection : that.options.direction,
			autoDuration : that.options.autoDuration,
			scrollDuration : that.options.scrollDuration,
			containerId : that.mod.find( ".layout2-big" ),
			data : datas ? datas : data,
			defaultId : 1,
			dir : conf.dir
		};
		slideObj = new cycletabs.NavUI();
		slideObj.init( options );
	}
};

module.exports = Layout2;