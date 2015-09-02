var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var FBClient = require('home:widget/ui/sidebar-facebook/fbclient.js');
var TPL_CONF = require('home:widget/ui/sidebar-facebook/fbclient-tpl.js');

var WIN = window,
	DOC = document,
	conf = WIN.conf.FBClient,
	that = FBClient,
    scrollbar,
	undef;

//replace string by object, like "#{name}"
String.replaceTpl || (String.prototype.replaceTpl = function(o) {
    return this.replace(/#\{([^}]*)\}/mg, function(v, k) {
        return v = o[k] || "";
    });
});

/*
0 ==> hide
1 ==> normal stay 5s
2 ==> stay forever(except click refresh)
 */
that.showTip = function(type, tpl, data) {
    var tip = that.ui.tip,
        span = tip.find("span");
    tpl = type ? tpl.replaceTpl(data || {}) : "";
    span.html(tpl);
    that.tipTimer && clearTimeout(that.tipTimer);
    if(!type) return that.ui.tip.fadeOut(300);
    that.status.login != 0 && that.ui.tip.fadeIn(300);
    type === 1
    ? that.tipTimer = setTimeout(function(arguments) {
        that.cache.stayTip
        ? span.html(that.cache.stayTip)
        : that.ui.tip.fadeOut(300)
    }, conf.tipStayTime * 1000)
    : that.cache.stayTip = tpl;
};

that.bindEvent = function() {
    var submitWrap = that.ui.textareaSubmit.parent(),
        submitFocusClass = "fb-mod_submit_wrap--focus",
        supportPlaceholder = ('placeholder' in document.createElement('input'));

    that.checkLoginStatus(that.updateLoginStatus);

    !supportPlaceholder && that.ui.textareaSubmit.val() == "" && that.ui.textareaSubmit.val(conf.tplSuggestText).css({"color":"#7c7c7c"});

    that.ui.btnLogin.click(function(e) {
        that.ui.uiMod.addClass("fb-mod--loading");
        FB.login(function(response) {
            // record facebook id
            response.authResponse && response.authResponse.userID && $.cookie("__FBID", response.authResponse.userID, {
                expires: 10*365,
                path: '/'
            });
            that.updateLoginStatus.call(that, response);
        }, {scope: conf.permissions});
    });

    that.ui.btnRefresh.click(function() {
        that.refresh()
    });

    that.ui.list.on("click", "a", that.actionHandle);


    that.ui.list.find(".fb-mod_li").live({
        mouseenter: function(e) {
            $(this).attr("data-userID") === that.cache.userID && $(this).addClass("fb-mod_li--hover");
        },
        mouseleave: function(e) {
            $(this).attr("data-userID") === that.cache.userID && $(this).removeClass("fb-mod_li--hover");
        }
    });

    //编写状态输入框的样式切换
    that.ui.textareaSubmit.on({
        focus: function() {
            if(!submitWrap.hasClass(submitFocusClass)){
                submitWrap.addClass(submitFocusClass);
                that.ui.uiMod.addClass("fb-mod--focus");
                !supportPlaceholder && $(this).val() == conf.tplSuggestText && $(this).val("").css({"color":"#353535"});
            }
        },
        blur: function() {
            if(submitWrap.hasClass(submitFocusClass)){
                submitWrap.removeClass(submitFocusClass);
                that.ui.uiMod.removeClass("fb-mod--focus");
                !supportPlaceholder && $(this).val() == "" && $(this).val(conf.tplSuggestText).css({"color":"#7c7c7c"});
            }
        }
    });

    submitWrap.mousedown(function(e) {
        var el = $(this)[0];
        if($(e.target).hasClass("fb-mod_submit")) return;
        e.preventDefault
        ? e.preventDefault()
        : el.onbeforedeactivate = function() {
            WIN.event.returnValue = false;
            el.onbeforedeactivate = null;
        }
    });

    //编写状态提交按钮的响应
    that.ui.btnSubmit.mousedown(function(e) {
        var val = that.ui.textareaSubmit.attr("value");
        if(!/\S+/.test(val)) return that.showTip(1, conf.tplSubmitNonBlank);
        if (that.ui.uiMod.hasClass("fb-mod--submiting")) return;
        that.ui.uiMod.addClass("fb-mod--submiting");
        FB.api('/me/feed', 'post', {"message": val}, function(response) {
            that.ui.uiMod.removeClass("fb-mod--submiting");
            if(response.error && response.error.code == 341){
                that.showTip(1, conf.tplSubmitLimit);
            } else if (!response || response.error) {
                that.showTip(1, conf.tplSubmitFailed);
            } else {
                that.showTip(1, conf.tplSubmitSucceed);
                that.ui.textareaSubmit.attr("value", "").blur();
                !supportPlaceholder && that.ui.textareaSubmit.val() == "" && that.ui.textareaSubmit.val(conf.tplSuggestText).css({"color":"#7c7c7c"});
                that.ui.uiMod.removeClass("fb-mod--fixed");
                that.status.fixed = 0;
                scrollbar.goTo({x:0, y:0});
                that.feedRender({data: [{
                    from: {
                        id: that.cache.userID
                        , name: that.cache.userName
                    }
                    , id: response.id
                    , type: "status"
                    , updated_time: new Date()
                    , message: val.replace(/\r/ig, '<br>').replace(/\n/ig, '<br>')
                }]}, 5);
            }
        });
    });

};

