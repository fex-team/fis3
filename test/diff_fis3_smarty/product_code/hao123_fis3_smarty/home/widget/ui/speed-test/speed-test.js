var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var helper = require('common:widget/ui/helper/helper.js');

/**
 * speed test init function
 * @param  {[type]} opt [description]
 * @param  {[type]} el  [description]
 * @return {[type]}     [description]
 */
var SpeedTest = function() {};
var speedTestInit = function(opt, el) {
    el = $(el || this);
    opt = $.extend({
        info: el.find(".speed-test_info")
        , btnStart: el.find(".speed-test_start")

        , btnHide: el.find(".speed-test_hide")

        , btnShow: el.find(".speed-test_show")

        , btnFbShare: el.find(".speed-test_fbsharebtn")

        , barProgress: el.find(".speed-test_progress")

        , needle: el.find(".speed-test_needle")

        , infoType: el.find(".speed-test_type")

        , resultChart: el.find(".speed-test_chart")

        // , realtime: el.find(".speed-test_realtime")

        , resultDown: el.find(".speed-test_result_down")
        , resultUp: el.find(".speed-test_result_up")

        , resultBandWidth: el.find(".speed-test_result_bandwidth")

        , realTimeBandWidth: el.find(".speed-test_bandwidth")

        // js/php path
        , jsUrl: "js/speedtest.js?20130105"
        // , jsUrl: "js/speedtest.js"
        , phpUrl: "spd.php"
        , speedResult: {}
//        , getIpUrl: "http://jsonip.com"

        // defaule req size(b)

        /**
         * the request data length of GET method
         * @type {Number}
         * @default 500000
         */
        , getSize: 500000
        , postSize: 500000

        /**
         * dialQueue
         * @type {Array}
         * 0 ~ 100 Mbps ==> 0 ~ 235 deg
         * 0 ==> 0
         * 1 ==> 30
         */
        , dialQueue: [0, 1 , 5, 10, 20, 30, 50, 75, 100]

        , angleMax: 235

        // too slow to fallback(b)
        , getSizeFallback: 200
        , postSizeFallback: 200

        // num of test time
        , getTimes: 3
        , postTimes: 0

        // fix result(*)
        , fixResult: 1

        // remainder
        , remainder: 1

        // timeout for all test (ms)
        , testTimeout: 60*1*1000

        , supportCanvas: !!document.createElement('canvas').getContext

        , textDefault: "Speedtest"
        // , textStart: "Begin test"
        , textStart: "Test again"
        , textLoading: "Loading..."
        , textTesting: "Testing..."
        , textError: "Network error, please try again later."
        // , textError: "Ồ, rất tiếc đã có lỗi, bạn hãy thử lại nhé!"
    }, opt);

    // opt.info.html("当前平均 N/A k/s");
    opt.btnStart.html(opt.textDefault);

    opt.info.html(opt.textError);

    // update ip
//    $.ajax({
//        url: opt.getIpUrl,
//        dataType: "jsonp",
//        // jsonpCallback: "updateIp",
//        success: function(data) {
//            $(".speed-test_ip span").html(data.ip)
//        }
//    });
    $(".speed-test_ip span").html(opt.userip);

    // init VML
    !opt.supportCanvas && function(DOC, $obj, vmlStyle) {
        DOC.namespaces && !DOC.namespaces["v"] && DOC.namespaces.add("v", "urn:schemas-microsoft-com:vml");
        vmlStyle = DOC.createElement("style");
        vmlStyle.setAttribute("type","text/css");
        vmlStyle.styleSheet.cssText = 'v\\:* { Behavior: url(#default#VML) } v\\:shape{position:absolute;} v\\:rect,v\\:rect,v\\:imagedata { display:inline-block }';
        DOC.getElementsByTagName("head")[0].appendChild(vmlStyle);
        var vmlNode = DOC.createElement("v:rect"),
            imagedataNode = vmlNode.appendChild(DOC.createElement("v:imagedata"));
        vmlNode.style.cssText = 'position:absolute;width:166px;height:20px;' + 'top:' + $obj.css("top") + ';' + 'left:' + $obj.css("left") + ';rotation:6;';
        vmlNode.stroked = vmlNode.filled = false;
        imagedataNode.src = $obj.css("background-image").replace('url("','').replace('")','');
        $obj.hide();
        $obj[0].parentNode.insertBefore(vmlNode, $obj[0]);

        // update needle
        opt.needle = $(vmlNode);
    }(document, opt.needle);

    opt.btnHide.click(function(e) {
        el.removeClass("speed-test--result").addClass("speed-test--hide");
    });

    opt.btnShow.click(function(e) {
        opt.resultBandWidth.html() !== "N/A" && el.addClass("speed-test--result");
        el.removeClass("speed-test--hide");
    });

    // click to init
    opt.btnStart.click(function(e) {
        var $this = $(this);

        !!$this.data("loadstate")
        ? SpeedTest.start && SpeedTest.start(el, opt)

        // load begin
        // loadstate: 0 || undefined ==> not begin, 1 ==> begin loading, 2 ==> loaded
        : ($this.html(opt.textLoading).data("loadstate", 1)
        ,

        require.async('home:widget/ui/speed-test/speed-test-core.js', function(speedTest) {
            // module.exports
            SpeedTest = speedTest;

            // load complete
            $this.html(opt.textTesting).data("loadstate", 2);
            el.removeClass("speed-test--cover");
            speedTest && speedTest.start(el, opt);
        }));

        /*$.ajax({
            url: opt.jsUrl,
            // url: "/static/widget/home/speed-test/speed-test.js",
            dataType: "script",
            cache: true,
            success: function() {
                // load complete
                $this.html(opt.textTesting).data("loadstate", 2);
                el.removeClass("speed-test--cover");

                alert($.xx)
                // $.speedTest && $.speedTest.start(el, opt);
            },
            error: function() {
                $this.data("loadstate", 0)
            }
        }));*/
        return !1;
    });

    // click to share on facebook
    if(opt.fbShare){
        $.extend(opt,{
            // 是否需要画图
            supportDraw: true,
            // 画图需要用到的数据
            data: opt.speedResult,
            // 分享按钮不可用状态对应的类名
            disableClass: "speed-test_fbshare-disable",
            // 业务定制的回调方法
            callback: {
                // 初始化画布上的元素
                initComponent: function(draw){
                    // var bg,grade;
                    draw.bg = new Image();
                    draw.bg.src = "/resource/fe/speedtestshare/fb-share-bg-n.png";
                    //grade icon
                    draw.grade = new Image();
                    draw.grade.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAaCAMAAACEqFxyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjlGMDc3MkY1NTM0OTExRTNBNkQ3ODAwNUNEMEU0RTgzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjlGMDc3MkY2NTM0OTExRTNBNkQ3ODAwNUNEMEU0RTgzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OUYwNzcyRjM1MzQ5MTFFM0E2RDc4MDA1Q0QwRTRFODMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OUYwNzcyRjQ1MzQ5MTFFM0E2RDc4MDA1Q0QwRTRFODMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7+P70WAAABgFBMVEX2+/5nlifk4trZ4djZy63bxIx8rDKpzWv/8831032qvZl3nTXt8fXwzXz67MeFpF3e0bXixH3u7/CDsjXy9vv7/P+jqlndz7D79//h2cbDuo/bvXnh5eO7unuUrXWArzXe5eCOvzzkxnb/7LT/45eIpUjatmrpznW9zK/m6eqcs33r37bOvZSJtzrg173u7+v/7byPrWHz+P//34n39/7o6+/w9//vz3eNq2jv8/qdt3WRvkD/3YLh2cnc0bquwJz/5IravoCu022euXXnx3P62oLx8vTu0XugunhwoTDcxpX09PvZx5/r7Ovrx3fjwm7UuoLoy3X41oCJpmHgwnSSwkD73YVumy6awVjXyZOYv1jLx5Hl4NfnynHLrXHOtH6ftoWXu2KrtGbf1sSSrm3qx3uzsWt6pTF9qT6CsjnsznnVx6nbzqP32H2csE2lvIPu3a/w5L383o/42I7W0KLSt4PRu46Vt3bsy3b63Zb00XeGpmXUuHf/3ob///////8bFIMiAAAAgHRSTlP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ADgFS2cAAAG6SURBVHjaTNIJU5tAFADghSQcQhIgEEqjJWoUoxLjgkHMneId7yNq7Wlbe993pfvXXRKhvp19M/vNztu3swsQDtm2ZTyDUEAACGcZTQ3haDabOA1NzdkDvlN8Pr92fykYS2vzf2P/Ij7r0DT9lO7QnZODkMHCIjVaPaIIvVodpdLDtzijUz2iR+nmf1YWFjM6xixH9F7rB7fZXCcm3mWJdTOTzkecpqoUMZI65fQjKmKbn740Ke4bM5M1TW5aUgaMNmMfX10++8ykTj9wT/L24JauDGH+58SDFMN8enkvpgAIAOaLeFxo3B2ZYRgmtTGrCoKq1jE3Hk163vbXcczl39venjf5WEOA3+qKtZZvFcpMuWD5rRYrllZkXLvYfXFs+bXCeKHm+37yqgGD2sglE0m8rn3ByWJzb1dAv0G3crHLWtayEyQxzoObvmFxNmn5q3tvli22TSo3r4Mqwz+SPmsYxurxfvscREx+d94bjuMY7L6owYjPd385D8fEQ8/5I5bkkF2tvXOYUDV1I7czpoZH8nzpqq3WJbhJColcVwo7QVq8LvW/ByIFYQ6GvOVWBooglPobrgUYADYsmEcloAmcAAAAAElFTkSuQmCC";
                },
                // 画图方法
                drawResult: function(draw,result){
                    // 背景图
                    var //opt = this.opt,
                        ctx = draw.ctx,
                        width = draw.canvasWidth,
                        height = draw.canvasHeight,
                        grade = draw.grade;
                    ctx.drawImage(draw.bg,5,0,width,height,0,0,width,height);
                    // download & bandwidth
                    ctx.fillStyle = "#fff";
                    ctx.font = "18px Tahoma";
                    ctx.textAlign = "right";
                    var bandWidthStart = 75;
                    var bandWidthWidth = 122;
                    var downloadStart = bandWidthStart + bandWidthWidth;
                    var bandWidthTop = 80;
                    ctx.fillText(result.bandwidth,bandWidthStart,bandWidthTop);
                    ctx.fillText(result.download,downloadStart,bandWidthTop);
                    ctx.textAlign = "left";
                    ctx.font = "12px arial,Tahoma,helvetica,clean,sans-serif";
                    ctx.fillText(opt.tplTitle,70,19);
                    ctx.font = "italic 12px arial";
                    ctx.fillText("Mbp/s",bandWidthStart + 3,bandWidthTop);
                    ctx.fillText("KB/s",downloadStart + 3,bandWidthTop);
                    // li's dot icon
                    ctx.beginPath();
                    var dotStart = (conf.dir === "ltr" ? 5 : 225);
                    var dotTop = 125;
                    ctx.arc(dotStart,dotTop,2,0,Math.PI*2,true);
                    ctx.arc(dotStart,dotTop+30,2,0,Math.PI*2,true);
                    ctx.closePath();
                    ctx.fillStyle = "#000";
                    ctx.fill();

                    // grade part
                    ctx.fillStyle = "#474748";
                    ctx.textAlign = (conf.dir === "ltr" ? "left" : "right");
                    ctx.font = "12px arial,Tahoma,helvetica,clean,sans-serif";
                    var txtGrade = opt.tplGrade.split("#{star}")[conf.dir === "ltr" ? 0 : 1];
                    tm = ctx.measureText(txtGrade);
                    var mainStart = 10;
                    var mainTop = 130;
                    mainStart = (conf.dir === "ltr" ? mainStart : width - mainStart);
                    ctx.fillText(txtGrade,mainStart,mainTop);
                    var gradeWidth = 22;
                    var gradeHeight = 26;
                    var gradeTop = 110;
                    for(var i=result.grade;i;i--){
                      conf.dir === "ltr" && ctx.drawImage(grade,0,0,gradeWidth,gradeHeight,mainStart+tm.width+(gradeWidth+3)*(i-1),gradeTop,gradeWidth,gradeHeight);
                      conf.dir === "rtl" && ctx.drawImage(grade,0,0,gradeWidth,gradeHeight,mainStart-tm.width-(gradeWidth+3)*i,gradeTop,gradeWidth,gradeHeight);
                    }
                    // faster part
                    var txtFaster1 = opt.tplFaster.split("#{percent}")[0];
                    var tm1 = ctx.measureText(txtFaster1);
                    ctx.fillText(txtFaster1,mainStart,mainTop+30);
                    ctx.font = "bold 18px Tahoma";
                    ctx.fillStyle = "#FF1F19";
                    var txtFaster2 = opt.tplFaster.split("#{percent}")[1];
                    var dataFaster = result.faster;
                    var tm2 = ctx.measureText(dataFaster);
                    conf.dir === "ltr" && ctx.fillText(dataFaster,mainStart+tm1.width,mainTop+30);
                    conf.dir === "rtl" && ctx.fillText(dataFaster,mainStart-tm1.width,mainTop+30);
                    ctx.font = "12px arial,Tahoma,helvetica,clean,sans-serif";
                    ctx.fillStyle = "#474748";
                    conf.dir === "ltr" && ctx.fillText(txtFaster2,mainStart+tm1.width+tm2.width,mainTop+30);
                    conf.dir === "rtl" && ctx.fillText(txtFaster2,mainStart-tm1.width-tm2.width,mainTop+30);
                }
            }
        });
        require.async('home:widget/ui/fb-feed/fb-feed.js',function(){
            opt.btnFbShare.bindFBShare(opt);
        });
    }

    el.on("mousedown", function(e) {
        UT && $(e.target)[0] !== opt.btnStart[0] && UT.send({type: "click", sort:"sideSpd", value: "spdMod","modId":"speedtest"});
    });
};

module.exports = speedTestInit;
