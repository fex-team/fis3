String.prototype.replaceTpl = function(o) {
    return this.replace(/#\{([^}]*)\}/gm, function(v, k) {
        return v = o[k] || ""
    })
}

var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');

var appid, appURL, appHeight;
var extApp = {};
extApp.config = {
    minHeight: 500,
    tpl: {
        applist: '<li class="app-item" data-app-type="app" data-app-appid="#{app_id}" data-app-url="#{redirect_uri}"><img class="app-icon" src="#{icon_35}" al="icon" /><h3 class="app-name">#{app_name}</h3><p class="app-type">#{app_name}</p></li>'
    }
};
extApp.searchObj = {};
extApp.parseUrl = function() {
    var searchStr = location.search;
    var searchArr = [];
    var searchItem = {};
    if (searchStr && (searchStr = searchStr.substring(1))) {
        searchArr = searchStr.split("&");
        for (var i = searchArr.length - 1; i >= 0; i--) {
            searchItem = searchArr[i].split("=");
            extApp.searchObj[searchItem[0]] = searchItem[1];
        }
    }
};
extApp.getJumpUrl = function(appid) {
    var search;
    var hash;
    var appHref = "";
    if (location.search) {
        if (extApp.searchObj.appid) {
            search = location.search.replace(/appid=\d+/, "appid=" + appid);
        } else {
            search = location.search + "&appid=" + appid;
        }
    } else {
        search = "?appid=" + appid;
    }
    appHref = location.protocol + "//" + location.host + location.pathname + search + "#lv2_app_canvas";
    return appHref;
};
extApp.getCurrentAppInfo = function(appInfoList) {
    appid = 0;
    var appInfo = {};
    extApp.parseUrl();
    if (extApp.searchObj["appid"]) {
        appid = parseInt(extApp.searchObj["appid"]);
    }
    for (var i = appInfoList.length - 1; i >= 0; i--) {
        appInfo = appInfoList[i];
        if (appInfo.hasOwnProperty("appid") && appInfo.appid == appid) {
            return appInfo;
        }
    }
    return appInfoList[0];
};
extApp.update = function(appURL, height) {
    //update canvas
    var appHeight = Math.max(height, extApp.config.minHeight);
    $('#lv2AppCanvas').attr('src', appURL).attr('height', appHeight);

    //update height
    $('#lv2AppList').css('height', appHeight - 17);
    $('#lv2AppCanvasWrapper').css('height', appHeight);
};
extApp.bindEvent = function(data,isDefault) {
    //bind Event for log
    function checkAppShow() {
        var height = 700;
        var appTop = $('#lv2AppList').position().top;
        var midLine = appTop + height / 2;
        if ($(window).scrollTop() + $(window).height() > midLine) {
            if(location.search!==''){
                UT.send({
                    type: "scroll",
                    position: "app-canvas",
                    modId: 'mod-lv2-app',
                    appid: appid
                }); //log   
            }else{
                UT.send({
                    type: "scroll",
                    position: "app-canvas",
                    modId: 'mod-lv2-app',
                    appid: data.content.data[0].app_id
                });
            }
            $(window).off('scroll.AppMid');
        }
    }
    $(window).on('scroll.AppMid', checkAppShow);
    checkAppShow();

    $('#lv2AppList').on('click', '.app-item', function(e) {
        var $li = $(this);
        var appType = $li.attr('data-app-type');
        var appLinkJump = isDefault +"/"+ $li.attr('data-app-appid');
        /*var appLinkJump = "http://"+ location.host.substring(0,2) + ".apps.hao123.com/"+ $li.attr('data-app-appid');*/
        if (appType == 'link') {
            var appLink = $li.attr('data-app-url');
            UT.send({
                type: "click",
                ac: "b",
                position: "app-list",
                url: appLink,
                element: "app-item-link",
                modId: 'mod-lv2-app'
            }); //log
            window.open(appLink);
        }else if (appType == 'app') {
            //var appid = $li.attr("data-app-appid");
            window.open(appLinkJump);
            //location.href = extApp.getJumpUrl(appid);
        }
    });
};
//重绘方法
/*
    点击排序按钮=》
        1. 切换向上向下的箭头
        2. 清空app列表
        3. 重新执行初始化方法，传入相对应的参数值
*/