that.scrollHandle = function(e) {
    require.async("common:widget/ui/scrollable/scrollable.js", function(){
        if($(".mod-scroll", that.ui.body).length >= 1) return;
        scrollbar = that.ui.list.scrollable({
            onScroll: function(){
                if(this.state.y < -3){
                    that.ui.uiMod.addClass("fb-mod--fixed");
                    that.status.fixed = 2;
                }else{
                    that.ui.uiMod.removeClass("fb-mod--fixed");
                    that.status.fixed = 0;
                }
                if (this.state._y + this.state.y <=0 && !that.cache.noOldPost && that.status.scrollLoaded !== 1) {
                    that.status.scrollLoaded = 1;
                    that.ui.uiMod.addClass("fb-mod--pulling");
                    that.streamPull(2, "/me/home", that.cache.nextPost, that.feedRender);
                }
            }
        });
    });
};

// check login status
that.checkLoginStatus = function(callback) {
    FB.getLoginStatus(function(response) {
        // record facebook id
        response.authResponse && response.authResponse.userID && $.cookie("__FBID", response.authResponse.userID, {
            expires: 10*365,
            path: '/'
        });
        callback && callback.call(that, response);
    });
};

/*
0 ==> login
1 ==> logout
 */
that.updateLoginStatus = function(response) {

    //already logged
    if(response.authResponse) {
        that.status.login = 2;
        that.accessToken = response.authResponse.accessToken;
        that.cache.userID = response.authResponse.userID;
        that.streamPull(0, "/me", {}, function(response) {
            if(response){
                that.usrinfoRender.call(that, response);
                that.ui.uiMod.removeClass("fb-mod--login");
                that.streamPull(1, "/me/home", {
                    access_token: that.accessToken
                }, that.feedRender);
            }
        });

        that.ui.btnLogout[0].onclick = function(e) {
            that.logout.call(that, response);
            return !1;
        }
    } else {
        that.status.login = 0;
        that.ui.uiMod.addClass("fb-mod--login").removeClass("fb-mod--loading");
    }
};

that.logout = function(response) {
    that.ui.uiMod.addClass("fb-mod--loading");
    FB.logout(function(response) {
        that.status.login = 0;
        that.ui.btnLogout[0].onclick = null;
        that.usrinfoRender();
        that.feedRender({data: []}, 0);
        that.ui.uiMod.addClass("fb-mod--login").removeClass("fb-mod--loading");

        // reset num
        that.ui.sideFriend.html("").hide();
        that.ui.sideMessages.html("").hide();
        that.ui.sideNotifications.html("").hide();
        that.autoRefresh.stop();
        that.ui.list.empty();
    });
}

