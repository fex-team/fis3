var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var FBClient = require('home:widget/ui/facebook/fbclient.js');
var TPL_CONF = require('home:widget/ui/facebook/fbclient-tpl.js');



/**
 * Facebook module
 * @return {[type]} [description]
 */

var WIN = window,
	DOC = document,
	conf = WIN.conf.FBClient,
	that = FBClient,
	undef;

// requre facebook sdk
$.ajax({
    url: conf.sdkPath,
    dataType: "script",
    cache: true,
    success: function() {
        if(!window.FB) return;
        that.status.sdkLoaded = 2;
        that.cache.loadedTime = new Date;
        FB.init({
            appId: conf.appId
            , status: conf.status
            , cookie: conf.cookie
            , expires : 100
            // , xfbml: conf.xfbml
            , xfbml: 1
            , oauth: conf.oauth
        });
        that.checkLoginStatus(function (response) {
            if (response.authResponse) {

                that.autoRefresh.refresh();
                that.autoRefresh.start();
            }
        });
        // that.bindEvent.call(that);
    },
    error: function() {

    }
});

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
}

that.valueChange = function(el, callback) {
    callback && "onpropertychange" in el
    ? el.onpropertychange = function(){
        window.event && callback.call(this, window.event)
    }
    : el.addEventListener("input", callback, false);
}