//初始化方法
/*
    发送jsonp请求后端推送数据=》
        1.传入三个参数分别为 type =》 请求分类的类型 、 country =》 国家 、 order =》 排序方式 （1为正排、2为反排）
        2.成功返回数据后，执行渲染方法
*/
extApp.init = function(currentAppInfo,type,country,order,isLoad,preUrl,isDefault) {
    extApp.config.order = order;
    extApp.config.currentAppInfo = currentAppInfo;

    var order = (location.href.match(/order=(\d+)/) || [])[1] || order || "1";

    if (!currentAppInfo) {
        return;
    }
    if(isLoad != '1'){
        $(".mod-lv2-app").hide();
    }
    if(order == 1) {
        $(".bg-up-down").addClass("sort_up_down");
    }
    else {
        $(".bg-up-down").removeClass("sort_up_down");
    }

    $("#lv2AppList .default_asc").click(function(argument) {

        var href = location.href,
            _order = order == 1 ? "2" : "1";

        href = /\?/.test(href)
        ? href.replace(/order=\d+&?/, "").replace("?", "?order=" + _order + "&").replace(/&$/, "")
        : href += "?order=" + _order;
        location.href = href;
    });

    $.ajax({
        async: false,
        url: preUrl+"/api.php?app=webapp&type="+type+"&act=contents&country="+country+"&order="+order+"&jsonp=ghao123_d251a1d7fc7a0ef5&_=1374221628257",
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "ghao123_d251a1d7fc7a0ef5",
        success: function(data) {
            extApp.renderAppList(data, currentAppInfo,isDefault);
        },
        error: function() {
            
        }
    });
};
//渲染方法
/*
    1.传入数据待遍历
    2.preId记住上次的id值
    3.首先判断后端拿回来的数据是否大于10条，大于10条显示“more”按钮
    4.循环数据，将返回的数据插入到App列表中(记录之前的appid值，重绘页面的时候将相对应的URL切换为新的iframe的src属性值)
*/
extApp.renderAppList = function(data, currentAppInfo,isDefault) {
    var tmpHtml = [],
        content = data.content,
        preId = extApp.searchObj.appid,
        switchId;
    //默认加载第一项
    $("#lv2AppCanvas").attr("src",data.content.data[0].redirect_uri);

    $("#charts_more")[content.total > 10 ? "show" : "hide"]();

    for (var i = 0, l = content.data.length; i < l ; i++) {
        tmpHtml.push(extApp.config.tpl.applist.replaceTpl(content.data[i]));
        switchId = content.data[i].app_id;
        // appURL = content.data[i].redirect_uri;
        if(preId === switchId) appURL = content.data[i].redirect_uri;
    };
    /*if(!preId){
        appURL = content.data[0].redirect_uri;
        appid = content.data[0].app_id;
    }*/
    //拼装模板
    $("#lv2AppList ul").append(tmpHtml.join(""));

    //将对应的appid项添加高亮属性
    /*if(!preId){
        $('#lv2AppList').find('[data-app-appid=' + appid + ']').addClass('current');
    }*/
    
    $("#lv2AppList ul li").eq(0).addClass("current");

    if(location.search!==''){
        $("#lv2AppList ul li").eq(0).removeClass("current");
        $('#lv2AppList').find('[data-app-appid=' + preId + ']').addClass('current');
    }
    /*appid = currentAppInfo.appid;
        appURL = currentAppInfo.url +'&country='+currentAppInfo.country+'&appid='+appid;*/
    extApp.bindEvent(data,isDefault);
    extApp.update(appURL, currentAppInfo.height);
};

module.exports = extApp;