that.refresh = function() {
    that.cache.stayTip && that.showTip(~~(that.cache.stayTip = ""));
    that.ui.bodyLoader.show();
    that.streamPull(4, "/me/home", that.cache.prePost, that.feedRender);
}

that.autoRefresh = {
    timer: null,
    start: function() {
        that.autoRefresh.stop();
        that.autoRefresh.timer = setInterval(function() {
            that.autoRefresh.refresh();
        }, conf.refreshInterval * 1000);
    },

    refresh: function () {
        var ui = that.ui;
        that.cache.prePost && that.streamPull(3, "/me/home", that.cache.prePost + "&fields=id", function(response){
            var len = that.autoRefresh.checkLength(response);
            if(len - that.cache.myPost > 0) {
                that.showTip(1, conf.tplNewPosts, {n: len - that.cache.myPost});
                that.showSideStatus(ui.sideHome, conf.tplNewLabel);
            }
        });
        window.FB.unreadMessage = 0;
        // update side icon num
        $.each({
              "friendrequests": ui.sideFriend
            , "notifications": ui.sideNotifications
            , "inbox": ui.sideMessages
        }, that.updateSide);
    },

    checkLength: function(response, key) {
        if(!response || response.error) return 0;

        var length;
         length = key
        ? response[key] && response[key].summary ? response[key].summary.unread_count : 0
        : response.data ? response.data.length : 0

        return length;
    },

    stop: function() {
        that.autoRefresh.timer && clearInterval(that.autoRefresh.timer);
        that.autoRefresh.timer = null;
    },

    status: function() {
        return !!that.autoRefresh.timer;
    }
};

that.updateSide = function(name, el) {
    var unread;
    that.streamPull(3, "/me", {
        "fields": name
    }, function(response) {
        (name === "friendrequests") && (unread = that.autoRefresh.checkLength(response, name));
        (name === "notifications" || name === "inbox") && (unread = response[name] ? (response[name].summary || {}).unseen_count : 0);
        that.showSideStatus(el, unread);
        var un = unread || 0;
        window.FB.unreadMessage = window.FB.unreadMessage + un;
    });
};

that.showSideStatus = function(el, n) {
    el[0] === that.ui.sideHome[0] && (el = el.find("em"));
    el.html(n);
    n ? el.show() : el.hide();
};

that.usrinfoRender = function(response) {
    var usrinfo = response
        ? TPL_CONF.tplUser.replaceTpl({name: response.name, usrId: response.id})
        : "",
        avatar = response
        ? TPL_CONF.tplAvavatar.replaceTpl({pId: response.id})
        : "";
    that.ui.usrinfo.html(usrinfo);
    that.ui.avatar.html(avatar);
    if(!response) return;
    that.cache.userName = response.name;
    that.cache.userID = response.id;
};

that.streamPull = function(type, api, param, callback) {
    param + "" !== param && (param = api + '/?' + that.formatQuery(param));
    FB.api(param, function(response) {
        callback && callback.call(that, response, type);
    });
};

// 1358173295000 ==> 1358173295
that.toUnixTime = function(str) {
    return Math.round(new Date(str).getTime()/1000);
};

that.formatQuery = function(obj) {
    var arr = [],
        li;
    for(li in obj) obj.hasOwnProperty(li) && obj[li] !== undef && arr.push(li + "=" + obj[li]);
    return arr.join("&");
};


/*
api :
0 not for post
1 init
2 scroll pull
3 auto refresh
4 refresh
5 from my

if autoRefresh param: fields=updated_time
 */