that.bindEvent = function() {
    var submitWrap = that.ui.textareaSubmit.parent(),
        submitFocusClass = "fb-mod_submit_wrap--focus";

    that.ui.btnLogin.click(function(e) {
        that.ui.uiMod.addClass("fb-mod--loading");
        FB.login(function(response) {
            // record facebook id
            response.authResponse && response.userID && $.cookie("__FBID", response.userID, {
                expires: 10*365,
                path: '/'
            });
            that.updateLoginStatus.call(that, response);
        }, {scope: conf.permissions});
    });

    that.ui.btnSubmit.click(function(e) {
        var val = that.ui.textareaSubmit.attr("value");
        if(!/\S+/.test(val)) return that.showTip(1, conf.tplSubmitNonBlank);
        that.ui.uiMod.addClass("fb-mod--submiting");
        FB.api('/me/feed', 'post', {"message": val}, function(response) {
            that.ui.uiMod.removeClass("fb-mod--submiting");
            if(response.error && response.error.code == 341){
                that.showTip(1, conf.tplSubmitLimit);
            }
            else if (!response || response.error) {
                that.showTip(1, conf.tplSubmitFailed);
            }
            else {
                that.showTip(1, conf.tplSubmitSucceed);
                that.ui.textareaSubmit.attr("value", "").blur().height(40).parent().removeClass(submitFocusClass);
                that.ui.body.animate({
                    scrollTop: 0
                }, function() {
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
                });
            }
        });
    });

    that.ui.btnRefresh.click(function(e) {
        that.refresh()
    });

    that.ui.sideHome.click(function(e) {
        that.refresh();
    });

    that.checkLoginStatus(that.updateLoginStatus);

    that.ui.list.find("a").live("click", that.actionHandle);

    that.ui.list.find(".fb-mod_li").live({
        mouseenter: function(e) {
            $(this).attr("data-userID") === that.cache.userID && $(this).addClass("fb-mod_li--hover");
        },
        mouseleave: function(e) {
            $(this).attr("data-userID") === that.cache.userID && $(this).removeClass("fb-mod_li--hover");
        }
    });

    that.ui.textareaSubmit.on({
        focus: function() {
            !submitWrap.hasClass(submitFocusClass) && submitWrap.addClass(submitFocusClass);
        },
        blur: function() {
            setTimeout(function() {
                submitWrap.hasClass(submitFocusClass) && submitWrap.removeClass(submitFocusClass);
            }, 16);
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

    !(window.ActiveXObject && !window.XMLHttpRequest) && that.ui.fakeBox[0] && that.valueChange(that.ui.textareaSubmit[0], function(e) {
        var $this = $(this),
            fake = that.ui.fakeBox,
            maxHeight = ~~conf.postBoxMaxHeight,
            height,
            minHeight;
        
        setTimeout(function() {
            fake.height(minHeight = that.status.fixed ? 16 : 40);
            height = Math.min(fake.attr("value", $this.attr("value"))[0].scrollHeight, maxHeight || 100);
            $this.css({"overflow": height === maxHeight ? "auto" : "hidden"}).height(Math.max(height, minHeight));
        }, 16);
    });

    that.ui.side.find("a").live("click", function() {
        that.showSideStatus($(this).find("em"), "");
    });

    that.ui.panelFriend.delegate("button", "click", function() {

        // TODO: find out the api
        window.open("https://www.facebook.com/friends/requests/");
        // confirm
        // alert($(this).hasClass("fb-mod_btn-confirm"))
    })
}

that.scrollHandle = function(e) {
    var $this = $(this),
        fake = that.ui.fakeBox,
        textarea = that.ui.textareaSubmit,
        scrolltop = $this.scrollTop();

    if(scrolltop > 20) {
        textarea.height(fake.attr("value", textarea.attr("value"))[0].scrollHeight - 2);
        that.ui.uiMod.addClass("fb-mod--fixed");
        that.status.fixed = 2;
        /*fix the FF bug*/
        $.browser.mozilla && that.ui.uiMod.hasClass("fb-mod--fold") && that.ui.uiMod.hasClass("fb-mod--fixed") && that.ui.uiMod.removeClass("fb-mod--fixed");
    }
    else {
        textarea.height() < 40 && textarea.height(40);
        that.ui.uiMod.removeClass("fb-mod--fixed");
        that.status.fixed = 0;
    }
    
    /*while ff is in rtl mod , the scrollTop will be lack of 1px whick causes the page cannot trigger the fresh function */
    $.browser.mozilla && $("html").attr("dir")=="rtl" && (scrolltop = scrolltop+1);
    if(!that.cache.noOldPost && that.status.scrollLoaded !== 1 && 

   scrolltop >= that.ui.list.height() + that.ui.textareaSubmit.parent().parent()[0].offsetHeight - that.ui.list.parent().height() - 50) {

        that.status.scrollLoaded = 1;
        that.ui.uiMod.addClass("fb-mod--pulling");
        that.streamPull(2, "/me/home", that.cache.nextPost, that.feedRender);
    }
}

// check login status
that.checkLoginStatus = function(callback) {
    // FB.Event.subscribe('auth.statusChange', that.updateLoginStatus);
    FB.getLoginStatus(function(response) {
        // record facebook id
        response.authResponse && response.userID && $.cookie("__FBID", response.userID, {
            expires: 10*365,
            path: '/'
        });
        // that.updateLoginStatus.call(that, response);
        callback && callback.call(that, response);
    });
}

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
    }
    else {
        that.status.login = 0;
        that.ui.uiMod.addClass("fb-mod--login").removeClass("fb-mod--loading");
    }
}

that.logout = function(response) {
    that.clickHandle($(that.ui.sideHome), "fb-mod_side_home_cur", that.ui.panelHome);
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
    that.ui.body.animate({
        scrollTop: 0
    });
    that.ui.liveLoader.show();
    that.streamPull(4, "/me/home", that.cache.prePost, that.feedRender);
}

that.autoRefresh = {
    timer: null,
    start: function() {
        that.autoRefresh.stop();

        // me/home?limit=1&fields=id
        FB.api("/me/home?limit=1&fields=id", function(response) {
            if(!response || response.error || !response.data.length) return;

            // timeline add 3 hours
            new Date(response.data[0]["created_time"].replace(/-/g, "/").replace(/[TZ]/g, " ").replace(/\+/g, " +")) - that.cache.loadedTime > -3600000 * 3
            && that.showSideStatus(that.ui.sideHome, conf.tplNewLabel);
        });
        that.autoRefresh.timer = setInterval(function() {
            that.autoRefresh.refresh();
        }, conf.refreshInterval * 1000);
    },

    refresh: function () {
        var ui = that.ui;


        that.cache.prePost && that.streamPull(3, "/me/home", that.cache.prePost + "&fields=id", function(response) {
            var l = that.autoRefresh.checkLength(response);
// (key ? response.data.length : Math.max(response.data.length - that.cache.myPost, 0));
            if(l - that.cache.myPost > 0) {
                that.showTip(1, conf.tplNewPosts, {n: l - that.cache.myPost});

                // ??
                that.showSideStatus(ui.sideHome, conf.tplNewLabel);
            }
        });

        
        window.FB.unreadMessage = 0;
        // update slide icon num
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
}

that.renderSidePanel = function(name, data, tpl, panel) {
    var panels = {
            friendrequests: that.ui.panelFriend,
            notifications: that.ui.panelNotifications,
            inbox: that.ui.panelMessages
        },
        
        tpls = {
            friendrequests: '<div class="fb-mod_panel_li"> <div class="fb-mod_panel_li_avatar"> <a href="#{url}" target="_blank"><img width="50" height="50" src="#{avatar}"></a> </div> <div class="fb-mod_panel_li_c"> <span class="fb-mod_panel_li_name"><a href="#{url}" target="_blank">#{name}</a></span> <p class="fb-mod_panel_li_info">#{info}</p> <div class="fb-mod_panel_li_bar" data-id="#{id}"><button class="fb-mod_btn fb-mod_btn-confirm fb-mod_submit_btn">#{confirm}</button> <button class="fb-mod_btn fb-mod_submit_btn">#{later}</button></div> </div> </div>',

            notifications: '<a class="fb-mod_panel_li" href="#{url}" target="_blank"> <div class="fb-mod_panel_li_avatar"> <img width="50" height="50" src="#{avatar}"> </div> <div class="fb-mod_panel_li_c"> <span class="fb-mod_panel_li_name">#{name}</span>&nbsp;<p class="fb-mod_panel_li_info">#{info}</p> <p class="fb-mod_panel_li_time">#{time}</p> </div> </a>',

            inbox: '<a class="fb-mod_panel_li" href="#{url}" target="_blank"> <div class="fb-mod_panel_li_avatar"> <img width="50" height="50" src="#{avatar}"> </div> <div class="fb-mod_panel_li_c"> <span class="fb-mod_panel_li_name">#{name}</span>&nbsp;<p class="fb-mod_panel_li_info">#{info}</p> <span class="fb-mod_panel_li_time">#{time}</span> </div> </a>',

            noNewMsg: '<p class="fb-mod_panel_nonewmsg">#{noNewMsg}</p>'
        },

        ret = [],

        tmp = {};

    data = (((data || {})[name]) || {}).data;
    tpl = tpl || tpls[name];
    panel = panel || panels[name];

    if(data && data.length) {
        $.each(data, function(key, val) {

            // msg(inbox)
            if(val.comments && val.comments.data) {
                $.each(val.comments.data, function(_key, _val) {

                    tmp.url = "https://www.facebook.com/messages/" + _val.from.id;
                    tmp.avatar = "https://graph.facebook.com/" + _val.from.id + "/picture";
                    tmp.info = _val.message;
                    tmp.name = _val.from.name;

                    tmp.time = that.timeAgo(_val.updated_time || _val.created_time);
                    ret.push(tpl.replaceTpl(tmp));
                });
            }

            // friend or notif
            else if(val.from){
                tmp.id = val.from.id;
                tmp.url = "https://www.facebook.com/" + val.from.id;
                tmp.avatar = "https://graph.facebook.com/" + val.from.id + "/picture";
                tmp.name = val.from.name;
                tmp.info = val.title ? val.title.replace(tmp.name, "") : "";
                // CMS
                tmp.confirm = conf.tplConfirm || "Confirm";
                tmp.later = conf.tplLater || "Later";

                tmp.time = that.timeAgo(val.updated_time || val.created_time);
                ret.push(tpl.replaceTpl(tmp));
            }
        });
    }
    else {
        ret.push(tpls.noNewMsg.replaceTpl({
            noNewMsg: conf.tplNoNewMsg || "No new messages."
        }))
    }
    
    // update render cache(stop render every request)
    that.cache.panelRendered < 3 && (that.cache.panelRendered ++);
    panel.html(ret.join(""));
}

that.updateSide = function(name, el) {
    var unread;
    that.streamPull(3, "/me", {
        "fields": name
    }, function(response) {
        (name === "friendrequests") && (unread = that.autoRefresh.checkLength(response, name));

        (name === "notifications" || name === "inbox") && (unread = response[name] ? (response[name].summary || {}).unseen_count : 0)
        // that.autoRefresh.checkLength(response, name) && response[name] && that.showSideStatus(el, response[name].data.length);
        that.showSideStatus(el, unread);
        var un = unread || 0;
        window.FB.unreadMessage = window.FB.unreadMessage + un;
        if(that.cache.panelRendered < 3 || !!that.status.fold) that.renderSidePanel(name, response);
    });
}

that.showSideStatus = function(el, n) {
    el[0] === that.ui.sideHome[0] && (el = el.find("em"));
    el.html(n);
    n ? el.show() : el.hide();
}

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
}
that.streamPull = function(type, api, param, callback) {

    param + "" !== param && (param = api + '/?' + that.formatQuery(param));

    // console.log(param);
    FB.api(param, function(response) {
        callback && callback.call(that, response, type);
    });
}

// 1358173295000 ==> 1358173295
that.toUnixTime = function(str) {
    return Math.round(new Date(str).getTime()/1000);
}

that.formatQuery = function(obj) {
    var arr = [],
        li;
    for(li in obj) obj.hasOwnProperty(li) && obj[li] !== undef && arr.push(li + "=" + obj[li]);
    return arr.join("&");
}


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


    type === 1 && that.ui.body.scroll(that.scrollHandle);

    // scroll pull: update status
    type === 2 && (that.status.scrollLoaded = 2);
    that.ui.uiMod.removeClass("fb-mod--loading").removeClass("fb-mod--pulling");
    that.ui.liveLoader.hide();
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
        // that.cache.prePost = that.toUnixTime(response.data[0]["created_time"]);
        // that.cache.nextPost = that.toUnixTime(response.data[l - 1]["created_time"]);

        that.cache.prePost = response.paging.previous;
        that.cache.nextPost = response.paging.next;
        // that.autoRefresh.start();
    }

    // scroll:
    if(type === 2) {
        // cache post timestamp
        
        // "https://graph.facebook.com/100002343724582/home?limit=25&access_token=AAAGlLuZAFQYYBANOISQA5tyfINyjNIZBk774ABIJP2AncS3BikWjr4qqbxuj5l0ZAYIx66lt39o0FIAZBZBfU1Uabnhjo1CM7XWQdHd1IOnrUS3E1d7XM&until=1358085399"

        // that.cache.nextPost = response.paging.previous ? response.paging.previous.match(/since=(.*)[^$&]/)[1] : that.toUnixTime(response.data[l - 1]["created_time"]);
        // that.cache.refreshPost = that.toUnixTime(response.data[l - 1]["created_time"]);

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

         // console.log(li);

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
                , width: window.ActiveXObject ? "50" : "90"
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
            // , time: that.timeAgo(li.created_time)
        }));
    }

    // console.log(that.cache.myPost)
    if(type === 4 && that.cache.myPost) {
        that.ui.list.find("li:lt(" + that.cache.myPost + ")").remove();
        that.cache.myPost = 0;
    }

    temp = that.ui.list.html();

    that.ui.list.html((type === 2 ? temp : "") + arr.join("") + (type === 2 ? "" : temp));

    if(type === 5) $(that.ui.list.find("li")[0]).fadeOut().fadeIn();
}

