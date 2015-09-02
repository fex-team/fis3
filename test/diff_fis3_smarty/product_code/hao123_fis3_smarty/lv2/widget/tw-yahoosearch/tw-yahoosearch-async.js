var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var helper = require("common:widget/ui/helper/helper.js");
require('common:widget/ui/jquery/jquery.cookie.js');

var $tabList = $("#tabList"),
	$form1 = $("#searchForm"),
	$form2 = $("#searchForm2"),
	$input1 = $("#searchInput"),
	$input2 = $("#searchInput2");

var initP = $.trim((helper.getQuery()["p"] || "").replace(/\+/g, " "));

// decodeURIComponent("%") ==> error, from yuji
try {
	initP = decodeURIComponent(initP);
} catch (e) {}


$input2.val(initP);
$input1.val(initP).focus();

if (YHS) {
	YHS.init({
		yahoo_domain: "https://tw.search.yahoo.com", // replace this path value
		iframe_id: "content", // replace this with label of the iFrame
		debug: false // set to true only for debugging in test environments
	});

	YHS.events.on("pageNavigated", "navigat", function(d) {
		UT.send({
			modId: "se-yhs",
			type: "click",
			position: "pageNavigate",
			sort: d.b
		});
	});
	// kengdie, cannot use
	/*YHS.events.on("queryChanged", "qChange", function(d) {
		console.log(d);
	});*/
	/*YHS.events.on("fireBeacon", "fireBeaconHandler", function(e) {
		console.log(e);
	});*/
    YHS.events.on("queryChanged", "Baidu::Search.queryChange", function(event) {
        var query = $.trim(event.query || "");
        $input2.val(query);
        $input1.val(query);
        UT.send({
			modId: "se-yhs",
			type: "click",
			position: "queryChanged",
			sort: query
		});
    });
}

/*bind UT*/
$tabList.on("click", "a", function(e) {
	var $that = $(this),
		href = $that.attr("hrf");
	if (href === "/") {

	} else {
		UT.send({
			modId: "se-yhs",
			type: "click",
			position: "tabs",
			sort: $that.attr("typ")
		});
		$that.attr("href", href + encodeURIComponent($.trim($input1.val())));
	}
});
$form1.on("submit", function() {
	$input1.val($.trim($input1.val())); 
	/*UT.send({
		modId: "se-yhs",
		type: "click",
		position: "form",
		sort: 'top'
	});*/
	$.cookie.set("yaho2Top", (parseInt($.cookie.get("yaho2Top"), 10) || 0) + 1, {
		expires: 10
	});
});
$form2.on("submit", function() {
	$input2.val($.trim($input2.val())); 
	/*UT.send({
		modId: "se-yhs",
		type: "click",
		position: "form",
		sort: 'bottom'
	});*/
	$.cookie.set("yaho2Btm", (parseInt($.cookie.get("yaho2Btm"), 10) || 0) + 1, {
		expires: 10
	});
});
$(".se-head").on("click", ".lg-hao, .lg-yaho", function() {
	UT.send({
		modId: "se-yhs",
		type: "click",
		position: "logo",
		sort: $(this).attr("href")
	});
});


/***send click sug ut**/
var sendUT = function(srt) {
	UT.send({
		modId: "se-yhs",
		type: "click",
		position: "form",
		sort: srt
	});
};
var sugTimes = parseInt($.cookie.get("yaho2Sug"), 10) || 0,
    topTimes = parseInt($.cookie.get("yaho2Top"), 10) || 0,
    btmTimes = parseInt($.cookie.get("yaho2Btm"), 10) || 0;

setTimeout(function() {
	for (var i = sugTimes; i > 0; i--) {
		sendUT('sug'); // 如果此时拦截请求，就会出错，忽略小概率事件
	}
	for (var j = topTimes; j > 0; j--) {
		sendUT('top'); // 如果此时拦截请求，就会出错，忽略小概率事件
	}
	for (var k = btmTimes; k > 0; k--) {
		sendUT('bottom'); // 如果此时拦截请求，就会出错，忽略小概率事件
	}
	$.cookie.set("yaho2Sug", null, {
		expires: -1
	});
	$.cookie.set("yaho2Top", null, {
		expires: -1
	});
	$.cookie.set("yaho2Btm", null, {
		expires: -1
	});
}, 0);


/*****sug init*****/
var defaultData = {
	autoCompleteData: false,
	requestQuery: "command",
	url: "http://sugg.tw.search.yahoo.net/gossip-tw/",
	callbackFn: "fxsearch",
	callbackDataKey: 1,
	requestParas: {
		"output": "fxjsonp"
	}
};
require.async("lv2:widget/ui/suggest/suggest.js", function() {
	sug = Gl.suggest($input1[0], {
		classNameWrap: "sug-search",
		classNameQuery: "sug-query",
		classNameSelect: "sug-select",
		//classNameClose: "sug-close",
		delay: 200,
		n: 10,
		autoFocus: false,
		requestQuery: defaultData.requestQuery,
		requestParas: defaultData.requestParas,
		url: defaultData.url,
		callbackFn: defaultData.callbackFn,
		callbackDataKey: defaultData.callbackDataKey,
		onMouseSelect: function() {
			$.cookie.set("yaho2Sug", (parseInt($.cookie.get("yaho2Sug"), 10) || 0) + 1, {
				expires: 10
			});
			//$form1[0].submit();
		},
		templ: defaultData.templ
	});
});