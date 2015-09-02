var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');

// for the title's effects of sort sites area
!function(){
	//($(".tab-lists").css("height")=="120px") && $(".tab-lists li").css("width","33%");
	!$.cookie("sortsiteBubble") && $(".bubble-like").show();
}();
$(".sortsite dt").on({
	mouseenter: function () {
    	$(this).addClass("hover");
	},
	mouseleave: function () {
	    $(this).removeClass("hover");
	    $(this).removeClass("click");
	},
	mousedown: function () {
	    $(this).addClass("click");
	},
	mouseup: function () {
	    $(this).removeClass("click");
	}
});

//icon click log
$(".box-onesort-big .i-sort-big").on("click", function(){
	var logIndex = $(this).prev("dl").attr("log-index");
	UT.send({
		position: "links",
		sort: "icon",
		ac: "b",
		url: location.href,
		modId: "sortsites",
		modIndex: logIndex
	});
});
//tab换组，循环关系
$(".sortsites-tabs-refresh").click(function(e){
	e.preventDefault();
	var tabList = $(this).parent().find(".tab-lists"),
		listLength = -parseInt(tabList.css("height"),10),
		top = parseInt(tabList.css("top"),10)-30;
	UT.send({
		position: "sortsitesTabRefresh",
		modId: "sortsites",
		type: "click"
	});		
	top = (top == listLength)?0:top;	
	!tabList.is(":animated") && tabList.animate({"top":top+"px"});
	
});
//根据itemIndex来确定需要跳转的分类区
$(".tab-item").click(function(e){
	e.preventDefault();
	var index = +$(this).attr("item-index"),
		itemIndex = (parseInt((index+1)/2,10)-1)*260+420,
		win = window;
	UT.send({
		position: "sortsitesTabItem",
		modId: "sortsites",
		type: "click",
		modIndex: index
	});	
	$(win).scrollTop(itemIndex);
	$(".sortsite").removeClass("select").eq(index-1).addClass("select");
});
$(".bubble-like i").on({
	mouseenter: function () {
    	$(this).addClass("i-hover");
	},
	mouseleave: function () {
	    $(this).removeClass("i-hover");
	},
	click:function(){
		$(this).parent().hide();
		$.cookie("sortsiteBubble",1, {expires: 2000});
	}
});