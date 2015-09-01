// Sethome & AddFav functional top bar
var $ = require("common:widget/ui/jquery/jquery.js");
var UT = require("common:widget/ui/ut/ut.js");
require("common:widget/ui/jquery/widget/jquery.sethome/jquery.sethome.js");
require("common:widget/ui/jquery/widget/jquery.addfav/jquery.addfav.js");

window.Gl || (window.Gl = {});

Gl.addFavBar = function (pageType) {
	if (!conf.addFavBar) return;

	var ua = navigator.userAgent,
		_conf = conf.addFavBar,
		container = $('#addFavBar'),

		browser = /MSIE/.test(ua) ? "ie" : /Firefox/.test(ua) ?
				  "firefox" : /Chrome/.test(ua) ?
				  "chrome" : "other",

		type = browser === "ie" ? _conf.ieType : browser === "firefox" ?
			   _conf.ffType : browser === "chrome" ?
			   _conf.chType : _conf.otherType,

		init = function () {

			//当PM将showbarTime从非0改为0时，重置cookie。需要排除为空的情况
			if(parseInt(_conf.showbarTime) === 0){
				$.cookie("Gh_b", 0);
			}

			// 原有cookie清空，原来的值不再使用，可能出现以前cookie失效，时间短，忽略
			$.cookie("hidebar", null);

			//cookie中存的都是字符串，!("0") == false,所以需要转换为数字
			!parseInt($.cookie("Gh_b")) && type && setBar();
		},

		// Set the bar's behavior in different browser for current page 
		setBar = function () {
			if (_conf.hideBar) return;

			if( type === "addFav" ){
				if( browser === "ie" ){
					creatElement("addFav", _conf.addFav);
				}else{
					creatElement("addFav", _conf.addFavNoSupport);
					$("#addFavBtn").hide();
				}
			}else{
				creatElement(type || "download", _conf[type] || _conf.download);
			}
		},

		// Create DOM element
		creatElement = function (type, config) {
			var inner = '<div class="bar-addfav_inner l-wrap"><i class="bar-addfav_icon icon-' + type + '"></i><span class="bar-addfav_title">' + config.title + '</span><span class="bar-addfav_text">' + config.text + '</span><a href="javascript:void(0)" class="bar-addfav_btn" id="' + type + 'Btn" data-sort="topbar" data-val="button" hidefocus="true">' + config.button + '</a><a href="javascript:void(0)" class="bar-addfav_close" id="addFavClose" data-sort="topbar" data-val="close" hidefocus="true"></a></div>';
			container.append(inner);
			// $("body").prepend(container);
			bindEvent(type);
			/MSIE 6.0/.test(ua) && container.show();
			container.slideDown(_conf.slideSpeed);
		},

		// Bind event
		bindEvent = function (type) {
			var setHomeBtn = $("#setHomeBtn"),
				addFavBtn = $("#addFavBtn"),
				downloadBtn = $("#downloadBtn"),
				close = $("#addFavClose");
			setHomeBtn.on("click", function (e) {
				e.preventDefault();
				$(this).sethome();
				hideBar();
			});
			addFavBtn.on("click", function (e) {
				e.preventDefault();
				$().addfav(conf.userbarBtn.addFavText);
				hideBar();
			});
			downloadBtn.on("click", function (e) {
				e.preventDefault();
				window.open(_conf.download.url, "_blank");
				hideBar();
			});
			close.on("click", function (e) {
				e.preventDefault();
				hideBar();
				$("#kbd").length && $("#kbd").animate({top:"130px"},_conf.slideSpeed);
			});
			type === "addFav" && $(document).on("keydown", function (e) {
				if(/Macintosh/.test(ua)) {
					(e.metaKey && e.keyCode === 68) && hideBar();
				} else {
					(e.ctrlKey && e.keyCode === 68) && hideBar();
				}
			});

			container.on("click", "a", function() {
			    UT.send({
				    position: conf.pageType,
				    sort: $(this).attr("data-val"),
				    type: "click",
				    modId: "sethp-bar"
			    });
			});
		},

		// Hide the bar and set cookie
		hideBar = function () {
			var time = _conf.showbarTime === "0" ? 0 : _conf.showbarTime ? parseInt(_conf.showbarTime) : 1;

			/MSIE 6.0/.test(ua) && container.hide();
			container.slideUp(_conf.slideSpeed);
			$.cookie("Gh_b", 1, {expires: time});
		};

	$(document).ready(function () {
		init();
	});
};