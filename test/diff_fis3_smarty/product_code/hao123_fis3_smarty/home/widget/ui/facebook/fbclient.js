var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var FBClient = {};
var TPL_CONF = require('home:widget/ui/facebook/fbclient-tpl.js');
/**
 * Fackbook module init function
 * @return {object} [description]
 */

var WIN = window,
	DOC = document,
	conf = WIN.conf.FBClient,
	undef;
var UI_CONF = {
// ui el
	uiMod: "#fbMod"
	, uiBtnLogin: ".fb-mod_login_btn"
	, uiBtnLogout: ".fb-mod_logout"
	, uiBtnRefresh: ".fb-mod_refresh"
	, uiSide: ".fb-mod_side"
	, uiBtnClose: ".fb-mod_close"
	, uiWrap: ".fb-mod_wrap"
	, uiList: ".fb-mod_list"
	, uiUsrinfo: ".fb-mod_usrinfo"
	, uiAvatar: ".fb-mod_avatar"
	, uiTextareaSubmit: ".fb-mod_submit"
	, uiBtnSubmit: ".fb-mod_submit_btn"
	, uiBody: ".fb-mod_body"
	, uiTip: ".fb-mod_tip"
	, uiSideHome: ".fb-mod_side_home"
	, uiSideFriend: ".fb-mod_side_friend em"
	, uiSideMessages: ".fb-mod_side_messages em"
	, uiSideNotifications: ".fb-mod_side_notifications em"
	, uiBodyLoader: ".fb-mod_body_loader"
};



