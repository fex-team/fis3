/*
*   User Bar Buttons
*   V2.1.0
*/

var $ = require("common:widget/ui/jquery/jquery.js");
require("common:widget/ui/jquery/widget/jquery.sethome/jquery.sethome.js");
require("common:widget/ui/jquery/widget/jquery.addfav/jquery.addfav.js");

var isFirefox = /firefox/.test(navigator.userAgent.toLowerCase()),
    _FfCon    = conf.setHomeOnFf,
    isShowFf  = (isFirefox && _FfCon && (_FfCon.isHidden === "0") && (conf.userbarBtn.isSetHomeFf === "1")),
    setFfHome = null,
    isRended  = false;

if (isShowFf) {
    require.async("common:widget/ui/sethome-ff/sethome-ff-c.js", function(init) {
        setFfHome = init;
        _FfCon.num = 1;
    });
}

//userbar buttons
var userbarBtn = function() {
    var _conf = conf.userbarBtn,
        wrap = $("#userbarBtn"),
        curTarget,
        curAttr;

    wrap.on("click", "a", function(e) {
        curTarget = $(this);
        curAttr = curTarget.attr("id");
        if (/addFav/i.test(curAttr)) {
            curTarget.addfav(_conf.addFavText, window.location.href);
        } else if (/setHome/i.test(curAttr)) {
            if (isShowFf && setFfHome) {
                if (isRended) {

                } else {
                    setFfHome.init(wrap, _FfCon);
                    isRended = true;
                }
                setFfHome.toggle({});
                e.stopPropagation();
            } else {
                curTarget.sethome();
            }
        }
        
        UT.send({
            position: "sethp-btn",
            sort: curAttr.replace(/02/, ""),
            type: "click",
            modId: "sethp-btn"
        });
    });

    $(window).load(function() {
        if (isShowFf && ($("#setHome02", wrap).length > 0) && setFfHome && !isRended) {
            setFfHome.init(wrap, _FfCon);
            isRended = true;
        }
    });
};
module.exports = userbarBtn;