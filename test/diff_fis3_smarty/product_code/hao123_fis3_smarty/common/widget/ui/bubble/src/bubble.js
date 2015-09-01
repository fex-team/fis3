var $ = require('common:widget/ui/jquery/jquery.js');
var helper = require('common:widget/ui/helper/helper.js');
/**
 * @author Cgy
 * @version 1.0.0
 * @description  
 *     基于css-ui.css生成气泡，样式参考http://ui.i18n.pro/demo/#bubble
 *     如果需要自定义样式，可在.ui-bubble-modId（对应modId）类名下来修改
 *     如果需要自定义z-index, 需要在样式后添加!important
 *     
 * 用法： var demo = $("#test").bubble(opt);
 *        // demo对象为jQuery对象，指向生成的气泡对象
 *
 * 
 * 
    opt = {
		'wrapOpt': {
			// 用于统计参数和自定义样式，为空时自动向上遍历获得最近的modId，可选，推荐必填
			'modId': '', 
			// 用于控制arrow的方向，共有四个值t,b,l,r,默认为t，可选
			'direc': 't', 
			// 主体内容前面的额外内容，可为HTML字符串，可选
			'before': '', 
			// 主体内容后面的额外内容，可为HTML字符串，可选
			'after': '', 
			// 主体内容，可为HTML字符串，必填
			'content': '',
			// 气泡皮肤类名（ui-bubble--skin），可选
			'skin': ''
		}, // 以下为可选
		'moreOpt': {
			// 更多链接的位置，r,t,b,l. 默认值r。可选. 参考http://ui.i18n.pro/demo/#arrow
			'direc': '',
			// 更多链接align的位置，aa,av,ah. 默认值av。可选. 参考http://ui.i18n.pro/demo/#arrow
			'microDirec': '',
			// 更多链接的链接， 默认值#。可选
			'url': '',
			// 更多链接的内容，为空时不显示更多链接，可选
			'content': ''
		},
		'btnOpt': {
			// 按钮的位置，l，r，可选。默认值r. 参考http://ui.i18n.pro/demo/#button
			'direc': 'r',
			// 按钮的内容，为空时不显示按钮，可选
			'content': ''
		},
		'pos': {
	        'left': 20, // 气泡位置距离生成气泡元素左上角的距离，可选. 默认值0
	        'top': 10  // 可选. 默认值0
	    },
	    'callback': {// 事件绑定通过类名和方法的映射。当点击拥有类名的a标签时触发对应事件。可选
            'ui-bubble_close': function() {
                alert("close")
            },
            'ui-bubble_more': function() {
                alert("more")
            },
            'ui-btn': function() {
                alert("btn")
            }
        }
	}
 *
 */