// https://developers.facebook.com/docs/reference/api/post/

that.streamPush = function(name, description, hrefTitle, hrefLink, userPrompt){

    FB.ui({
        method: 'stream.publish',
        message: '',

        attachment: {
            name: name,
            caption: '',
            description: (description),
            href: hrefLink
        },

        action_links: [{
            text: hrefTitle,
            href: hrefLink
        }],

        user_prompt_message: userPrompt
    }, function(response) {
        if(response && response.post_id) {
            alert('Post was published.');
        }
        else {
            alert('Post was not published.');
        }
    });
}

that.actionHandle = function(e) {
    var $this = $(this),
        id,
        uid;
    // $this.hasClass("fb-mod_li_like")
    // $this.hasClass("fb-mod_li_comment")

// https://www.facebook.com/ajax/sharer/?s=22&appid=25554907596&p%5B0%5D=100002343724582&p%5B1%5D=394783520609769
    if($this.hasClass("fb-mod_li_share")) {

        /*FB.ui({
            method: 'stream.share'
            , display: "dialog"
            , t: "title"
        }, function(response) {
            console.log(response);
        });
*/
        var $wrap = $this.parent().parent().find(".fb-mod_li_actice");

        FB.ui({
            method: "feed",
            name: $wrap.find("a")[0] ? $wrap.find("a").html() : "",
            // link: $wrap.parent().find("a")[2] ? $wrap.parent().find("a")[2].href : "",
            link: $wrap.find("a")[0] ? $wrap.find("a").attr("href") : "",
            // picture: $wrap.parent().find("img").attr("src"),
            picture: "",
            // picture: "http://br.hao123.com/resource/br/img/i-hot-sprite.png",
            // picture: $wrap.parent().parent().find(".fb-mod_li_avatar img").attr("src"),
            description: $wrap.html()
        }, function(response) {
            that.showTip(1, response && response.post_id ? conf.tplPublishedSucceed : conf.tplPublishedFailed);
        });
    }
    
    if($this.hasClass("fb-mod_li_close")) {
        /*FB.ui({
            method: "stream.remove"

            // session user
            // , uid: ""
            , post_id: $this.parent().attr("data-id")
        }, function(response) {
            console.log(response)
        })*/

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
        }
        else {
            FB.api(id + '/likes', 'post', function(response) {
                if(!response || response.error) return that.showTip(1, conf.tplLikeFailed);

                uid === that.cache.userID
                ? $this.html(conf.tplUnLike).addClass("fb-mod_li_liked")
                : $this.html(conf.tplLiked || "liked").addClass("fb-mod_li_likeded")
            });
        }
    }
}

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
}

module.exports = FBClient;