that.feedRender = function(response, type) {
    if(!response || response.error) return that.showTip(1, conf.tplNetworkError);

    var i = 0,
        l = response.data.length,
        li,
        arr = [],
        temp;


    type === 1 && that.scrollHandle();

    // scroll pull: update status
    type === 2 && (that.status.scrollLoaded = 2);
    that.ui.uiMod.removeClass("fb-mod--loading").removeClass("fb-mod--pulling");
    that.ui.bodyLoader.hide();
    that.showSideStatus(that.ui.sideHome, "");

    if(!l) {
        if(type === 2) {
            that.cache.noOldPost = 1;
            that.showTip(1, conf.tplNoOldPost);
        }
        if(type === 1 || type === 4) {
            that.showTip(1, conf.tplNoNewPost);
        }
        return;
    }

    // init: bind scroll event
    if(type === 1) {
        // cache post timestamp
        that.cache.prePost = response.paging.previous;
        that.cache.nextPost = response.paging.next;
    }

    // scroll:
    if(type === 2) {
        // cache post timestamp
        that.cache.nextPost = response.paging.next;
    }

    // refresh
    if(type === 4) {
        that.cache.prePost = response.paging.previous;
    }

    if(type === 5) {
        that.cache.myPost ++;
    }

    for(; i<l; i++) {
        li = response.data[i];

        // can not support "question" type yet
        // type: "status" ==> story
        li.type !== "question" && arr.push(TPL_CONF.tplLi.replaceTpl({
            // id: li.application.id
            id: li.id
            , usrId: li.from.id
            , author: li.from.name
            , tplLike: conf.tplLike
            , tplComment: conf.tplComment
            , tplShare: conf.tplShare
            , homepage: "https://www.facebook.com/" + li.from.id
            , message: (li.message || li.story || "").replace(/\r/ig, '<br>').replace(/\n/ig, '<br>')

            , photo: li.type === "photo" ? '<a class="fb-mod_li_photo" href="#{href}" target="_blank"><img alt="#{alt}" src="#{src}" width="#{width}"></a>'.replaceTpl({
                src: li.picture
                , href: li.link
                , alt: li.message
                // , width: 300
                // Fix: image width = 1 on IE
                , width: window.ActiveXObject ? "130" : ""
                , height: ""
            }) : ""
            , video: li.type === "video" || (li.type === "link" && li.picture) ? '<div class="fb-mod_li_video fb-mod_li_#{type}"> <div class="fb-mod_li_video_cover"><a href="#{href}" target="_blank"><img alt="#{alt}" src="#{cover}" width="#{width}" style="margin-left:5px;"></a></div><a class="fb-mod_li_video_c" href="#{href}" target="_blank"><span class="fb-mod_li_video_t">#{title}</span><p class="fb-mod_li_video_caption">#{caption}</p><p class="fb-mod_li_video_des">#{des}</p></a></div>'.replaceTpl({
                cover: li.picture
                , type: li.type
                , href: li.link
                , alt: li.name
                , width: window.ActiveXObject ? "50" : "60"
                // , height: ""
                , caption: li.caption
                , title: li.name
                , des: li.description
            }) : ""
            , quote: li.type === "link" && li.application && !li.picture ? TPL_CONF.tplQuote.replaceTpl({
                    href: li.link
                    , des: li.description
                    , caption: li.caption
                    , title: li.name
                }) : ""
            , time: that.timeAgo(li.updated_time)
        }));
    }

    if(type === 4 && that.cache.myPost) {
        that.ui.list.find("li:lt(" + that.cache.myPost + ")").remove();
        that.cache.myPost = 0;
    }
    temp = that.ui.list.html();
    that.ui.list.html((type === 2 ? temp : "") + arr.join("") + (type === 2 ? "" : temp));
    if(type === 5) $(that.ui.list.find("li")[0]).fadeOut().fadeIn();
};

