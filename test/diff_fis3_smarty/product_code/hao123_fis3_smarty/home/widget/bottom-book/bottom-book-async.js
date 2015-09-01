var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var cycletabs = require('common:widget/ui/cycletabs/cycletabs.js');
var helper = require("common:widget/ui/helper/helper.js");

var $glo = $(".mod-bottom-book"),
	_con = conf.bottomBook,
	_buy = _con.buy,
	_data = _con.list,
	_tpl = '<div class="btm-lst #{other}"><div class="btm-fram" title="#{hoverTitle}"><a href="#{imgUrl}"><img src="#{imgSrc}"></a></div><span class="btm-#{typ} btm-num">#{num}</span><div class="btm-tle">#{title}</div><div class="btm-juan"><i class="i-juan"></i>#{juan}</div><div class="btm-money"><i class="i-money"></i>#{money}</div><a href="#{btnUrl}" class="btm-btn"><i class="i-bk"></i>#{buy}</a></div>',
	_tmp = "",
	k = 1;

$glo.find(".btm-hd").css("visibility", "visible");

var arrayList = [];

for (var i = 0, j = _data.length; i < j; i++) {
	if (i !== 0 && (i % 5 === 0)) {
		arrayList.push({
			content: _tmp,
			id: k++
		});
		_tmp = "";
	}
	_data[i].imgUrl = _data[i].imgUrl || "";
	if (i % 5 === 4 || i === j - 1) {
		_data[i].other = "btm-no-border";
	} else {
		_data[i].other = "";
	}
	_data[i].buy = _buy;
	_data[i].num = i + 1;
	_tmp += helper.replaceTpl(_tpl, _data[i]);
}
if (_tmp != "") {
	arrayList.push({
		content: _tmp,
		id: k
	});
	_tmp = "";
}

function initSlide(con, data, size, wrap, $glo) {
	//调用slide组件
	var options = {
		offset: 0,
		navSize: 1,
		itemSize: size,
		scrollDuration: parseInt(con.scrollDuration, 10) || 500,
		quickSwitch: true,
		dir: conf.dir,
		containerId: wrap,
		data: data,
		autoScrollDirection: conf.dir == "ltr" ? "forward" : "backward",
		autoScroll: con.autoScroll === "1" ? true : false
	};
	var skinSlide = new cycletabs.NavUI();
	skinSlide.init(options);
	//项数不到一屏时，隐藏控制Handler
	if (data.length <= 1) {
		$(".ctrl, .switch", $glo).hide();
	}
}

var bottomBook = function() {
	initSlide(_con, arrayList, 179 * 5 + 4, ".btm-wrap", $glo);
	$glo.on("click", ".btm-logo", function() {
		UT.send({
			modId: "bottom-book",
			type: "click",
			position: "header",
			sort: "logo"
		});
	}).on("click", ".btm-tle-btn2 a", function() {
		UT.send({
			modId: "bottom-book",
			type: "click",
			position: "header",
			sort: "search"
		});
	}).on("click", ".btm-tle-btn1 a", function() {
		UT.send({
			modId: "bottom-book",
			type: "click",
			position: "header",
			sort: "check"
		});
	}).on("click", ".btm-btn", function() {
		UT.send({
			modId: "bottom-book",
			type: "click",
			position: "content",
			sort: "button"
		});
	}).on("click", ".next", function() {
		UT.send({
			modId: "bottom-book",
			type: "click",
			position: "control",
			sort: "next"
		});
	}).on("click", ".prev", function() {
		UT.send({
			modId: "bottom-book",
			type: "click",
			position: "control",
			sort: "prev"
		});
	}).on("click", ".btm-fram a", function() {
		UT.send({
			modId: "bottom-book",
			type: "click",
			position: "content",
			sort: "img"
		});
	});
};

module.exports = bottomBook;