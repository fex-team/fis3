//依赖
var $ = require("common:widget/ui/jquery/jquery.js");

//变量
var $html = $("html");
var $body = $("body");
var $mod = $("#fontsizeSwitch");
var $switchers = $mod.find(".switcher");
var classPrefix = "fontsize-switch-";

//初始化
init();

function init() {
	var storeFontsize = $.store("fontsize");
	var bodyFontsize = parseInt($body.css("font-size"));
	//添加html类名
	if (storeFontsize && storeFontsize != bodyFontsize) {
		$html.addClass(classPrefix + storeFontsize);
	}
	//为当前字号元素添加cur类
	$switchers.filter("[data-size=" + (storeFontsize || bodyFontsize) + "]").addClass("cur");
	//切换fontsize
	$mod.on("click", ".switcher", function(e) {
		setFont($(this).attr("data-size"));
	//切换下一个fontsize
	}).on("click", ".switcher-next", function(e) {
		var curFontsize = $.store("fontsize") || parseInt($body.css("font-size"));
		var $curSwitcher = $switchers.filter("[data-size=" + curFontsize + "]");
		if (!$curSwitcher.length) {
			$curSwitcher = $switchers.eq(0);
		}
		var $nextSwitcher = $switchers.eq($curSwitcher.index() % $switchers.length);
		setFont($nextSwitcher.attr("data-size"));
	});
}

//设置fontsize
function setFont(fontsize) {
	var fontClass = classPrefix + fontsize;
	//不为当前字号时
	if (!$html.hasClass(fontClass)) {
		$switchers.filter(".cur").removeClass("cur");
		$switchers.filter("[data-size=" + fontsize + "]").addClass("cur");
		$.store("fontsize", fontsize, {
			expires: 365
		});
		//删除遗留的字号类名
		$.each($html.get(0).className.split(" "), function(index, value) {
			if (value.indexOf(classPrefix) == 0) {
				$html.removeClass(value);
			}
		});
		$html.addClass(fontClass);
	}
}