var $ = require("common:widget/ui/jquery/jquery.js");
var UT = require("common:widget/ui/ut/ut.js");
var helper = require("common:widget/ui/helper/helper.js");
require("common:widget/ui/jquery/widget/jquery.ui.position/jquery.ui.position.js");
require("common:widget/ui/jquery/widget/jquery.ui.button/jquery.ui.button.js");
require("common:widget/ui/jquery/widget/jquery.ui.tip/jquery.ui.tip.js");
require("common:widget/ui/jquery/widget/jquery.ui.autocomplete/jquery.ui.autocomplete.js");
require("common:widget/ui/jquery/widget/jquery.ui.autocomplete.html/jquery.ui.autocomplete.html.js");
window.Gl || (window.Gl = {});

// Constructor
Gl.history = function () {
	var _conf = conf.sidebarHistory,
		history = $("#" + _conf.id),
		historyBg = history.find(".sidebar-hotsite-hist_bg"),
		historyList = history.find(".sidebar-hotsite-content"),
		blocks = $(".sidebar-hist-block"),
		removeBtn = $(".sidebar-hist-block_remove"),
		cookie = ($.cookie("FLASHID") || $.cookie("BAIDUID") || "").substr(0, 32),
		blockTpl = '<a href="#{u}" class="sidebar-hist-block"><span class="sidebar-hist-block_title">#{t}</span><span class="sidebar-hist-block_remove"></span></a>',
		blockIcoTpl = '<a href="#{u}" class="sidebar-hist-block sidebar-hist-block_img"><span class="sidebar-hist-block_title">#{t}</span><img src="#{ico}"><span class="sidebar-hist-block_remove"></span></a>',
		lv2Icon = '<i class="sidebar-hist-icon"></i>',
		isInit = false,		//whether the initial process is over
		dir = $("html").attr("dir"),
		icoList = {},

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
			data.big && block.addClass("sidebar-hist-block_big");
			// Complete lv2 pages' url
			if (data.u.substr(0, 1) === "/" || ( hrefMatch && hrefMatch[1] === window.location.host)) {
				block.prepend(lv2Icon);
			}
			// The max quantity of the blocks is 10
			if (historyList.children().length <= _conf.maxBlock) {
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
					$(".sidebar-hist-block", history).remove();	// remove the blocks for refreshing
					for (var i = 0; i < data.length; i++) {
						createEle(data[i]);
					}
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
			// $.ajax({
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
				title = $.trim($(".sidebar-hist-block_title", el).text());
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

			// 放于history-add模块中，防止本脚本没加载时无法添加历史记录
			// // Send add request when clicking on the children of the element which has "favsite-count" class name
			// $(document.body).on("click", "a", function (e) {
			// 	$(this).closest(".favsite-count").length > 0 && !$(e.target).hasClass("sidebar-hist-block_remove") && add($(this));
			// });
			history.on("click", ".sidebar-hist-block", function (e) {
				if($(e.target).hasClass("sidebar-hist-block_remove")) {
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
		},

		// Initial history module
		init = function () {
			isInit = true;
			get();
			bindEvent();
		};
	return {
		init: init,
		add: add,
		get: get
	};
}();

module.exports = Gl.history;