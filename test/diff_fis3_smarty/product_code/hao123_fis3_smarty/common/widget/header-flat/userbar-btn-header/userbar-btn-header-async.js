/*
*   User Bar Buttons
*   html改为JS动态拼接
*/

var $      = require("common:widget/ui/jquery/jquery.js");
var UT     = require("common:widget/ui/ut/ut.js");
var helper = require("common:widget/ui/helper/helper.js");
require("common:widget/ui/jquery/widget/jquery.sethome/jquery.sethome.js");
require("common:widget/ui/jquery/widget/jquery.addfav/jquery.addfav.js");

var  _conf     = conf.userbarBtnHd;


_conf.browser.reverse();

var _browser     = _conf.browser,
    _addfav      = _conf.addfav,
    _download    = _conf.download,
    _sethome     = _conf.sethome,
    _browserData = _conf.browserData,
    _itemTpl     = '<div class="btn-item"#{display}><a href="#{url}" id="#{id}" class="btn-item-anchor"#{retrn}>#{content}</a><div class="btn-item-tips"><p id="#{botId}">#{botContent}</p></div></div>',
    _itemMsg     = {
        addfav: {
            'display': (_browserData == 'addfav' ? ' style="display: none;"' : ''),
            'url': _addfav.url,
            'id': 'addFav',
            'retrn': ' onclick="return false;"',
            'content': _addfav.content || '<i class="btn-addfav"></i>',
            'botId': 'addFavBot',
            'botContent': _addfav.title
        },
        download: {
            'display': (_browserData == 'download' ? ' style="display: none;"' : ''),
            'url': _download.url,
            'id': 'shortCut',
            'retrn': '',
            'content': _download.content || '<i class="btn-down"></i>',
            'botId': 'shortCutBot',
            'botContent': '<a href="' + _download.url +'">' +_download.title +'</a>'
        },
        sethome: {
            'display': (_browserData == 'sethome' ? ' style="display: none;"' : ''),
            'url': _sethome.url,
            'id': 'setHome',
            'retrn': ' onclick="return false;"',
            'content': _sethome.content || '<i class="btn-sethome"></i>',
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
var userbarBtn = function() {
    wrap.on("click", ".btn-item-anchor, .btn-item-tips p", function(e) {
        var curTarget = $(this),
            curAttr = curTarget.attr("id").replace(/Bot/, "");

        if (/addFav/i.test(curAttr)) {
            curTarget.addfav(_addfav.error, window.location.href);
        } else if (/setHome/i.test(curAttr)) {
            curTarget.sethome();
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
};
module.exports = userbarBtn;