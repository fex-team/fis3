/*
*	User Bar Buttons
*	V2.0.0
*/

var $ = require("common:widget/ui/jquery/jquery.js");
require("common:widget/ui/jquery/widget/jquery.sethome/jquery.sethome.js");
require("common:widget/ui/jquery/widget/jquery.addfav/jquery.addfav.js");

var isFirefox = /firefox/.test(navigator.userAgent.toLowerCase()),
    _FfCon    = conf.setHomeOnFf,
    isShowFf  = (isFirefox && _FfCon && (_FfCon.isHidden === "0")),
    setFfHome = null,
    isRended  = false;

if (isShowFf) {
    require.async("common:widget/ui/sethome-ff/sethome-ff-c.js", function(init) {
        setFfHome = init;
        _FfCon.num = 2;
    });
}

//userbar buttons
Gl.userbarBtn = function () {
	var wrap = $("#userbarBtnOld"),
	setHomeBtn = $("#setHome"),
	addFavBtn = $("#addFav"),
	buttons = wrap.children("a"),
	_conf = conf.userbarBtn,
	// cur = type === "index" ? $("#setHome") : $("#addFav"),
	cur = buttons.eq(-1),
	iconWidth = $("i", cur).width(),


	// closeWidth = cur[0].clientWidth - $("span", cur)[0].offsetWidth - iconWidth,
	closeWidth = buttons.eq(0).width(),
	maxWidth = parseInt(conf.userbarBtn.maxSpanWidth) + iconWidth + 3,//normal width, add 3px to fix blank issue in IE6

    matchTagName = function(el, tagName) {
        el = el.parentNode.tagName === tagName ? el.parentNode : el;
        return el.tagName === tagName ? el : null;
    },

    fold = function(el) {
        if(!el || el.clientWidth - $("i", cur)[0].offsetWidth > closeWidth) return;
        el = $(el);
        cur.width(closeWidth);
        //reset to normal width, add 3px to fix blank issue in IE6
        if(conf.userbarBtn.maxSpanWidth){
        	el.width(maxWidth);
        }else{
        	el.width($("span", el)[0].offsetWidth + iconWidth + 3);
        }        
        
        cur = el;
    };
	
	buttons.on("mouseenter", function (e) {		
		fold(matchTagName(this, "A"));						
	});

	buttons.on("mousedown", function () {
		$(this).addClass("userbar-btn_click");
	});

	buttons.on("mouseup", function () {
		$(this).removeClass("userbar-btn_click");
	});

	buttons.on("mouseout", function () {
		$(this).removeClass("userbar-btn_click");
	});

	setHomeBtn.on("click", function (e) {
		if (isShowFf && setFfHome) {
			if (isRended) {

			} else {
				setFfHome.init(wrap, _FfCon);
				isRended = true;
			}
			setFfHome.toggle({});
			e.stopPropagation();
		} else {
			$(this).sethome();
		}
	});

	addFavBtn.on("click", function () {
		$(this).addfav(_conf.addFavText, window.location.href)
	});

	$(window).load(function() {
        if (isShowFf && setFfHome && !isRended) {
            setFfHome.init(wrap, _FfCon);
            isRended = true;
        }
    });

	if(conf.userbarBtn.maxSpanWidth){
		cur.width(maxWidth);
	} else {
		cur.width("auto");
	}
}