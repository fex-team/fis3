var $ = require("common:widget/ui/jquery/jquery.js");
var UT = require("common:widget/ui/ut/ut.js");

var CON        = conf.headerTest,
    direct     = (conf.dir == "ltr" ? "left" : "right"),
    headerTop  = $("#top"),
    parentHead = headerTop.parent(),
    favBar     = $("#addFavBar"),
    isScrolled = false,
    fixedClass = "header-fixed" + (CON.ceilingMore === "1" ? " header-fixed-up" : ""),
    initHeight = headerTop.outerHeight(),
    //placeHoldr = "<div class='header-test-holder' style='display: none;height: "+initHeight+"px;'></div>",
    docBody    = $(document.body),
    curHeight  = 0;

$(".userbar-logoSibling", headerTop).find(".userbar_split").first().css("float", direct);
$(".userbar-tool", headerTop).find(".userbar_split").last().remove(); // 移除多余的分隔条

$(".box-search").eq(0).parent().css("position", "relative");//用于设首等定位
$("#userbarBtn").css("display", "block");


if (/(png|gif|jpg|jpeg)/i.test(CON.settingTip)) {
	$("#settingBtn").html("<img src='" + CON.settingTip + "' />");
} else {
	$("#settingBtn").addClass("settings-btn_word").html(CON.settingTip);
}


$(function() {
	var setBtn  = $("#settingBtn"),
	    setDrop = $("#settingDropdown"),
	    $window = $(window),
	    weather = $("#weather");

	if (CON.dateWidth !== "") {
		$("#dateBox").width(CON.dateWidth);
	}
	if(CON.weatherWidth !== "") {
		weather.children(".fl").width(CON.weatherWidth);
	}

	setBtn.wrap('<div class="setting-btn-wrap" />');
	setDrop.prepend('<div class="settings-arrow"><div class="settings-arrow_bg"></div></div>');
	//if (parentHead.is("body")) {
		//$(placeHoldr).insertAfter(headerTop);
	//}
	
	headerTop.find(".settings").hover(function() {
		setBtn.parent().addClass("module-mask");
		setDrop.show();
	}, function() {
		setBtn.parent().removeClass("module-mask");
		setDrop.hide();
	});
	
	setTimeout(function() {
		headerTop.find(".userbar_split").css("visibility", "visible");
		setBtn.off("click.old");
		setBtn.on('click', function(e) {
			e.preventDefault();
		});
	}, 1500);
	/*
	$("#themeSelect").on("click", "li", function(e) {
		var themeId = $(this).attr("data-theme");
		if (Gl.weather && Gl.weather.refreshIcon) {
			setTimeout(function() {
				Gl.weather.refreshIcon(themeId);
			}, 20);
		}
	});*/
	$("#siteList").on("mousedown", "a", function(e) {
		UT.send({
			position: "siteSwitch",
			sort: $(this).attr("href"),
			type: "click",
			modId: "country"
		});
	});
	/*$("#userbarBtn").on("click", "a", function(e) {
		UT.send({
			position: "sethp-btn",
			sort: $(this).attr("id").replace(/02/, ""),
			type: "click",
			modId: "sethp-btn"
		});
	});*/
	weather.on("click", function(e) {
		var $tar = $(e.target);
		if ($tar.closest("a").length > 0) {
			UT.send({
				position: "click",
				sort: "click",
				type: "click",
				modId: "weather"
			});
		} else if ($tar.closest("#weatherView").length > 0) {
			UT.send({
				position: "click",
				ac: "b",
				sort: "click",
				type: "click",
				modId: "weather"
			});
		}
	});
/*	$("#dateBox").on("click", "a", function(e) {
		UT.send({
			position: "click",
			sort: "click",
			type: "click",
			modId: "date"
		});
	});*/
	$(".settings, .account_wrap, .app-wrapper, .skinbox-wrap").on("mouseenter", function() {
		$(this).prev(".userbar_split").css("visibility", "hidden");
		$(this).next(".userbar_split").css("visibility", "hidden");
	}).on("mouseleave", function() {
		$(this).prev(".userbar_split").css("visibility", "visible");
		$(this).next(".userbar_split").css("visibility", "visible");
	});
	//吸顶
	if (CON.isCeiling === "1") {
		$window.on("scroll", function() {
			isScrolled = true;
		});

		window.setTimeout(function() {
			if (isScrolled) {
				isScrolled = false;
				curHeight = initHeight + ((favBar.css("display") === "none") ? 0 : favBar.outerHeight());
				if ($(document).scrollTop() > curHeight) {
					if (!docBody.hasClass(fixedClass)) {
						//parentHead.is("body") || parentHead.height(curHeight);
						headerTop.css("position", "fixed");
						docBody.addClass(fixedClass);
						if(CON.ceilingMore === "1") {
							$window.trigger("headerFixed.transTo");
						}
					}
				} else {
					if (docBody.hasClass(fixedClass)) {
						//parentHead.is("body") || parentHead.height("auto");
						headerTop.css("position", "relative");
						docBody.removeClass(fixedClass);
						if(CON.ceilingMore === "1") {
							$window.trigger("headerFixed.restore");
						}
					}
				}
			}
			window.setTimeout(arguments.callee, 250);
		}, 250);
	}
});