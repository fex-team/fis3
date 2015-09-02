/*
* Weather
*/

var $ = require("common:widget/ui/jquery/jquery.js"),
	UT = require("common:widget/ui/ut/ut.js");
/**
 * NOTICE please, turn on this module you should:
 * 
 * 1. init function(fire before domReady and auguments[0] is the path of 
 * theme resource)
 * 
 * G.theme.init("/static/web/common/theme/");
 *
 * 2. add style:
 * .select_theme{display:block !important;}
 *
 * update: 20130320 | by WMF
 * 
 * 1. handle css loading before domReady
 * 2. base on jQuery 1.9.x
 */
window.G || (window.G = {});
G.theme = {
	init: function(themePath) {
		this.themeId = "themeLinkNodeRef";
		this.cookieName = "hao123themename";
		this.themePath = themePath || "./theme/";
		this.defaultThemeName = "1";
		this.themeName = $.cookie(this.cookieName);
		this.load();
		window.jQuery && $(function() {
			if(!$("#themeSelect")[0]) return;
		    /*$("#themeSelect").on("mouseenter", function(e) {
			    $(this).addClass("select_theme_hover")
			}).on("mouseleave", function(e) {
				$(this).removeClass("select_theme_hover")
			});*/

			$("#themeSelect li").on("click", function(event){
				var el = $(this)[0];
				UT.send({
					position: "changeStyle",
					type:"click",
					sort: $(this).attr("data-theme"),
					value: $(this).attr("data-theme"),
					modId:"theme"
				});

				el.tagName === "LI" && !$(this).hasClass("skin_cur") && G.theme.setTheme(el);
			});
			G.theme.initSelect();
		});
		return this;
	},
	
	load: function(themeName) {
		themeName = themeName || this.themeName;
		if(!themeName) return;
		var themeNodeRef = document.getElementById(this.themeId),
			// href = this.themePath + themeName + "/css/index.css";

			// supports fis
			href = {
				"1": __uri("./theme/1/css/index.css"),
				"2": __uri("./theme/2/css/index.css"),
				"3": __uri("./theme/3/css/index.css"),
				"4": __uri("./theme/3/css/index.css")
			}[themeName];

		if(themeNodeRef) {
			themeNodeRef.href = href;
		} else {
			// var ref = document.getElementsByTagName('script')[0],
			var ref = document.body || document.getElementsByTagName('script')[0],
				node = document.createElement("LINK");
			node.id = this.themeId;
			node.type = "text/css";
			node.rel = "stylesheet";
			node.href = href;
			ref.appendChild(node);
		}

		// add a Hook on <body>
		!function() {
			document.body
			? (document.body.className = document.body.className.replace(/body-theme_[^\s$]/g, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " ") + " body-theme_" + themeName)
			: setTimeout(arguments.callee, 64);
		}();
	},
	
	getName: function(el) {
		return el.getAttribute("data-theme");
	},
	
	initSelect: function() {
		var themeName = this.themeName || this.defaultThemeName,
			lis = document.getElementById("themeSelect").getElementsByTagName("LI"),
			l = lis.length,
			i = 0,
			li;
		for(; i<l; i++) {
			li = lis[i];
			if(li && this.getName(li) === themeName) {
				
				//save the curSelect ref
				this.curSelect = li;
				// addClass(li, "skin_cur");

				$(li).addClass("skin_cur")
				return;	
			}
		}
		return this;
	},
	
	setTheme: function(el) {
		var curSelect = this.curSelect,
			themeName = this.themeName = this.getName(el);
		// addClass(el, "skin_cur");
		$(el).addClass("skin_cur")
		// curSelect && removeClass(curSelect, "skin_cur");
		curSelect && $(curSelect).removeClass("skin_cur");
		this.curSelect = el;
		this.load(themeName);
		
		//save the cookie
		$.cookie(this.cookieName, themeName,{expires:2000});
		return this;
	}
}