(function() {
	var _defaultTpl = '<div class="ui-bubble ui-bubble-#{direc} ui-bubble-#{modId} #{skin}" log-mod="#{modId}" style="display: none;z-index: #{zIndex};" id="bubble#{modId}"><b class="ui-arrow ui-bubble_out"></b><b class="ui-arrow ui-bubble_in"></b><a href="#" class="ui-bubble_close" onclick="return false" hidefocus="true">×</a>#{before}<p class="ui-bubble_t">#{content}#{more}</p>#{btn}#{after}</div>',
		_moreTpl = '<a href="#{url}" class="ui-bubble_more"><b class="ui-arrow ui-arrow-#{direc} ui-arrow-#{microDirec}"></b>#{content}</a>',
		_btnTpl = '<span class="ui-btn_bar ui-btn_bar-#{direc}"><a href="#" onclick="return false" class="ui-btn" hidefocus="true">#{content}</a></span>';
	var _defaultOpt = {
		'wrapOpt': {
			'modId': '', 
			'direc': 't', 
			'before': '',
			'after': '',
			'content': '',
			'more': '',
			'btn': '',
			'skin': ''
		},
		'moreOpt': {
			'direc': 'r',
			'microDirec': 'av',
			'url': '#',
			'content': ''
		},
		'btnOpt': {
			'direc': 'r',
			'content': ''
		}, 
		'pos': {
			'left': 0,
			'top': 0
		},
		'callback': null
	};

	var _data = [];// 所有使用本组件生成的气泡都放于该数组中，用于位置同步

	/**
	 * 同步气泡和生成气泡对象的位置
	 * 初始化监听器，每500毫秒查询一下每个生成气泡的对象是否位置发生变化
	 * 如果气泡或者生成气泡对象有一个display为none的话，气泡位置不发生变化
	 */
	function init() {
		setTimeout(function() {
			var i = 0,
				tmp = null,
				offset = null,
				toObj = null,
				fromObj = null,
				len = _data.length;

			for (; i < len; i++) {
				tmp = _data[i];
				toObj = tmp.toObj;
				fromObj = tmp.fromObj;
				offset = fromObj.offset();

				if (toObj.css("display") === "none" || fromObj.css("display") === "none") {
					continue;
				}
				if (offset.left == tmp["oldPos"].left && offset.top == tmp["oldPos"].top) {

				} else {
					_data[i] = fixPosition(toObj, fromObj, tmp.pos);
				}
			}
			setTimeout(arguments.callee, 500);
		}, 500);
	}

	/**
	 * 
	 * @param  {object} opt 配置参数
	 * @return {string}     拼接好的html模版
	 */
	function getHtml(opt) {
		var wrapOpt = opt["wrapOpt"],
			moreOpt = opt["moreOpt"],
			btnOpt = opt["btnOpt"];

		moreOpt && (wrapOpt.more = moreOpt.content ? helper.replaceTpl(_moreTpl, moreOpt) : "");
		btnOpt && (wrapOpt.btn = btnOpt.content ? helper.replaceTpl(_btnTpl, btnOpt) : "");
		wrapOpt["skin"] = wrapOpt["skin"] ? ("ui-bubble--" + wrapOpt["skin"]) : "";
		return helper.replaceTpl(_defaultTpl, wrapOpt);
	}
	/**
	 * 绑定事件
	 * @param  {jQuery} wrap 事件代理对象
	 * @param  {object} opt  类名和对应触发事件映射
	 * 
	 */
	function bindEventHandler(wrap, opt) {
		wrap.on("click", ".ui-bubble_close", function(e) {
			wrap.hide();
		});

		if (!opt) return;
		wrap.on("click", "a", function(e) {
			var that = $(this),
				i;
			for (i in opt) {
				if (that.hasClass(i)) {
					opt[i].call(that, wrap, e);
				}
			}
			
		});
	}

	/**
	 * toObj相对于fromObj的左上角和pos对象整合后定位
	 * @param  {jQuery} toObj   气泡对象
	 * @param  {jQuery} fromObj 生成气泡对象
	 * @param  {object} pos     偏移位置信息
	 * @return {object}         {气泡对象，生成气泡对象，偏移位置，生成气泡对象当前位置信息}
	 */
	function fixPosition(toObj, fromObj, pos) {
		var offset = fromObj.offset(),
			curPos = offset;

		pos = pos || {
			left: 0,
			top: 0
		};
		curPos.left += pos.left;
		curPos.top += pos.top;
		toObj.offset(curPos);

		return {
			toObj: toObj,
			fromObj: fromObj,
			pos: pos,
			oldPos: offset
		};
	}

	$.fn.extend({
		bubble: function(opt) {
			var _wrap = $("#bubbleUIWrap"),
				origin = $(this),
				that = null,
				curOpt;
			if (_wrap.length) {} else {
				$(document.body).append('<div class="l-wrap" id="bubbleUIWrap"></div>');
				_wrap = $("#bubbleUIWrap");
			}

			if (opt["wrapOpt"].modId === "") {
				opt["wrapOpt"].modId = this.closest("[log-mod]").attr("log-mod");
			}

			curOpt = $.extend(true, {}, _defaultOpt, opt);
			curOpt["wrapOpt"].zIndex = parseInt(0 + origin.css("z-index"), 10) + 1;
			$(getHtml(curOpt)).appendTo(_wrap);
			that = _wrap.find(".ui-bubble-" + opt["wrapOpt"].modId);
			bindEventHandler(that, curOpt["callback"]);
			_data.push(fixPosition(that, origin, curOpt["pos"]));

			return that;
		}
	});

	init();
})();