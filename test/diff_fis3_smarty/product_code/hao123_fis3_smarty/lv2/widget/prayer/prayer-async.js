var cycletabs = require('common:widget/ui/cycletabs/cycletabs.js');
var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var helper = require("common:widget/ui/helper/helper.js");

!function() {
    var _conf = conf.prayer,
        $prayer = $("#muslimPrayer"),
        radios = $prayer.find(".vote-radio");

    function init() {
        preloadImgs();
        initScroll();
        bindEvents();
    }


    function initScroll() {
        var cycleTab = new cycletabs.NavUI(),
            imgs = renderImgs(),
            wrap = $prayer.find(".scroll-wrap"),
            options = {
                offset: 0,
                navSize: 1,
                itemSize: 960,
                autoScroll: !!_conf.autoScroll || false,
                autoScrollDirection: conf.dir == 'ltr' ? 'forward' : 'backward',
                autoDuration: _conf.autoDuration || 5000,
                scrollDuration: 500,
                quickSwitch: true,
                containerId: wrap,
                defaultId: 1,
                dir: conf.dir,
                data: imgs
            };

        cycleTab.init( options );
    }

    function renderImgs() {
        var imgTpl = '<img class="bkimg" src="#{src}" />',
            imgs = _conf.bkimgs,
            len = imgs.length,
            result = [];

        for ( var i = 0; i < len; i++ ) {
            var dom = helper.replaceTpl(imgTpl, { "src": imgs[i].src });
            result.push( { "content": dom, "id": i + 1 } );
        }

        return result;
    }

    function preloadImgs() {
        var imgs = _conf.bkimgs,
            len = imgs.length;

        for ( var i = 1; i < len; i++ ) {
            var img = new Image();
            img.src = imgs[i].src;
        }
    }

    function sendLog( position, sort ) {
        var params = {};

        params.modId = "muslim-prayer";
        params.position = position;
        params.ac = "b";
        sort && ( params.sort = sort );

        UT.send( params );
    }

    function bindEvents() {
        radios.eq(0).addClass("vote-radio_check");
        $prayer
            //投票选项
            .on("click", ".vote-radio", function() {
                radios.removeClass("vote-radio_check");
                $(this).addClass("vote-radio_check");
                sendLog( "voteSelect", $(this).next().text() );
            })
            //提交投票
            .on("click", ".vote-submit", function() {
                if ( $(this).hasClass("sub-btn_click") ) {
                    return;
                }
                $(this).addClass("sub-btn_click");
                sendLog( "vote", $(".vote-radio_check + span").text() );
            })
            //反馈提示语
            .on("click", ".tip", function() {
                $(this).hasClass("tip-feed") ? $(".textarea").focus() : $(".email").focus();
                $(this).remove();
            })
            //反馈区
            .on("focus", ".textarea", function() {
                $(".tip-feed").remove();
            })
            //邮箱地址
            .on("focus", ".email", function() {
                $(".tip-email").remove();
            })
            //提交反馈
            .on("click", ".feedback-submit", function() {
                sendLog("feedback");
                $("form").submit();
            })
            //切换图片
            .on("click", ".ui-nav p", function() {
                sendLog("switchImgs");
            })
            .on("mouseover", ".switch-item", function() {
                !$(this).hasClass("switch-item-current") && sendLog("switchImgs");
            });

    }

    init();
}();
