/**
 * 新手引导
 * 引导气泡按PM配置的先后顺序出现，点击了第一个，出现第二个，依次类推
 * 使用bubble组件
 * author chenliang08
 * time 2014.2.25
 *
 * 新增新功能引导
 * 如果引导气泡超出可视区的左右两边，直接隐藏掉
 * PM可以配置是否让所有气泡同时出现，而不是顺序出现
 * PM可配置是否不在可视区的气泡跳到可视区
 * 记录cookie，隐藏之后就不再显示了
 * author chenliang08
 * time 2014.3.13
 */
var $ = require( "common:widget/ui/jquery/jquery.js" ),
	UT = require( "common:widget/ui/ut/ut.js" ),
	Helper = require( "common:widget/ui/helper/helper.js" ),
	Bubble = require( "common:widget/ui/bubble/src/bubble.js" );
require('common:widget/ui/jquery/jquery.cookie.js');

function UserGuider( id ){
	var that = this;
	that.opt = conf[id];
	that.guiderItems = that.opt.guiderItems;
	// 按顺序存储引导气泡
	that.guiders = [];
	that.guiderNum = that.guiderItems.length;
	that.curGuiderIndex = 0;

	that.init();
}

UserGuider.prototype = {
	init : function(){
		var that = this;
		that.showGuider( 0 );
		// 此处不进行事件绑定，引导气泡初始化之后进行绑定
		// that.bindEvent();
	},
	bindEvent : function( index ){
		var that = this,
			cur = that.guiderItems[index],
			curGuider = $( "#bubble" + cur.guiderId ),
			showAll = that.opt.showAll;
		// 点击关闭按钮
		that.guiders[index].one( "click", ".guider-close-btn", function(){
			that.hideGuider( index );
			curGuider.trigger( "toNextGuide" );
		} );
		// 点击被引导模块后，引导消失
		$( cur.modId ).one( "click", function(){
			that.hideGuider( index );
			curGuider.trigger( "toNextGuide" );
		} );
		// 针对页头，如果页头吸顶（滚动页面）则隐藏掉引导
		$( window ).one( "scroll", function(){
			// 页头吸顶并且已经吸顶并且当前引导在页头，则在滚动时隐藏掉引导或展示下一个引导
			if( that.opt.isCeiling == "1" && that.guiderItems[index].modId.indexOf( "#top" ) > -1 ){
				that.hideGuider( index );
				curGuider.trigger( "toNextGuide" );
			}
		} );
		// 使用自定义事件，确保该方法只被执行一次
		curGuider.one( "toNextGuide", function(){
			var next = index + 1;
			
			if( next < that.guiderNum ){
				that.showGuider( next );
			}
		} );
		// 一起全部显示出来所有的引导
		if( showAll === "true" ){
			curGuider.trigger( "toNextGuide" );
		}
	},
	/**
	 * index指当前的guider
	 * 如果当前是最后一个则直接关闭
	 **/
	showGuider : function( index ){
		var that = this,
			prev = index - 1,
			isCookied = that.checkCookie( index );
		// 如果当前引导已经初始化了，直接返回。
		if( that.guiders[index] ){
			return;
		}
		// 如果当前需要显示的引导记录过cookie，直接跳到下一个
		while( isCookied ){
			index ++;
			if( index >= that.guiderNum ){
				return;
			}else{
				isCookied = that.checkCookie( index );
			}
		}
		if( index < that.guiderNum ){
			var getTarget = that.getTargetMod( index ),
				isOutEdge;
			$.when( getTarget )
				.done( function(){
					that.curGuiderIndex = index;
					that.renderGuider( index );
					that.setMaxWidth( index );
					isOutEdge = that.checkGuiderEdge( index );
					// 如果当前需要显示的引导超出了屏幕，直接跳到下一个
					if( isOutEdge ){
						index ++;
						if( index >= that.guiderNum ){
							return;
						}else{
							that.showGuider( index );
							// isOutEdge = that.checkGuiderEdge( index );
						}
					}else{
						$( "#bubble" + that.guiderItems[index].guiderId ).show();
						// 增加将引导跳转到可视区的开关
						if( that.opt.relocation !== "false" ){
							that.relocation( index );
						}
					}
				} );
		}
	},
	/**
	 * 渲染引导
	 * index {string} 第index个引导气泡
	 */
	renderGuider : function( index ){
		var that = this,
			curGuider = that.guiderItems[index],
			style = "left:" + curGuider.rowLef + "px; top:" + curGuider.rowTop + "px;";
		// console.log( style );
		that.guiders[index] = $( curGuider.modId ).bubble( {
			"wrapOpt" : {
				"modId" : curGuider.guiderId,
				"skin" : curGuider.guiderClass,
				"content" : curGuider.text,
				"before" : "<i class='guider-arrow " + curGuider.rowDir + "' style='" + style + "'></i><em class='guider-close-btn " + curGuider.rowDir + "'>&times;</em>"
			},
			"pos" : {
				"left" : parseInt( curGuider.guiderLeft ),
				"top" : parseInt( curGuider.guiderTop )
			}
		} );
		// 将当前气泡的index储存起来
		// that.guiders[index].index = index;
		// 为当前气泡绑定事件
		that.bindEvent( index );
	},
	/**
	 * 设置每个引导气泡文字的最大宽度，适应不同的场景
	 **/
	setMaxWidth : function( index ){
		var that = this;
		that.guiders[index].find( ".ui-bubble_t" ).css( "max-width", that.guiderItems[index].maxWidth + "px" );
	},
	/**
	 * 确保目标元素存在并可见
	 * 使用jQuery封装的异步队列，解耦查找目标元素和显示气泡的逻辑
	 */
	getTargetMod : function( index ){
		var that = this,
			deferred = $.Deferred(),
			targetMod = $( that.guiderItems[index].modId ),
			timer;

		if( targetMod.length < 1 || targetMod.css( "display" ) == "none" || targetMod.css( "visibility" ) == "hidden" ){
			timer = setInterval( function(){
				targetMod = $( that.guiderItems[index].modId );
				if( targetMod.length &&  targetMod.css( "display" ) != "none" && targetMod.css( "visibility" ) != "hidden"){
					clearInterval( timer );
					deferred.resolve();
				}
			}, 100 );
		}else{
			deferred.resolve();
		}
		return deferred.promise();
	},
	/**
	 * 隐藏气泡的同时记录cookie，下次进入页面不再显示气泡
	 */
	hideGuider : function( index ){
		var that = this;
		$( "#bubble" + that.guiderItems[index].guiderId ).hide();
		$.cookie.set( "g" + that.guiderItems[that.curGuiderIndex].guiderId, 1 );
	},
	/**
	 * 当引导不在可视区时跳转到可视区
	 */
	relocation : function( index ){
		var that = this,
			win = $( window ),
			curOpt = that.guiderItems[index],
			curGuider = $( "#bubble" + curOpt.guiderId ),
			top = curGuider.offset().top,
			winHeight = win.height();
		if( top > winHeight ){
			win.scrollTop( top - 150 );
		}
	},
	/**
	 * 检测当前需要显示的用户引导是否之前显示过
	 * return boolean 
	 */
	checkCookie : function( index ){
		var that = this;
			isCookied = $.cookie.get( "g" + that.guiderItems[index].guiderId );
		return !!isCookied;
	},
	/**
	 * 检查新手引导是否超出屏幕的宽度
	 * return false-未超出 true-超出
	 */
	checkGuiderEdge : function( index ){
		var that = this,
			win = $( window ),
			winWidth = win.width(),
			curOpt = that.guiderItems[index],
			curGuider = $( "#bubble" + curOpt.guiderId ),
			left = parseInt( curGuider.css( "left" ) ),
			guiderWidth = curGuider.width(),
			rightEdge = winWidth - guiderWidth;
		// 判断是否超出左右边界
		if( left < 0 || left > rightEdge ){
			return true;
		}
		return false;
	}
};
module.exports = UserGuider;