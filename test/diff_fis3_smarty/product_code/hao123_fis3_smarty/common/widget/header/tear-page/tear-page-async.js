//requirement
var $ = require("common:widget/ui/jquery/jquery.js");
var helper = require("common:widget/ui/helper/helper.js");
var DateUI = require("common:widget/ui/date/date.js");
var UT = require("common:widget/ui/ut/ut.js");

window.Gl || (window.Gl = {});
$(function(){
	var lastCloseDay = $.cookie("Gh_t");
	var currentDay = DateUI.format("dd");
	var modId = "tearpage";
	var isCompleteHover;
	//展现策略
	if(currentDay != lastCloseDay){
		var container = $(".tear-page");
		var content = $(".tear-page textarea").text();
		container.html(content);
		var closeBtn = $(".i-tear-page-close");
		var backImg = $(".tear-page img");
		Gl.tearPage || (Gl.tearPage = {});
		//使用皮肤
		if (conf.tearPage.useSkin) {
			var divWidth = conf.tearPage.clickWidth || 0;
			var divHeight = conf.tearPage.clickHeight || 0;
			var lazyTime = conf.tearPage.timeout || 1000;
			var skinMod = conf.tearPage.modId || "skin";
			var parentSelector = conf.tearPage.parentSelector || "div[alog-alias=p-1]";
			var body = $(document.body);
			var mainWidth = 960;
			var windowWidth = $(window).width();
			var margin = (windowWidth - mainWidth)/2;
			if(windowWidth <= mainWidth){
				margin = 0;
				divWidth = 0;
			}else if(divWidth > margin){
				divWidth = margin;
			}
			var firstLeft = margin - divWidth;
			var secondeLeft = firstLeft + mainWidth + divWidth;
			var bodyBgContent = "<div class='body_bg' id='bodyBg'></div>"
							+	"<div class='bg-content-clickable' style='left:#{firstLeft}px;width:#{divWidth}px;height:#{divHeight}px;'></div>"
							+	"<div class='bg-content-clickable' style='left:#{secondeLeft}px;width:#{divWidth}px;height:#{divHeight}px;'></div>";
			bodyBgContent = helper.replaceTpl(bodyBgContent, {
				firstLeft: firstLeft,
				secondeLeft: secondeLeft,
				divWidth: divWidth,
				divHeight: divHeight
			});
			//皮肤可点击
			if (conf.tearPage.landingpage) {
				$(window).on("resize", function(){
					divWidth = conf.tearPage.clickWidth || 0;
					windowWidth = $(window).width();
					margin = (windowWidth - mainWidth)/2;
					if(windowWidth <= mainWidth){
						margin = 0;
						divWidth = 0;
					}else if(divWidth > margin){
						divWidth = margin;
					}
					firstLeft = margin - divWidth;
					secondeLeft = firstLeft + mainWidth + divWidth;
					$(".bg-content-clickable").eq(0).css({
						width: divWidth,
						left: firstLeft
					}).end().eq(1).css({
						width: divWidth,
						left: secondeLeft
					});
				});
				$(document).on("click", ".bg-content-clickable", function(){
					UT.send({
						"type": "click",
						"position": "bgimage",
						"modId": skinMod
					});
					window.open(conf.tearPage.landingpage);
				});
			}
			Gl.tearPage.hasBg = conf.tearPage.hasBg;  // 背景图是否存在
			Gl.tearPage.makeBg = function() { // 生成背景图
				$(parentSelector).append(bodyBgContent);
				$("#bodyBg").css("background-image", "url(" + conf.tearPage.bgImg + ")");
				body.addClass("have-skin");
			};
			var setTearBg = setTimeout(function() {
				if((Gl.tearPage.hasBg === '1' && $.cookie("Gh_so") === null) || $.cookie("Gh_so") === "1") {
					Gl.tearPage.makeBg();
				}
			}, lazyTime);
			//点击换肤按钮
			$("#tearBtn").on("click", function(e) {
				if(setTearBg) {
					clearTimeout(setTearBg);
					setTearBg = 0;
				}
				if($("#bodyBg").length === 0) {
					Gl.tearPage.makeBg();
				}
				if((Gl.tearPage.hasBg === '1' && $.cookie("Gh_so") === null) || $.cookie("Gh_so") === "1") {
					$("#bodyBg, .bg-content-clickable").hide();
					backImg.attr("src", backImg.attr("data-open-src"));
					Gl.tearPage.hasBg = '0';
					$.cookie("Gh_so", "0");
					UT.send({
						"type": "click",
						"position": "button",
						"sort": "close",
						"modId": skinMod
					});
					body.removeClass("have-skin");
				} else {
					$("#bodyBg, .bg-content-clickable").show();
					backImg.attr("src", backImg.attr("data-restore-src"));
					Gl.tearPage.hasBg = '1';
					$.cookie("Gh_so", "1");
					UT.send({
						"type": "click",
						"position": "button",
						"sort": "open",
						"modId": skinMod
					});
					body.addClass("have-skin");
				}
				e.preventDefault();
				e.stopPropagation();
			});
		};

		//hover效果切换
		container.removeClass("hide").hover(function(){
			isCompleteHover = 0;
			backImg.attr("src", backImg.attr("data-open-src"));

			// 巴西音乐节
			if((Gl.tearPage.hasBg === '1' && $.cookie("Gh_so") === null) || $.cookie("Gh_so") === "1") {
				backImg.attr("src", backImg.attr("data-restore-src"));
			}else{
				backImg.attr("src", backImg.attr("data-open-src"));
			}

			container.clearQueue().animate({
				width: (conf.tearPage.width || '200') + 'px'
			}, {
				duration: 500,
				always: function(){
					closeBtn.removeClass("hide");
					$("#tearBtn").show();// 巴西音乐节
				}
			});
		}, function(){
			isCompleteHover = 1;
			closeBtn.addClass("hide");
			container.clearQueue().animate({
				width: "52px"
			}, {
				duration: 500,
				always: function(){
					if(isCompleteHover){
						backImg.attr("src", backImg.attr("data-close-src"));
						$("#tearBtn").hide();// 巴西音乐节
					}
				}
			});
		}).click(function(e){//如果有passQueryParam，则点击链接要带上这个参数
			var url = $(this).attr("href"),
				paramKey = conf.tearPage.passQueryParam.trim();
			url = helper.appendQueryToUrl(url, paramKey);
			UT.send({
				"position": "banner",
				"modId": modId
			 });
			window.open(url);
			e.preventDefault();
		});
		//关闭按钮点击响应（关闭仅对当天有效）
		closeBtn.on("click", function(e){
			container.addClass("hide");
			$.cookie("Gh_t", currentDay, {expires: 1});
			UT.send({
				"position": "button",
				"modId": modId
			});
			e.preventDefault();
			e.stopPropagation();
		});
	}
});
