var $ = jQuery = require("common:widget/ui/jquery/jquery.js");
var helper = require("common:widget/ui/helper/helper.js");
var UT = require("common:widget/ui/ut/ut.js");
require("common:widget/ui/jquery/widget/jquery.ui.position/jquery.ui.position.js");
require("common:widget/ui/jquery/widget/jquery.ui.button/jquery.ui.button.js");
require("common:widget/ui/jquery/widget/jquery.ui.tip/jquery.ui.tip.js");
require("common:widget/ui/jquery/widget/jquery.ui.autocomplete/jquery.ui.autocomplete.js");
require("common:widget/ui/jquery/widget/jquery.ui.autocomplete.html/jquery.ui.autocomplete.html.js");
 $(function(){
         //测试是否支持cookie
        jQuery.cookie("supportCookie",true);
        var supportCookie = !!jQuery.cookie("supportCookie"),
            defaultImg = conf.customSite.defaultIcon,
            template = '<a class="custom_item"  href="url" target="_blank" tabindex="-1"><span class="ico-txt"><img class="site-icon" src="imgUrl" '+ "onerror=this.src='"+ defaultImg +"';this.onerror=null;>name</span><i class='btn modify sprite-modify_normal'></i><i class='btn del sprite-del_normal'></i></a>",                      
            custom_list = $("#custom_list"),
            addBtn = $("#add-btn"),
            siteAddr = $("#website-address"),
            siteName = $("#website-name"),
            customForm = $("#customsite-con"),
            suggestUrl = conf.customSite.suggestUrl,
            btn_ok_txt = conf.customSite.btnOk,
            btn_cancel_txt = conf.customSite.btnCan,
            tipContent = conf.customSite.tipContent,
            recordUrl = "",
            customSiteList = 0,
            //用于suggest标识产品名称
            prod = "global_hao123_" + conf.country,
            //最多只能自定义10个
            maxSite = 10,
            modifiedIndex = -1,
            forTn = $("<div>"),
            query = helper.getQuery(),
            tn = query.tn;
        // Customize hotsite's links according to tn query
        forTn.append($(".hotsite-for_tn"));

        tn && forTn.children().each(function () {
            var that = $(this),
                hotsiteEle = $(".hotsite > span"),
                dataTn = that.attr("data-tn").split("|"),
                dataPos = that.attr("data-pos");
            dataPos = dataPos >= 0 && dataPos < hotsiteEle.length ? dataPos : hotsiteEle.length - 1;
            for (var i = 0; i < dataTn.length; i++) {
                if (dataTn[i] === tn) {
                    that.css("display", "inline-block");
                    hotsiteEle.last().hide();
                    hotsiteEle.eq(dataPos).before(that);
                    break;
                }
            }
        });

        var getFavIconUrl = function(url){
            prohost = url.match(/([^:\/?#]+:\/\/)?([^\/@:]+)/i);
            prohost = prohost ?  prohost : [true,"http://",document.location.hostname];
            //抓取ico
            return  prohost[1] + prohost[2]  + "/favicon.ico";
        };
        //支持cookie才会用
        if( supportCookie ) {
            var first = jQuery.cookie("isOpensitelist");
            var customSite =  jQuery.cookie("customSite");
            var showContent = conf.customSite.showContent;
            var defaultIsShow = showContent ? parseInt( conf.customSite.showContent ) : 1;
            //无cookie时默认展开
            if(first === null || first === undefined) {
                // changed by chenliang PM配置默认展示还是隐藏
                first = defaultIsShow;
            }
            //用户上一次是否已经选择打开
            if (first & 1){
                custom_list.show();
                $("#custom_bar").addClass("bar_open");
            }
            try {
                if(window.localStorage) {
                    if(localStorage.getItem("customSite")) {
                    }else {
                        localStorage.setItem("customSite", customSite || '{"list":[]}');
                    }
                    //jQuery.cookie("customSite", null);
                    customSite = $.parseJSON(localStorage.getItem("customSite"));
                } else {
                    custom_list.parent().remove();
                    customSite = $.parseJSON('{"list":[]}');
                    //jQuery.cookie("customSite", null);
                }
            } catch(e) {
                 custom_list.parent().remove();
                 customSite = $.parseJSON('{"list":[]}');
                 //jQuery.cookie("customSite", null);
            }
            //添加用户已经定义的网站
            //customSite = $.parseJSON(customSite || '{"list":[]}');
            $.each(customSite.list, function( pos,siteInfo ){
                var temp = template.replace("url",siteInfo["url"])
                                   .replace("name",siteInfo["name"])
                                   .replace("imgUrl",siteInfo["imgurl"]);
                $(temp).insertBefore("#add-btn");
            });
            customSiteList = customSite.list.length;
            ( customSiteList < 10 ) &&  addBtn.show();
         
            $(document).mousedown( function(e){
                var target = $( e.target ),
                    autocompleteWidget = siteAddr.autocomplete("widget"),
                    isVisibleForm = customForm.is(":visible"),
                    isCloseCustomCon = customForm && !target.closest("#customsite-con").length && !target.closest("#add-btn").length && !target.closest( ".ui-menu-item",autocompleteWidget).length,
                    tipWidget = $("#tip").tip("widget"),
                    isCloseTip =  tipWidget.is(":visible") && !target.hasClass("del") && !target.closest(tipWidget).length;
                if ( isCloseCustomCon) {
                     customForm.hide();
                     siteAddr.autocomplete("close");
                  //解决网速比较慢的情况,防止suggest出现慢
                } else if( !isVisibleForm){
                     siteAddr.autocomplete("close");
                }
                 //关闭tip
                if ( isCloseTip ) {
                    $("#tip").tip("close");
                    $(".del",custom_list).removeClass("sprite-del_ative");
                }
            });
            //点击添加自定义条
            $("#custom_bar").click(function(e){
                var self = this;

                if(!$(self).hasClass("bar_open")) {
                    UT.send({
                        type:"click",
                        position:"folder",
                        sort: "open",
                        modId:"customsites"
                    });
                } else {
                    UT.send({
                        type:"click",
                        position:"folder",
                        sort: "close",
                        modId:"customsites"
                    });
                }
                custom_list.slideToggle("fast",function(){
                    var isFirst = jQuery.cookie("isOpensitelist"),
                        // changed by chenliang  PM配置默认展示还是隐藏
                        isOpen = (isFirst === null) ? ( defaultIsShow ? 0 : 1 ) : jQuery.cookie("isOpensitelist")^1;
                     $(self).toggleClass("bar_open");
                     //ie6 bug
                     custom_list.css('overflow', 'visible');
                     //记录用户的打开情况
                     jQuery.cookie("isOpensitelist",isOpen,{ expires:2000, path: '/'});
                });    
            });
            //suggest
            //百度suggest全局函数 。。。。。。。。。
            if ( !window.baidu ) {
                window.baidu = {};
            }
            window.baidu.sug = function( data ){
                var suggest = [],
                    l = data.s.length,
                    isVisibleForm = customForm.is(":visible");
                if ( (l > 0) && isVisibleForm ) {
                    var regEx = new RegExp("^" + custom_suggest_currentVal , "i");
                    $.each( data.s, function(key, val){

                        var lab = val.replace(regEx, "<span class='current-val'>" + custom_suggest_currentVal +"</span>");
                        suggest.push({ label:lab, value:val});
                    });
                    custom_suggest_resp(suggest);
                } else{
                     siteAddr.autocomplete("close");
                }
            }
            //测试数据
            var autoOpts = {
                source:function(req, resp){
                    var currentVal = req.term;
                    //全局表单列表,给回调函数
                    custom_suggest_resp = resp;
                    //全局记录表单输入当前值
                    custom_suggest_currentVal = currentVal;
                    $.ajax({
                        dataType: 'jsonp',
                        type: "get",
                        url: suggestUrl,
                        data: {prod:prod, wd:currentVal},
                        jsonp:"callback"
                    });
                },
                html: true,
                select: function( e, ui ){
                    //回车，鼠标点击不提交
                    e.preventDefault();
                    var url = ui.item.value,
                      speHostName = ["com","co"];
                    //空串
                    if ( !url ) { return;}
                    siteAddr.val( url );
                    //自动填充名称字段
                    url = String(url).split("/")[0].split(".");
                    if ( url&&url[1] ) {
                        //如果有com直接使用com前面的
                        var pos = -1,
                            name = "";
                        jQuery.each(speHostName,function(key,val){
                            var position = jQuery.inArray(val,url);
                            if ( position>0 ){
                                pos = position;
                                return false;
                            }
                        });
                            //有com
                        if ( pos>0 ) {
                          name = url[pos-1];
                          //没有com
                        } else {
                          name = (url.length > 2) ? url[1] : url[0];
                        }
                        siteName.val( name ).get(0).select();
                   }
                   //关闭
                }
            };
            siteAddr.autocomplete(autoOpts);
            custom_list.delegate(".add-btn","click",function(e){
                var target = $(e.target);
                modifiedIndex = -1;
                if (target.is(".add-btn-txt,.add-btn,.add-btn-ico")){                    
                    var btnObj = target.closest('.custom_item'),
                        position = btnObj.position(),
                        btnLeft = position.left,
                        btnWidth = btnObj.width(),
                        formWidth = customForm.width();
                        left = conf.dir === "rtl" ? (btnLeft + btnWidth - formWidth) : (btnLeft + parseInt(btnObj.css('margin-left')));
                    customForm.css({
                                "left":left,
                                "top":position.top + parseInt(btnObj.css('margin-top'))
                              }).show().get(0).reset();                                      
                    siteAddr.get(0).focus(); //focus第一个input                   
                }
            });
            
            //自定义网站提交
            customForm.submit( function( e ){
                e.preventDefault();
                siteAddr.autocomplete("close");
                var url = $.trim( siteAddr.val() ),
                    //如果只填写了地址，没有填写name,使用url代替name
                    name = $.trim( siteName.val() ) || url,
                    imgUrl = "",
                    prohost = "",
                    customSite =  window.localStorage ? $.parseJSON(localStorage.getItem("customSite") || '{"list":[]}') : $.parseJSON('{"list":[]}');
                //填写了address和name或者只填写了address记录填写信息
                if ( name && url ){
                    prohost = url.match(/([^:\/?#]+:\/\/)?([^\/@:]+)/i);
                    prohost = prohost ?  prohost : [true,"http://",document.location.hostname];
                    //用于统计
                    recordUrl = url;
                     //补全url
                    if ( !prohost[1] ) {
                        prohost[1] = "http://";
                        url = "http://" + url;
                    }
                    //抓取ico
                    imgUrl =  prohost[1] + prohost[2]  + "/favicon.ico";  
               
                    //写入dom树 
                    var temp = template.replace("url",url)
                                       .replace("name",name)
                                       .replace("imgUrl",imgUrl);
                    if(modifiedIndex == -1){//新增
                        //记录到cookie
                        customSite.list.push({
                            name: name,
                            url : url,
                            imgurl : imgUrl
                        });
                        addBtn.before(temp); 
                        // 1.统计总添加网站次数2.统计各国添加的top50URL 
                        UT.send({
                            type:"click",
                            ac:"b",
                            position:"add",
                            url:url,
                            sort:"input",
                            modId:"customsites"
                        });           
                    }else{//修改                        
                        if(customSite.list[modifiedIndex].name == name && customSite.list[modifiedIndex].url == url){
                            //modifiedIndex = -1;                            
                            this.reset();//清空表单 
                            siteAddr.removeClass("err-warn");                            
                            $(this).hide();//关闭
                            return;
                        }else{
                          $(".custom_item:eq("+modifiedIndex+")").replaceWith(temp);
                          customSite.list[modifiedIndex].name = name;
                          customSite.list[modifiedIndex].url = url;
                          customSite.list[modifiedIndex].imgurl = imgUrl;
                          //modifiedIndex = -1;
                          // 1.统计总添加网站次数2.统计各国添加的top50URL 
                            UT.send({
                                type:"click",
                                ac:"b",
                                position:"add",
                                url:url,
                                sort:"input",
                                modId:"customsites"
                            }); 
                        }                    
                    }

                    var length =  customSite.list.length;
                    //记录到localStorage中
                    if(window.localStorage) {
                        localStorage.setItem("customSite", jQuery.toJSON(customSite));
                    }
                    customSiteList = length;
                    //只能写入10个自定义网址
                    ( length === maxSite ) &&  addBtn.hide();                                   
                } else if( name ) {//只填写了name ,不然提交，address框变红
                  siteAddr.addClass("err-warn")
                          .get(0)
                          .focus();
                  return;
                }
                //清空表单 
                this.reset();
                siteAddr.removeClass("err-warn");
                //关闭
                $(this).hide();
            });
            //添加自定义按钮事件
            $("#del-btn-ok").button()
                            .click(function( e ){
                                e.preventDefault();
                                customForm.trigger("submit");
                            });
            $("#del-btn-cancel").button()
                            .click(function( e ){
                                e.preventDefault();
                                customForm.hide();
                                //删除警告
                                siteAddr.removeClass("err-warn");
                            });
            //ok,cancel button
            //删除提示
            var tip_conf = {
                closeOnEscape: false,
                id : "customTip",
                buttons: { "Ok": {
                                text:btn_ok_txt,
                                click:function() {
                                    //关闭tip
                                    var option = $(this).tip("option"),
                                        item = $(".custom_item",custom_list),
                                        pos = $.inArray( option.delOb.get(0),item.get() ),
                                        length = 0;
                                    if ( pos>-1 ) {
                                        option.delOb.remove();
                                        var customSite = "";
                                        // 记录到localSorage
                                        if(window.localStorage) {
                                            customSite =  localStorage.getItem("customSite");
                                        }
                                        //var customSite =  jQuery.cookie("customSite");
                                        customSite = $.parseJSON(customSite || '{"list":[]}');
                                        customSite.list.splice(pos , 1);
                                        length = customSite.list.length;
                                        if(window.localStorage) {
                                            localStorage.setItem("customSite", jQuery.toJSON(customSite));
                                        }
                                        //jQuery.cookie("customSite", jQuery.toJSON(customSite),{ expires:2000, path: '/'});
                                         //如果所有自定义网站清除，也清空cookie(改为清空localStorage)
                                         if ( !length ) {
                                             //jQuery.cookie("customSite", null,{path: '/'});
                                             if(window.localStorage) {
                                                localStorage.setItem("customSite", '{"list":[]}');
                                             }
                                         }
                                        //如果已经满10删除，回复添加按钮
                                        ( ++length === maxSite ) && addBtn.show();
                                        option.delOb = null;
                                    }
                                    $(this).tip("close");
                                },
                                addClass: "mod-btn_normal"
                            },
                            "Cancel": {
                                text:btn_cancel_txt,
                                click:function() {
                                    var option = $(this).tip("option");
                                    $(this).tip("close");
                                    $(".sprite-del_ative",custom_list).removeClass("sprite-del_ative");
                                },
                                addClass: "mod-btn_cancel"
                            }
                }
            }
            $('<div id="tip">'+ tipContent + '</div>').tip(tip_conf);
            $(".ui-tip a").button();
            //阻止点击del后跳转
            custom_list.delegate(".custom_item","click",function(e){
                var target = $(e.target);
                if ( target.hasClass("btn") ){
                   e.preventDefault(); 
                }
            });
            addBtn.hover(function(e){
                $(this).toggleClass("add-btn_hover"); 
            });
            //点击删除按钮
            custom_list.delegate(".del","click",function(e){
                //点击自己
                if ( $(this).hasClass("sprite-del_ative") ) {
                    return; 
                }
                //删除已经打开的窗口
                $("#tip").tip("close");
                //删除上一次打开的
                $(".sprite-del_ative",custom_list).removeClass("sprite-del_ative");
                //计算tip的高度
                var tipWidget =  $("#tip").tip("widget"),
                    target = $(this),
                    delOb = $(e.target).parent(".custom_item");
                //激活删除按钮
                target.addClass("sprite-del_ative");

                UT.send({
                    type:"click",
                    position:"set",
                    sort: "delete",
                    modId:"customsites"
                });

                //记录激活过的按钮
                $("#tip").tip({autoOpen:"open",delOb:delOb,ativeObj:target});
            }).delegate(".del","hover",function( e ){
                var odel = $(this);
                odel.toggleClass("sprite-del_hover");
            });

            custom_list.delegate(".modify","click",function(e){                
                var target = $(e.target),
                    modifyOb = target.parent();
                //$("#customsite-con").detach().appendTo(modifyOb);                
                //点击自己
                if ( $(this).hasClass("sprite-modify_ative") ) {
                    return;
                }
                //删除已经打开的窗口
                //tip.tip("close");
                //删除上一次打开的
                $(".sprite-modify_ative",custom_list).removeClass("sprite-modify_ative");        
                if(customForm.is(":hidden")){
                    var position = modifyOb.position(),
                        btnLeft = position.left,
                        btnWidth = modifyOb.width(),
                        formWidth = customForm.width();
                        left = conf.dir === "rtl" ? (btnLeft + btnWidth - formWidth) : (btnLeft + parseInt(modifyOb.css('margin-left')));
                    customForm.css({
                                    "left":left,
                                    "top":position.top + parseInt(modifyOb.css('margin-top'))
                                  }).show();
                }
                siteAddr.val(modifyOb.attr("href"))[0].select();
                siteName.val(target.prev().text());
                modifiedIndex = $(".custom_item").index(modifyOb);
                UT.send({
                    type:"click",
                    position:"set",
                    sort: "edit",
                    modId:"customsites"
                });
            }).delegate(".modify","hover",function( e ){
                var omodify = $(this);
                omodify.toggleClass("sprite-modify_hover");
            });
            /*
              1.统计使用自定义模块的UV数（包括有添加网站 或 点出两种行为的去重UV）
              2.统计总添加网站次数(通过element(button)区分)统计使用自定义模块的UV数
              3.统计点出次数(通过element(span或者a)区分)
              4.统计各国添加的top50URL 
              5.统计各国点击出去的top50URL
            */
            custom_list.mousedown(function(e){
                var url = "",
                    elementName = e.target.nodeName.toLowerCase(),
                    needLog =  $(e.target).not("i").closest("a");   
                if ( recordUrl ) {
                    url =  recordUrl;
                    recordUrl= "";
                }
                //只有a标签才做统计
                if ( needLog.length ) {
                    UT.send({
                        type:"click",
                        position:"click",
                        sort: "click",
                        url:url || needLog.attr("href") || "",
                        modId:"customsites"
                    });
                }                
            });

            //custom hotsite bubble: it will always be shown unless user close this bubble
            /*if(!$.cookie("showBubble")){
                  $.cookie("showBubble",1,{ expires:2000, path: '/'});
            }
            if($.cookie("showBubble") & 1){
                var hotsiteBubble = $("<div id='hotsiteBubble' class='hotsite_bubble_"+conf.country+"'><span id='closeBubble'></span></div>").appendTo($(".hotsite-custom")).hide(),
                    customBarTxt = $("#custom_bar_txt"),
                    barPos = customBarTxt.position(),
                    offsetX = (conf.country == "ar")?-(hotsiteBubble.width() + 5):customBarTxt.width() + 5,
                    offsetY = customBarTxt.height() - hotsiteBubble.height()*0.88,
                    left = barPos.left + offsetX,
                    top = barPos.top + offsetY,
                    closeLeftPos = (conf.country == "ar")?0:hotsiteBubble.width()-19;

                hotsiteBubble.css({                    
                    "top":top,
                    "left":left
                }).show();                
                $("#closeBubble").css({                    
                    "left":closeLeftPos                                
                }).click(function(){
                    hotsiteBubble.hide();
                    $.cookie("showBubble",0,{ expires:2000, path: '/'});
                });             
              }*/
        } else {
            //不支持cookie,直接隐藏
            $("#custom_bar").hide();
        }
    });