var $ = jQuery = require("common:widget/ui/jquery/jquery.js");
var UT = require("common:widget/ui/ut/ut.js");


var getFavIconUrl = function(url) {
    prohost = url.match(/([^:\/?#]+:\/\/)?([^\/@:]+)/i);
    prohost = prohost ? prohost : [true, "http://", document.location.hostname];
    //抓取ico
    return prohost[1] + prohost[2] + "/favicon.ico";
};
$("#hotsite li > span").hover(
    function() {
        var thisObj = $(this),
            position = thisObj.find(".hotsite_link").position(),
            moreLinks = thisObj.children(".more_links"),
            searchForm = thisObj.children(".search-form"),
            searchFormInput = searchForm.find(".search-form-input-text"),
            tips = searchForm.find(".tips");

        thisObj.addClass("hotsite_hover");
        //有快速搜索功能的时候起作用
        if (searchForm.length) {
            //统一设置样式会影响下拉标签的布局，所以这里按需手动设置
            searchForm.css({
                "left": position.left,
                "top": position.top + thisObj.height() * 0.71
            });
            thisObj.find(".span-hot-name").css("visibility", "hidden");
            searchForm.show();
            searchFormInput.focus();
            if (tips.length) {
                tips.show();
            }
        }
        if (moreLinks.length) {
            moreLinks.css({
                "left": position.left,
                "top": position.top + thisObj.height()
            });
            moreLinks.find("img").each(function() {
                var that = $(this);
                if (that.attr('customsrc')) {
                    that.attr("src", that.attr('customsrc'));
                } else {
                    that.attr("src", getFavIconUrl(that.parent().attr('href')));
                }
            });
            moreLinks.show();
        }

    },
    function() {
        var thisObj = $(this);

        thisObj.removeClass("hotsite_hover");

        var searchForm = thisObj.children(".search-form");
        var searchFormInput = searchForm.find(".search-form-input-text");
        var tips = searchForm.find(".tips");
        thisObj.children(".more_links").hide();
        if (searchForm.length) {
            //不保留用户的搜索记录
            searchFormInput.val("");
            searchForm.hide();
            thisObj.find(".span-hot-name").css("visibility", "visible");
            if (tips.length) {
                tips.hide();
            }
            //首页主搜索框自动聚焦，恢复页面初始状态
            $("#searchGroupInput").focus();
        }
    }
);

// 移动动画效果
var glo = $("#hotsite"),
    classMap = {
        "hs-normal": "hs-show-normal",
        "hs-game": "hs-show-game",
        "hs-video": "hs-show-video"
    },
    classDel = {
        "hs-normal": "hs-show-game hs-show-video",
        "hs-game": "hs-show-video hs-show-normal",
        "hs-video": "hs-show-game hs-show-normal"
    };
glo.on("mouseenter", ".hs-each", function(e) {
    var that = $(this);
    if (that.hasClass('hs-normal')) {
        glo.removeClass(classDel['hs-normal']).addClass(classMap['hs-normal']);
    } else if (that.hasClass('hs-game')) {
        glo.removeClass(classDel['hs-game']).addClass(classMap['hs-game']);
    } else {
        glo.removeClass(classDel['hs-video']).addClass(classMap['hs-video']);
    }
});

/*处理搜索为空的情况和特殊的搜索url*/
$(".search-form form").submit(function(e) {
    var searchFormInput = $(this).children(".search-form-input-text");
    var pageUrl = $(this).parent().next(".hotsite_link").attr("href");
    UT.send({
        type: "click",
        ac: "b",
        position: "quicksearch",
        value: searchFormInput.val(),
        url: pageUrl,
        modId: "hotsites"
    });
    var req = /\?$/;
    var searchFormInputVal;
    var customParam = $(this).attr("customParam");
    //为空时直接跳转至对应链接首页
    if ((searchFormInput.val().replace(/\s/g, "").length == 0)) {
        window.open(pageUrl);
        return false;
    }

    if (!req.test($(this).attr("action"))) {
        if ( !! customParam) {
            searchFormInputVal = encodeURIComponent(customParam.replace("#{keyword}", searchFormInput.val()));
        } else {
            searchFormInputVal = searchFormInput.val();
        }
        window.open($(this).attr("action") + searchFormInputVal);
        e.preventDefault();
    }
    $("#searchGroupInput").focus();
    setTimeout(function() {
        $(".search-form").hide();
        $(".span-hot-name").css("visibility", "visible");
        $("#hotsite > span").removeClass("hotsite_hover");
    }, 100);
});
/*隐藏提示语*/
$(".search-form-input-text").keydown(function() {
    var tips = $(this).next(".tips");
    if (tips.length) {
        if (!($(this).val() < 0))
            tips.hide();
        else
            tips.show();
    }
});
PDC && PDC.mark("c_hsvi");