that.actionHandle = function(e) {
    var $this = $(this),
        id,
        uid;

    if($this.hasClass("fb-mod_li_share")) {
        var $wrap = $this.parent().parent().find(".fb-mod_li_actice");
        FB.ui({
            method: "feed",
            name: $wrap.find("a")[0] ? $wrap.find("a").html() : "",
            link: $wrap.find("a")[0] ? $wrap.find("a").attr("href") : "",
            picture: "",
            description: $wrap.html()
        }, function(response) {
            that.showTip(1, response && response.post_id ? conf.tplPublishedSucceed : conf.tplPublishedFailed);
        });
    }
    
    if($this.hasClass("fb-mod_li_close")) {
        FB.api($this.parent().attr("data-id"), 'delete', function(response) {
            if(!response || response.error) return that.showTip(1, conf.tplDeleteFailed);
            that.showTip(1, conf.tplDeleteSucceed);
            $this.parent().fadeOut();
        });
    }

    if($this.hasClass("fb-mod_li_like")) {
        id = $this.parent().parent().parent().attr("data-id");
        uid = $this.parent().parent().parent().attr("data-userid");

        if($this.hasClass("fb-mod_li_liked")) {
            FB.api(id + '/likes', 'delete', function(response) {
                if(!response || response.error) return that.showTip(1, conf.tplUnLikeFailed);
                $this.html(conf.tplLike).removeClass("fb-mod_li_liked");
            });
        } else {
            FB.api(id + '/likes', 'post', function(response) {
                if(!response || response.error) return that.showTip(1, conf.tplLikeFailed);

                uid === that.cache.userID
                ? $this.html(conf.tplUnLike).addClass("fb-mod_li_liked")
                : $this.html(conf.tplLiked || "liked").addClass("fb-mod_li_likeded")
            });
        }
    }
};

that.timeAgo = function(time) {
    var date = time + "" === time ? new Date(time.replace(/-/g, "/").replace(/[TZ]/g, " ").replace(/\+/g, " +")) : time,
        diff = (((new Date).getTime() - date.getTime()) / 1000),
        day_diff = Math.floor(diff / 86400);
            
    if(isNaN(day_diff) || day_diff < 0 || day_diff >= 31) return time.split(/[TZ]/)[0];
    return day_diff == 0 && (
            diff < 60 && conf.tplTimeLine_1 ||
            diff < 120 && conf.tplTimeLine_2 ||

            // diff < 3600 && Math.floor( diff / 60 ) + conf.tplTimeLine_3 ||
            diff < 3600 && (/#{/.test(conf.tplTimeLine_3)
                ? conf.tplTimeLine_3.replaceTpl({n: Math.floor(diff / 60)})
                : (Math.floor(diff/60) + conf.tplTimeLine_3)) ||

            diff < 7200 && conf.tplTimeLine_4 ||

            // diff < 86400 && Math.floor( diff / 3600 ) + conf.tplTimeLine_5) ||
            diff < 86400 && (/#{/.test(conf.tplTimeLine_5)
                ? conf.tplTimeLine_5.replaceTpl({n: Math.floor(diff / 3600)})
                : (Math.floor( diff / 3600 ) + conf.tplTimeLine_5))) ||

        day_diff == 1 && conf.tplTimeLine_6 ||
        day_diff < 7 && day_diff + conf.tplTimeLine_7 ||
        // day_diff < 31 && Math.ceil( day_diff / 7 ) + conf.tplTimeLine_8 ||
        time.replace(/.{5}$/, "");
};

//入口方法 request facebook sdk
$.ajax({
    url: conf.sdkPath,
    dataType: "script",
    cache: true,
    success: function() {
        if(!window.FB) return;
        that.status.sdkLoaded = 2;
        that.cache.loadedTime = new Date;
        if(!window.conf.FBClient.initial){
            FB.init({
                  appId: conf.appId
                , status: conf.status
                , cookie: conf.cookie
                , expires : 100
                , xfbml: 1
                , oauth: conf.oauth
            });
        }
        that.checkLoginStatus(function (response) {
            if (response.authResponse) {
                that.autoRefresh.refresh();
                that.autoRefresh.start();
            }
        });
    }
});

module.exports = FBClient;