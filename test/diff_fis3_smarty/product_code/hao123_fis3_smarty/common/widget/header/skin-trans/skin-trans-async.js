var $ = require("common:widget/ui/jquery/jquery.js");
var UT = require("common:widget/ui/ut/ut.js");
require("common:widget/header/skinbox/skinbox-async.js");
require("common:widget/header/skinbox/skin-mod.js");

var _conf = conf.skinTrans,
    d_skin = _conf.defaultSkin,
    d_word = _conf.defaultWords,
    d_icon = _conf.defaultIcon,
    d_freq = parseInt(_conf.frequency, 10),
    t_word = _conf.transWords,
    t_icon = _conf.transIcon,
    $wrap = $("#" + _conf.id),
    $btn = $wrap.find(".i-st-btn"),
    $icon = $wrap.find(".i-st-ico"),
    $tip = $wrap.find(".i-st-tip"),
    $win = $(window);

var modId = "skin-trans",
    isFirst = 0,
    dataGroup = [];

var controller = {
    init: function() {
        var that = this;
        if (d_skin == that.getCurrentSkin()) {
            t_icon && $icon.css("background-image", "url(" + t_icon + ")");
            t_word && $tip.html(t_word);
        } else {
            d_icon && $icon.css("background-image", "url(" + d_icon + ")");
            d_word && $tip.html(d_word);
        }
        that.fixSkin();
        that.bindEvent();
    },
    fixSkin: function() {
        var data = conf.skin.data,
            len = data.length;
        for (var i = 0; i < len; i++) {
            dataGroup.push(data[i].key);
        }
        if (d_freq > 0) {
            for (var j = 0; j < d_freq; j++) {
                dataGroup.push("no");
            }
        }
    },
    getRandomSkin: function() {
        var that = this;
        !dataGroup.length && that.fixSkin();
        return dataGroup.splice(parseInt(dataGroup.length * Math.random(), 10), 1);
    },
    getCurrentSkin: function() {

        var skin = $.store("lastSkin") || $.cookie("lastSkin");
        if (skin) {
            skin = skin.split("|")[0];
        }
        return skin || "no";
    },
    bindEvent: function() {
        var that = this;
        $btn.on("click", function(e) {
            ++isFirst;
            if (isFirst === 1 && d_skin != that.getCurrentSkin()) {
                $win.trigger( "skinTrans.recommendedSelect" );
                t_word && $tip.html(t_word);
                // 切换到推荐皮肤
                $win.trigger("skin.change", d_skin);
            } else {
                // 随机切换皮肤
                $win.trigger("skin.change", that.getRandomSkin());
            }
            UT.send({
                type: "click",
                modId: modId,
                position: "btn",
                ac: "b"
            });
        });
        $win.on("beforeunload", function() {
            UT.send({
                type: "others",
                modId: modId,
                position: that.getCurrentSkin()
            });
        });
        // 提供给外部使用
        $win.on( "skinTrans.recommendedSelect", function(){
            t_icon && $icon.css("background-image", "url(" + t_icon + ")");
        } );
    }
};

module.exports = controller;