FBClient.init = function() {

    // DOC.body.innerHTML += '<div id="fb-root"></div>';
    
    var that = this,
        $this = $(UI_CONF.uiMod);

    /*
    ui controller
     */
    that.ui = {
        uiMod: $this
        , side: $this.find(UI_CONF.uiSide)
        , btnLogin: $this.find(UI_CONF.uiBtnLogin)
        , btnLogout: $this.find(UI_CONF.uiBtnLogout)
        , btnClose: $this.find(UI_CONF.uiBtnClose)
        , btnRefresh: $this.find(UI_CONF.uiBtnRefresh)
        , wrap: $this.find(UI_CONF.uiWrap)
        , list: $this.find(UI_CONF.uiList)
        , usrinfo: $this.find(UI_CONF.uiUsrinfo)
        , avatar: $this.find(UI_CONF.uiAvatar)
        , textareaSubmit: $this.find(UI_CONF.uiTextareaSubmit)
        , btnSubmit: $this.find(UI_CONF.uiBtnSubmit)
        , body: $this.find(UI_CONF.uiBody)
        , tip: $this.find(UI_CONF.uiTip)
        , sideHome: $this.find(UI_CONF.uiSideHome)
        , sideFriend: $this.find(UI_CONF.uiSideFriend)
        , sideNotifications: $this.find(UI_CONF.uiSideNotifications)
        , sideMessages: $this.find(UI_CONF.uiSideMessages)
        , bodyLoader: $this.find(UI_CONF.uiBodyLoader)

        , panelHome: $this.find(".fb-mod_c")
        , panelFriend: $('<div class="fb-mod_c fb-mod_c_friend" style="display:none"><div class="fb-mod_c_loading"><div class="fb-mod_loader"></div></div></div>')
        , panelNotifications: $('<div class="fb-mod_c fb-mod_c_notifications" style="display:none"><div class="fb-mod_c_loading"><div class="fb-mod_loader"></div></div></div>')
        , panelMessages: $('<div class="fb-mod_c fb-mod_c_messages" style="display:none"><div class="fb-mod_c_loading"><div class="fb-mod_loader"></div></div></div>')
        , bubble: $('<div class="fb-mod_bubble">' + (conf.tplBubble || "NEW") + '</div>')


        , placeholder: function(first, last) {
            return $(TPL_CONF.tplPlaceholder.replaceTpl({first: first,
                last: last
            }))
        }
    };

    // live loader
    that.ui.liveLoader = that.ui.bodyLoader.clone(!0)
    .css({"width": "370px"})
    .insertBefore(that.ui.list).hide();

    $("body").append('<div id="fb-root" class=" fb_reset"></div>');

    that.ui.wrap.append(that.ui.panelFriend).append(that.ui.panelNotifications).append(that.ui.panelMessages);


    // window.ActiveXObject && !window.XMLHttpRequest && 
    $("body").append(that.ui.fakeBox = $(that.ui.textareaSubmit[0].cloneNode(false)).css({
        "position": "absolute"
        , "top" : "0"
        , "left": "0"
        , "right": "-10000px"
        , "visibility": "hidden"
        , "padding-top": "0"
        , "padding-bottom": "0"
        , "height": "18"    //for fixed
        , "width": that.ui.textareaSubmit.width()
    }));

    that.supportAnimate = function(style, name) {
        return 't' + name in style
        || 'webkitT' + name in style
        || 'MozT' + name in style
        || 'OT' + name in style;
    }((new Image).style, "ransition");

    /*
    status controller
    0 ==> none
    1 ==> doing
    2 ==> done
     */
    that.status = {
        login: 0
        , fold: 0
        , sdkLoaded: 0
        , scrollLoaded: 0
        , insertLoaded: 0
        , fixed: 0
        , eventBinded: 0

        , bubble: 0
    };

    // bubble
    !$.cookie("fb_bubble") && (that.status.bubble = 1, that.ui.uiMod.append(that.ui.bubble));

    /*
    post status cache
     */
    that.cache = {
        prePost: null
        , nextPost: null
        , refreshPost: null
        , noOldPost: 0
        , myPost: 0
        , stayTip: ""
        , userID: null
        , userName: ""

        , panel: that.ui.panelHome
        , curSideType: ""
        , panelRendered: 0
    };

    that.ui.btnClose.mousedown(function(e) {
        UT && UT.send({"type": "click", "position": "fb", "sort": that.status.fold === 0 ? "pull" : "fold","modId":"fb-box"});
        that.foldHandle.call(that, e);
    });

    $(".fb-mod_side_logo").mousedown(function(e) {

        UT && UT.send({"type": "click", "position": "fb", "sort": that.status.fold === 0 ? "pull" : "fold","modId":"fb-box"});
        that.foldHandle.call(that, e);
    });

    $(".fb-mod_side_home").mousedown(function(e) {
        UT && that.status.fold === 0 && UT.send({"type": "click", "position": "fb", "sort": "pull","modId":"fb-box"});
        UT && UT.send({"type": "click", "position": "fb", "sort": "icon_home","modId":"fb-box"});
        that.status.fold === 0 && that.foldHandle.call(that, e);
        that.clickHandle($(this), "fb-mod_side_home_cur", that.ui.panelHome);
    });

    $(".fb-mod_side_friend").mousedown(function(e) {
        var logObj = {
            "type": "click",
            "position": "fb",
            "sort": "icon_friend",
            "modId": "fb-box"
        };
        if(that.status.login !== 2) {
            logObj.ac = "b";
        }
        UT && UT.send(logObj);
        
        if(that.status.login !== 2) return false;

        that.status.fold === 0 && that.foldHandle.call(that, e);
        that.clickHandle($(this), "fb-mod_side_friend_cur", that.ui.panelFriend);
    });

    $(".fb-mod_side_messages").mousedown(function(e) {

        var logObj = {
            "type": "click",
            "position": "fb",
            "sort": "icon_messages",
            "modId": "fb-box"
        };
        if(that.status.login !== 2) {
            logObj.ac = "b";
        }
        UT && UT.send(logObj);
        
        if(that.status.login !== 2) return false;
        that.status.fold === 0 && that.foldHandle.call(that, e);
        that.clickHandle($(this), "fb-mod_side_messages_cur", that.ui.panelMessages);
    });

    $(".fb-mod_side_notifications").mousedown(function(e) {
        var logObj = {
            "type": "click",
            "position": "fb",
            "sort": "icon_notifications",
            "modId": "fb-box"
        };
        if(that.status.login !== 2) {
            logObj.ac = "b";
        }
        UT && UT.send(logObj);
        
        if(that.status.login !== 2) return false;
        that.status.fold === 0 && that.foldHandle.call(that, e);
        that.clickHandle($(this), "fb-mod_side_notifications_cur", that.ui.panelNotifications);
    });

    that.ui.btnRefresh.mousedown(function(e) {
        UT && UT.send({"type": "click", "position": "fb", "sort": "refresh","modId":"fb-box"});
    });

    $(".fb-mod_side_friend").click(function(e) {
        e.preventDefault();
    });
    $(".fb-mod_side_messages").click(function(e) {
        e.preventDefault();
    });
    $(".fb-mod_side_notifications").click(function(e) {
        e.preventDefault();
    });

    // 7.  FB-APP的打开、收缩机制；——点击F、箭头、new三个地方打开，点击F、箭头两个地方关闭；做上新功能上线的提示图标，放cookies内；
    // 
    // kill the feature
    // that.ui.side.mouseover(function(e) {
    //     that.status.fold === 0 && that.foldHandle.call(that, e);
    // });

    that.ui.textareaSubmit.attr("placeholder", conf.tplSuggestText);

    // sdk loading
    that.status.sdkLoaded = 1;

    /*$.ajax({
        url: that.conf.modPath,
        dataType: "script",
        cache: true,
        success: function() {
        },
        error: function() {
        }
    });*/

	require.async('home:widget/ui/facebook/fbclient-core.js');
};

