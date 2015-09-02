var $ = require("common:widget/ui/jquery/jquery.js");
var UT = require("common:widget/ui/ut/ut.js");
var helper = require("common:widget/ui/helper/helper.js");
require("common:widget/ui/jquery/widget/jquery.ui.position/jquery.ui.position.js");
require("common:widget/ui/jquery/widget/jquery.ui.button/jquery.ui.button.js");
require("common:widget/ui/jquery/widget/jquery.ui.tip/jquery.ui.tip.js");
require("common:widget/ui/jquery/widget/jquery.ui.autocomplete/jquery.ui.autocomplete.js");
require("common:widget/ui/jquery/widget/jquery.ui.autocomplete.html/jquery.ui.autocomplete.html.js");
window.Gl || (window.Gl = {});
window.conf || (window.conf = {});

// Constructor
Gl.history = function () {
	var _conf = conf.history,
		hotsite = $("#hotsite"),
		history = $("#history"),
		historyBg = $("#historyBg"),
		historyList = history.children().eq(0),
		hotsiteTab = $("#hotsiteTab"),
		historyTab = $("#historyTab"),
		hotsiteNewTab = $("#hotsiteNewTab"),
		container = $("#hotsiteContainer"),
		blocks = $(".hist-block"),
		removeBtn = $(".hist-block_remove"),
		cookie = ($.cookie("FLASHID") || $.cookie("BAIDUID") || "").substr(0, 32),
		blockTpl = '<a href="#{u}" class="hist-block"><span class="hist-block_title">#{t}</span><span class="hist-block_remove"></span></a>',
		blockIcoTpl = '<a href="#{u}" class="hist-block hist-block_img"><span class="hist-block_title">#{t}</span><img src="#{ico}"><span class="hist-block_remove"></span></a>',
		lv2Icon = '<i class="hist-icon"></i>',
		isScollOver = true,	//whether the scroll animation is over
		isInit = false,		//whether the initial process is over
		dir = $("html").attr("dir"),
		icoList = {};
	_conf.eleWidth = container.width();

	var	scroll = function (el) {
			if (el === hotsite) {
				var next = history,
					myChildren = el.children(),
					hisChildren = next.children().children();
			} else {
				var next = hotsite,
					myChildren = el.children().children(),
					hisChildren = next.children();
			}


			// scroll animation
			if (isScollOver){
				isScollOver = false;
				container.width(_conf.eleWidth * 2);
				next.addClass("cur");
				if (dir === "rtl"){
					el.animate({marginRight: -_conf.eleWidth}, _conf.animeSpeed, function () {
						el.appendTo(el.parent()).css("margin-right", 0).removeClass("cur");
						container.width("auto");
						isScollOver = true;
					});
				} else {
					el.animate({marginLeft: -_conf.eleWidth}, _conf.animeSpeed, function () {
						el.appendTo(el.parent()).css("margin-left", 0).removeClass("cur");
						container.width("auto");
						isScollOver = true;
					});
				}
			}

			// Using css3 animation
			/*if (isScollOver) {
				// The scroll animation is not finished
				isScollOver = false;
				// Slide out this block
				myChildren.each(function () {
					var _this = $(this);
					setTimeout(function () {
						_this.addClass("left-out");
					}, Math.random() * 400);
				});
				// Slide in the next block
				setTimeout(function () {
					el.hide();
					// Fade in for the browsers which do not support css3 animation
					next.fadeIn(500);
					hisChildren.each(function () {
						var _this = $(this);
						_this.addClass("scroll-animate").removeClass("left-out");
						setTimeout(function () {
							_this.addClass("right-in");
						}, Math.random() * 400);
					});
				}, 1000);
				// The animation is over after 2s
				setTimeout(function () {
					// Clear css attribute to avoid style _conflicting
					hisChildren.removeClass("scroll-animate right-in");
					// The animation is finished
					isScollOver = true;
				}, 2000);
			}*/
		},

		// Create links blocks
		createEle = function (data) {
			var block,
				hrefReg = /https?:\/\/([^\/]+)\/?/i,
				hrefMatch = data.u.match( hrefReg );

			if( !hrefMatch ) return;
			// Build html structure
			if (data.ico) {
				block = $(helper.replaceTpl(blockIcoTpl, data));
			} else {
				block = $(helper.replaceTpl(blockTpl, data));
			}
			// Set the block's color, size and icon
			data.color && block.css({"background-color": data.color});
			data.big && block.addClass("hist-block_big");
			// Complete lv2 pages' url
			if (data.u.substr(0, 1) === "/" || ( hrefMatch && hrefMatch[1] === window.location.host)) {
				block.prepend(lv2Icon);
			}
			// The max quantity of the blocks is 10
			if (historyList.children().length <= conf.history.maxBlock) {
				historyList.append(block);
			}
		},

		// Get links
		get = function () {
			isInit && $.ajax({
				url:"/historyurl/get",
				data:{
					id: cookie
				},
				success:function(data){
					icoList = $.parseJSON(data).top;
					var data = $.parseJSON(data).data;
					data.length > 0 && historyBg.hide();
					$(".hist-block", history).remove();	// remove the blocks for refreshing
					for (var i = 0; i < data.length; i++) {
						createEle(data[i]);
					}
					/*// Play the animation when the data has been recieved
					history.children().children().each(function () {
						var _this = $(this);
						_this.addClass("scroll-animate").removeClass("left-out");
						setTimeout(function () {
							_this.addClass("right-in");
						}, Math.random() * 1400);
					});
					// Clear css3 style
					setTimeout(function () {
						history.children().children().removeClass("scroll-animate right-in");
					}, 2000);*/
				},
				type: "POST"
			});
		},

		// Add links
		add = function (el) {
			var href = el.attr("href"),
				el = el.clone(),
				title = "",
				color, ico,
				noMatch = true,
				hrefReg = /https?:\/\/([^\/]+)\/?/i;
			// Remove i tag from the a tag
			el.children("i").remove();
			title = $.trim(el.text());
			if (href.substr(0, 1) === "/") {
				href = window.location.protocol + '//' + window.location.host + href;
			}
			// add by chenliang,  return when the a tag is not a real link, example:href="javascript:;"
			if( !href.match( hrefReg ) ) return;

			if (isInit) {
				historyBg.hide();
				// Judge whether this element is exist in the list
				historyList.children("a").each(function () {
					if ($(this).attr("href") === href)
						noMatch = false;
				});
				// When there has no match element, get color and ico info from _conf
				if (noMatch) {
					if (icoList[title]) {
						color = icoList[title].color;
						ico = icoList[title].ico;
					}
					createEle({u: href, t: title, color: color, ico: ico});
				}
			}
			// $.ajax({ // 添加历史记录放到另一个独立的模块里
			// 	url:"/historyurl/add",
			// 	data:{
			// 		name: title,
			// 		url: href,
			// 		id: cookie
			// 	},
			// 	type: "POST"
			// });
		},

		// Remove links
		remove = function (el) {
			var href = el.attr("href"),
				title = $.trim($(".hist-block_title", el).text());
			if (href.substr(0, 1) === "/") {
				href = window.location.protocol + '//' + window.location.host + href;
			}
			el.remove();
			$.ajax({
				url:"/historyurl/del",
				data:{
					url: href,
					id: cookie,
					name: title
				},
				type: "POST"
			});
		},

		// Bind event
		bindEvent = function () {
			// Change the tabs and play scrolling animation
			hotsiteTab.on("click", function (e) {
				e.preventDefault();
				if(!$(this).hasClass("cur") && isScollOver) {
					historyTab.removeClass("cur");
					$(this).addClass("cur");
					scroll(history);
				}
				hotsiteNewTab.removeClass("cur");
			});
			historyTab.on("click", function (e) {
				e.preventDefault();
				UT.send({
					type: "click",
					position: "history",
					sort: "tab",
					modId:"historysites"
				});
				!isInit && init();
				if(!$(this).hasClass("cur") && isScollOver) {
					hotsiteTab.removeClass("cur");
					$(this).addClass("cur");
					scroll(hotsite);
				}
				hotsiteNewTab.removeClass("cur");
			});
			hotsiteNewTab.on("click", function (e) {
				e.preventDefault();
				UT.send({
					type: "click",
					position: "newtab",
					sort: "tab",
					modId:"hotsite-newtab"
				});
				if(!$(this).hasClass("cur")) {
					hotsiteTab.removeClass("cur");
					historyTab.removeClass("cur");
					$(this).addClass("cur");

				}
			});
			// Send add request when clicking on the children of the element which has "favsite-count" class name
			// $("a").live("click", function (e) {
			// 	$(this).closest(".favsite-count").length > 0 && !$(e.target).hasClass("hist-block_remove") && add($(this));
			// });
			blocks.live("click", function (e) {
				if($(e.target).hasClass("hist-block_remove")) {
					e.preventDefault();
					remove($(this));
				}

				UT.send({
					type: "click",
					position: "history",
					sort: "block",
					modId:"historysites"
				});
			});
			blocks.live("mouseenter", function () {
				$(".hist-block_remove", $(this)).show();
			});
			blocks.live("mouseleave", function () {
				$(".hist-block_remove", $(this)).hide();
			});
			removeBtn.live("mouseenter", function () {
				$(this).addClass("hist-block_remove_hover");
			});
			removeBtn.live("mouseleave", function () {
				$(this).removeClass("hist-block_remove_hover");
			});
		},

		// Initial history module
		init = function () {
			isInit = true;
			get();
			// bindEvent();
		};
	return {
		bindEvent: bindEvent,
		add: add,
		get: get
	};
}();
