/*
*   User Bar Buttons
*   html改为JS动态拼接
*/

var $      = require("common:widget/ui/jquery/jquery.js");
var UT     = require("common:widget/ui/ut/ut.js");
var helper = require("common:widget/ui/helper/helper.js");
require("common:widget/ui/jquery/widget/jquery.sethome/jquery.sethome.js");
require("common:widget/ui/jquery/widget/jquery.addfav/jquery.addfav.js");

var isFirefox = /firefox/.test(navigator.userAgent.toLowerCase()),
    _conf     = conf.userbarBtnHd,
    _ffCon    = conf.setHomeOnFf,
    isShowFf  = (isFirefox && _ffCon && (_ffCon.isHidden === "0") && (_conf.isSetHomeFf === "1")),
    setFfHome = null,
    isRended  = false;

// 火狐设首优化
if (isShowFf) {
    require.async("common:widget/ui/sethome-ff/sethome-ff-c.js", function(init) {
        setFfHome = init;
        _ffCon.num = 0;
    });
}

_conf.browser.reverse();

var _browser     = _conf.browser,
    _addfav      = _conf.addfav,
    _download    = _conf.download,
    _sethome     = _conf.sethome,
    _browserData = _conf.browserData,
    _itemTpl     = '<div class="userbar-btn-hd_item"#{display}><a href="#{url}" id="#{id}" class="userbar-btn-hd_item-anchor"#{retrn}>#{content}</a><div class="userbar-btn-hd_item-tips"><div class="userbar-btn-hd_item-arrow"><div class="userbar-btn-hd_item-arrow-bg"></div></div><p id="#{botId}">#{botContent}</p></div></div><span class="userbar_split">|</span>',
    _itemMsg     = {
        addfav: {
            'display': (_browserData == 'addfav' ? ' style="display: none;"' : ''),
            'url': _addfav.url,
            'id': 'addFav',
            'retrn': ' onclick="return false;"',
            'content': _addfav.content || '<i class="userbar-btn-hd-addfav"></i>',
            'botId': 'addFavBot',
            'botContent': _addfav.title
        },
        download: {
            'display': (_browserData == 'download' ? ' style="display: none;"' : ''),
            'url': _download.url,
            'id': 'shortCut',
            'retrn': '',
            'content': _download.content || '<i class="userbar-btn-hd-down"></i>',
            'botId': 'shortCutBot',
            'botContent': '<a href="' + _download.url +'">' +_download.title +'</a>'
        },
        sethome: {
            'display': (_browserData == 'sethome' ? ' style="display: none;"' : ''),
            'url': _sethome.url,
            'id': 'setHome',
            'retrn': ' onclick="return false;"',
            'content': _sethome.content || '<i class="userbar-btn-hd-sethome"></i>',
            'botId': 'setHomeBot',
            'botContent': _sethome.title
        }
    },
    _tplGroup    = '',
    curObj       = null,
    wrap         = $("#userbarBtnHd");

for (var m = 0, n = _browser.length; m < n; m++) {
    curObj = _browser[m];
    _tplGroup += helper.replaceTpl(_itemTpl, _itemMsg[curObj]);
}
wrap.html(_tplGroup);

//userbar buttons
var userbarBtn = function () {
    var bdy   = $(document.body),
        splt  = wrap.find(".userbar_split");
    var tmpObj = wrap.find(".userbar-btn-hd_item").filter(function(index) {
        return $(this).css("display") == "none";
    });

    splt.last().remove();
    if(tmpObj.next(".userbar_split").length) {
        tmpObj.next(".userbar_split").css("display", "none");
    } else {
        tmpObj.prev(".userbar_split").css("display", "none");
    }
    splt = wrap.find(".userbar_split");

    wrap.on("click", ".userbar-btn-hd_item-anchor, .userbar-btn-hd_item-tips p", function(e) {
        var curTarget = $(this),
            curAttr   = curTarget.attr("id").replace(/Bot/, "");

        if (/addFav/i.test(curAttr)) {
            curTarget.addfav(_addfav.error, window.location.href);
        } else if (/setHome/i.test(curAttr)) {
            if (isShowFf && setFfHome) {
                if (isRended) {

                } else {
                    setFfHome.init(wrap, _ffCon);
                    isRended = true;
                }
                setFfHome.toggle({});
                e.stopPropagation();
            } else {
                curTarget.sethome();
            }
        }
        if (curTarget.get(0).tagName === "A") {
            UT.send({
                position: "sethp-btn",
                sort: curAttr,
                type: "click",
                modId: "sethp-btn"
            });
        } else {
            UT.send({
                position: "sethp-btn",
                ac: "b",
                sort: curAttr,
                type: "click",
                modId: "sethp-btn"
            });
        }
        
    });

    $(".userbar-btn-hd_item", wrap).on("mouseenter", function() {
        var obj = $(this);
        obj.children(".userbar-btn-hd_item-tips").show();
        obj.children(".userbar-btn-hd_item-anchor").addClass('module-mask');
        if(bdy.hasClass("header-fixed-up")) {
            obj.next(".userbar_split").css("visibility", "hidden");
            obj.prev(".userbar_split").css("visibility", "hidden");
        } else {
            splt.css("visibility", "hidden");
        }
        
    }).on("mouseleave", function() {
        var obj = $(this);
        obj.children(".userbar-btn-hd_item-tips").hide();
        obj.children(".userbar-btn-hd_item-anchor").removeClass('module-mask');
        if(bdy.hasClass("header-fixed-up")) {
            obj.next(".userbar_split").css("visibility", "visible");
            obj.prev(".userbar_split").css("visibility", "visible");
        } else {
            splt.css("visibility", "visible");
        }
    });

    $(window).load(function() {
        if (isShowFf && ($("#setHome", wrap).length > 0) && setFfHome && !isRended) {
            setFfHome.init(wrap, _ffCon);
            isRended = true;
        }
    });
};
module.exports = userbarBtn;