if(window.ActiveXObject && !window.XMLHttpRequest) {
    var body = DOC.body;
    if(body) {
        body.style.backgroundAttachment = 'fixed';
        if(body.currentStyle.backgroundImage == "none") {
            body.style.backgroundImage = (DOC.domain.indexOf("https:") == 0) ? 'url(https:///)' : 'url(about:blank)';
        }
    }
}

FBClient.clickHandle = function($el, type, panel) {
    var that = this,
        fold = that.status.fold,
        sideHome = that.ui.sideHome,
        cache = that.cache;

    // fold && sideHome.removeClass(type);
    cache.curSide && cache.curSide.removeClass(cache.curSideType);
    $el && $el.addClass(type);
    cache.curSide = $el;
    cache.curSideType = type;

    cache.panel && cache.panel.hide();
    panel && panel.show();
    cache.panel = panel;
};

FBClient.foldHandle = function(e) {
    var that = this,
        fold = that.status.fold,
        sdkLoaded = that.status.sdkLoaded;

    // playing animation
    if(fold === 1) return;
    that.status.fold = 1;

    that.clickHandle(fold ? null : that.ui.sideHome, fold ? "" : "fb-mod_side_home_cur", that.ui.panelHome);
    that.status.bubble && ($.cookie("fb_bubble", 1), that.status.bubble = 0, that.ui.bubble.hide());

    fold
    ? that.ui.uiMod.removeClass("fb-mod--fixed").addClass("fb-mod--fold")
    : that.ui.uiMod.removeClass("fb-mod--fold");

    setTimeout(function() {
        // fold ? sideHome.removeClass("fb-mod_side_home_cur") : that.ui.sideHome.addClass("fb-mod_side_home_cur"), that.cache.curSideType = "fb-mod_side_home_cur";

        (that.status.fold = fold ? 0 : 2) && that.status.fixed && that.ui.uiMod.addClass("fb-mod--fixed");
        if (!that.status.eventBinded) {
            if (sdkLoaded === 2) {
                that.bindEvent.call(that);
                that.status.eventBinded = 2;
            } else {
                var t = setInterval(function () {
                    if (that.status.sdkLoaded === 2) {
                        that.bindEvent.call(that);
                        that.status.eventBinded = 2;
                        clearInterval(t);
                    }
                }, 1000);
            }
        }      

        if(fold || sdkLoaded) return;

        !function(el) {
            if($.browser.mozilla){
                el.addEventListener('DOMMouseScroll',function(e){
                    el.scrollTop += e.detail > 0 ? 30 : -30;   
                    e.preventDefault();
                }, !1);
            }
            else el.onmousewheel = function(e){   
                e = e || WIN.event;   
                el.scrollTop += e.wheelDelta > 0 ? -30 : 30;   
                e.returnValue = false;
            };
        }(that.ui.body[0])
    }, that.supportAnimate ? 300 : 0);
};

module.exports = FBClient;