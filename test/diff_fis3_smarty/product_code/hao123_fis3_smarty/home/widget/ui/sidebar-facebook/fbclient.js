var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var TPL_CONF = require('home:widget/ui/sidebar-facebook/fbclient-tpl.js');
var FBClient = {};

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
	, uiBtnClose: "#sidebar-facebookContent .contents-title_ar"
	, uiWrap: ".fb-mod_wrap"
	, uiList: ".fb-mod_list"
	, uiUsrinfo: ".fb-mod_usrinfo"
	, uiAvatar: ".fb-mod_avatar"
	, uiTextareaSubmit: ".fb-mod_submit"
	, uiBtnSubmit: ".fb-mod_submit_btn"
	, uiBody: ".fb-mod_body"
	, uiTip: ".fb-mod_tip"
	, uiSideHome: ".sidebarFacebookIcon"
	, uiSideFriend: ".fb-mod_tab_friend em"
	, uiSideMessages: ".fb-mod_tab_msg em"
	, uiSideNotifications: ".fb-mod_tab_notify em"
	, uiBodyLoader: ".fb-mod_body_loader"
};

FBClient.init = function() {
    
    var that = this,
        $this = $(UI_CONF.uiMod);

    /*    ui controller    */
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
    };

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

    /*    post status cache    */
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


    $(UI_CONF.uiBtnClose + ", " + UI_CONF.uiSideHome).on("click", function() {
        that.foldHandle();
    });

    // sdk loading
    that.status.sdkLoaded = 1;

	require.async('home:widget/ui/sidebar-facebook/fbclient-core.js', function(){
        that.foldHandle();
    });
};

FBClient.foldHandle = function() {
    var that = this,
        fold = that.status.fold,
        sdkLoaded = that.status.sdkLoaded;

    // 动画控制，避免多次触发
    if(fold === 1) return;
    that.status.fold = 1;

    fold
    ? that.ui.uiMod.addClass("fb-mod--fold")
    : that.ui.uiMod.removeClass("fb-mod--fold");

    that.status.fold = fold ? 0 : 2;
    if (!that.status.eventBinded) {
        if (sdkLoaded === 2) {
            that.bindEvent();
            that.status.eventBinded = 2;
        } else {
            var t = setInterval(function () {
                if (that.status.sdkLoaded === 2) {
                    that.bindEvent();
                    that.status.eventBinded = 2;
                    clearInterval(t);
                }
            }, 1000);
        }
    }
};

module.exports = FBClient;