var $ = jQuery = require("common:widget/ui/jquery/jquery.js");
var helper = require("common:widget/ui/helper/helper.js");
var UT = require("common:widget/ui/ut/ut.js");
require("common:widget/ui/jquery/widget/jquery.ui.position/jquery.ui.position.js");
require("common:widget/ui/jquery/widget/jquery.ui.button/jquery.ui.button.js");
require("common:widget/ui/jquery/widget/jquery.ui.tip/jquery.ui.tip.js");
require("common:widget/ui/jquery/widget/jquery.ui.autocomplete/jquery.ui.autocomplete.js");
require("common:widget/ui/jquery/widget/jquery.ui.autocomplete.html/jquery.ui.autocomplete.html.js");
require("common:widget/ui/suggest/suggest.js");
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
            //无cookie时默认展开
            if(first === null || first === undefined) {
                first = 1;
                jQuery.cookie("isOpensitelist",1,{ expires:2000, path: '/'});
            }
            //用户上一次是否已经选择打开
            if (first & 1){
                custom_list.show();
                $("#custom_bar").addClass("bar_open");
            }
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
                        isOpen = (isFirst === null) ? 1 : jQuery.cookie("isOpensitelist")^1;
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
                        position = btnObj.position();
                    customForm.css({
                                "left":position.left + parseInt(btnObj.css('margin-left')),
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
                    var position = modifyOb.position();
                    customForm.css({
                                    "left":position.left + parseInt(modifyOb.css('margin-left')),
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

        } else {
            //不支持cookie,直接隐藏
            $("#custom_bar").hide();
        }
/***********************************************************METRO***********************************************************************/
    var _metro = conf.metro,
        metroContainerTpl = '<div class="metro-hover-container #{hoverItem}Container">'
                        +      '<span class="metro-hover-opacity #{hoverItem}"></span>'
                        +      '<div class="metro-hover #{hoverItem}Hover">'
                        +         '<span class="metro-hover-title #{hoverItem}Title">#{name}</span>'
                        +         '<span class="metro-hover-starts #{hoverItem}Starts" stars="#{stars}"></span>'
                        +         '<a class="metro-hover-btn #{hoverItem}Btn" href="#{url}"><span class="btn-name">#{gobtn}</span><span class="linkname">#{name}</span></a>'
                        +       '</div>'
                        +   '</div>',
        //关闭按钮             
        closeBtn = '<span class="big-hover-close"></span>',
        //背景链接，可选
        backgroundLinkTpl = '<a class="backlink" href="#{url}"><span class="linkname">#{name}</span></a>',
        //副标题，可选
        subheadTpl = '<span class="metro-hover-subHead">#{subhead}</span>',
        //文字描述
        descriptionTpl = '<span class="description #{hoverItem}Des">#{description}</span>',
        //消息提醒气泡
        messageBubble = '<i class="messageBubble"></i>',
        //facebook登录/登出按钮
        facebookLoginBtn = '<a class="facebookloginBtn-login facebookloginBtn" href="#" target="" ></a>',
        //账号系统登出url
        logoutUrl = conf.commonLogin.logoutUrl.replaceTpl({
                                idc: encodeURIComponent(conf.commonLogin.idcMap[conf.commonLogin.countryCode]),
                                "gotourl": encodeURIComponent(document.location.href)}),
        //热区父框
        hotsiteDom = $("#hotsite");   

    /*
        *热区metro的公共对象

         通用方法
         init : 负责初始化普通的hover效果和特殊的hover效果，调用传递过来的hover对象的load handleShow handleHide方法
         @params div => 每个metro的父框 hoverItem => hover对象

         creatNormalHoverItem ：创建公共dom结构
         @params item => 父div index => 序号  hoverItem => 具有特殊hover效果的标识

         initStars : 生成评分星星

         handleMessagebubble : 处理消息提醒气泡


    */    
    var metro = {        
        init : function( div,hoverItem ){
            var that = this;
            hoverItem = hoverItem || that;

            hotsiteDom.on("mouseenter",div,function(){
                var thisObj = $(this),
                    index = thisObj.index(),
                    container = thisObj.find(".metro-hover-container");
                if( !container.length ){
                    hoverItem.load( thisObj,index );     
                }
                else {
                    hoverItem.handleShow( container,index );
                }      
            })
            .on("mouseleave",div,function(){
                hoverItem.handleHide( $(this).find(".metro-hover-container") );              
            });
           
        },       
        creatNormalHoverItem : function( item,index,hoverItem ){
            var data = _metro[index],
            container = $(helper.replaceTpl(metroContainerTpl,{ 
                "hoverItem": hoverItem || "" ,
                "name" : data.name,
                "url" : data.url,
                "stars" :data.stars ,
                "gobtn":data.gobtn
            })); 
        
            data.showBackLink && container.append(helper.replaceTpl(backgroundLinkTpl,{"url":data.url,"name":data.name}));
            data.hidebtn && container.find(".metro-hover-btn").hide();
            data.description && container.find(".metro-hover").append(helper.replaceTpl(descriptionTpl,{"hoverItem": data.hoverItem || "" ,"description":data.description}));
            this.initStarts(container,hoverItem);
            item.append(container);   
            return container;
        },
        initStarts : function( obj,hoverItem ){
            var parentObj = obj.find(".metro-hover-starts"),
                starts = '',
                nums =  parentObj.attr("stars") || "3",//默认3个
                isFloat = nums.indexOf("\.")+1,
                isBigStart = hoverItem?'big_':'',//大小两种星图
                num_class = isBigStart+'star_normal',
                i = 0;
            for(i;i<nums;i++){
                num_class = i < parseInt(nums,10)?num_class:isBigStart+'star_none';
                !!isFloat && (i == parseInt(nums,10)) && (num_class = isBigStart+'star_half');//半颗星的情况
                starts+='<i class='+num_class+'></i>';
            }
            parentObj.append(starts); 
        },
        handleMessagebubble : function( stat,obj ){
            var messageBubble = obj.find(".messageBubble");
            if(!messageBubble.is(":visible")){
                return;
            }

            if( stat === "hover" ){ 
                messageBubble.remove();
                obj.find(".metro-hover").append(messageBubble);
                messageBubble.addClass("messageBubble-hover"); 
            } else {
                obj.find(".metro-hover").remove(".messageBubble");
                obj.append(messageBubble);
                messageBubble.removeClass("messageBubble-hover");
            }
        }
    };

    //默认的hover对象
    var nMetro = {
        start : function(){
            var that = this;
            metro.init( ".Metro",that );
            that.bindEvents();
        },
        load : function ( thisObj,index ){
            metro.creatNormalHoverItem(thisObj,index).show();  
        },
        handleShow : function( container ){
            container.show();
        },
        handleHide : function( container ){
            container.hide();
        },
        bindEvents : function(){
            var that = this;
            hotsiteDom.on("click",".metro-hover-btn",function(){
                var $this = $(this),
                    btn = $this.find(".btn-name")[0],
                    value = btn.innerHTML;
                btn.innerHTML = "";
                setTimeout(function(){btn.innerHTML = value},16);
                UT.send({
                    type:"click",
                    position:"hotsitesMetroGo",
                    modId:"hotsitesMetro"
                });
            })

            //关闭按钮
            .on("click",".big-hover-close",function(){
                var parentDiv = $(this).parent().parent();
                parentDiv.mouseleave();
                metro.handleMessagebubble( "normal",parentDiv );
                UT.send({
                    type:"click",
                    position:"hoverClose",
                    modId:"hotsitesMetro"
                });
            })                 
            .on("mouseenter",".big-hover-close",function(){
                $(this).addClass("big-hover-close-hover");
            })
            .on("mouseleave",".big-hover-close",function(){
                $(this).removeClass("big-hover-close-hover");
            });
        }
    };
    
    //facebook
    var facebookMetro = {
        start : function(){
           var that = this;
           metro.init( ".facebookMetro",that );
           that.bindEvents();
        },
        handleShow : function( container,index ){
            var data = _metro[index];
            metro.handleMessagebubble( "hover",container.parent() );
            container.stop(true,true).show(400);
            this.handleFacebookLogin( data.logout,data.login );
        },
        handleHide : function( container ){
            metro.handleMessagebubble( "normal",container.parent() );
            container.hide(400);
        },
        load : function( thisObj,index ){
            var _container = metro.creatNormalHoverItem(thisObj,index,"facebook"),
                _metroHover = _container.find(".metro-hover"),
                data = _metro[index];

            _container.append(closeBtn);
            _metroHover.find(".metro-hover-title").after(helper.replaceTpl(subheadTpl,{"subhead":data.subhead}));
                        
            _metroHover.append(facebookLoginBtn);                            
            _container.stop(true,true).show(400); 
            metro.handleMessagebubble( "hover",_container.parent() );
            this.handleFacebookLogin( data.logout,data.login );
        },
        //处理登录/登出
        handleFacebookLogin : function( logout,login ){
            var loginBtn = $(".facebookloginBtn");
            if( window.loginCtroller.verify == 1 ){
                
                loginBtn.removeClass("facebookloginBtn-login").addClass("facebookloginBtn-loginout");
                loginBtn.attr({"href":logoutUrl,"target":"_self"}).text(logout);
            }   
            else {
                loginBtn.addClass("facebookloginBtn-login").removeClass("facebookloginBtn-loginout");
                loginBtn.attr({"href":"#","target":""}).text(login);
            }
        },
        bindEvents : function(){
            //facebook登陆按钮
            hotsiteDom.on("click",".facebookloginBtn-login",function(e){
                e.preventDefault();
                 UT.send({
                    type:"click",
                    position:"facebookloginBtn",
                    modId:"hotsitesMetro"
                });
                window.loginCtroller && window.loginCtroller.fire();
            })
            //facebook登出按钮
            .on("click",".facebookloginBtn-loginout",function(e){
                 UT.send({
                    type:"click",
                    position:"facebookloginoutBtn",
                    modId:"hotsitesMetro"
                });
            });
        }

    };
    
    //google
    var googleMetro = {
        start : function(){
            var that = this;
            metro.init( ".googleMetro",that );
            that.bindEvents();
           
        },
        handleShow : function( container ){
            container.stop(true,true).show().animate({left:"-199%"},function(){
                $(".inputText").val("").focus();
            });                 
            $(".hotsiteSearchGroup .sug-search").hide();
            $(".metroSearchTips").show();
        },
        handleHide : function( container ){
            container.css({left:"110%"}).hide();
        },
        load : function( thisObj,index ){
            var container = metro.creatNormalHoverItem(thisObj,index,"google"),
                newGoogleHoverDoms = 
                    '<div class="hotsite-metro-search">'+                                   
                        '<form class="hotsiteMetroGoogleSearch" action='+_metro[index].action+'>'+
                            '<a href="https://www.google.com.br/"><span class="linkname">'+_metro[index].name+'</span></a>'+
                            '<span class="hotsiteSearchGroup">'+
                                '<span class="metroSearchTips">'+_metro[index].tips+'</span>'+
                                '<input type="text" name="q" autocomplete="off" class="inputText" />'+
                                '<input type="submit" value="" class="sub" value="" />'+
                            '</span>'+
                        '</form>'+
                    '</div>';

            container.append(newGoogleHoverDoms).append(closeBtn).show().animate({width:"302%",left:"-199%"},function(){
                $(".hotsiteMetroGoogleSearch").show();
                $(".inputText").focus();
            }); 
            //隐藏默认的样式
            container.find(".metro-hover").hide();
            this.sug( index );
        },
        bindEvents : function(){
            //google提交
            hotsiteDom.on("submit",".hotsiteMetroGoogleSearch",function(){
                UT.send({
                    type:"click",
                    position:"hotsiteMetroGoogleSearch",
                    modId:"hotsitesMetro",
                    value: encodeURIComponent($(".inputText").val())
                });
            })
            .on("click",".metroSearchTips",function(){
                $(this).hide();
                $(".inputText").focus();
            })
            .on("keyup",".inputText",function(){
                $(this).val()?$(".metroSearchTips").hide():$(".metroSearchTips").show(); 
            })
            .on("mousedown",".sub",function(){
                $(this).addClass("sub-down");
            })
            .on("mouseenter",".sub",function(){
                $(this).addClass("sub-hover");
            })
            .on("mouseleave",".sub",function(){
                $(this).removeClass("sub-down").removeClass("sub-hover");
            });
        },
        //google sug，调用的是google原生的sug
        sug : function( index ){
            var _conf = conf.searchGroup,
                type = "index",
                sugs = _metro[index].sug || 7;
            Gl.suggest($(".inputText")[0], {
                classNameWrap: "sug-search",                    
                classNameSelect: "sug-select",
                //classNameClose: "sug-close",
                delay: _conf.conf[type].delay,
                n: sugs,
                autoFocus: false,
                requestQuery: "q",
                requestParas:  _metro[index].requestParas[0],
                url: _metro[index].sugurl,
                callbackFn: "window.google.ac.h",
                callbackDataKey: 1,   
                onMouseSelect: function() {
                    UT.send({
                        type: "click",
                        position: "hotsiteMetroGoogleSearch",
                        engine: "google",
                        value: encodeURIComponent($(".inputText").val()),
                        modId:"hotsitesMetro"
                    });
                },              
                templ: function(data) {
                    var _data = data[1] || [],
                        q = data[0],
                        ret = [],
                        i = 0,
                        len = Math.min(_data.length, sugs);

                    for(; i<len; i++) {
                        ret.push('<li q="' + _data[i][0] + '">' + _data[i][0].replace(q, '<span class="sug-query">' + q + '</span>') + '</li>')
                    }
                    return '<ol>' + ret.join("") + '</ol>';
                }
                    
            }); 
        }
    }
    nMetro.start();
    facebookMetro.start();
    googleMetro.start();
     //轮循取Facebook消息值
    Gl.hotsiteFB = {
        fb : null,
        start : function(){
            if(this.fb){
                return;
            }
            //生成消息提醒气泡
            $(".facebookMetro").append(messageBubble);  
            var message = $(".facebookMetro").find(".messageBubble");
            this.fb = setInterval(function() {          
                if(window.FB === undefined || window.FB.unreadMessage === undefined || window.loginCtroller.verify == 2){
                    return;
                }

                var dataLength = window.FB.unreadMessage;
                
                dataLength =  parseInt(dataLength,10);
                if( dataLength == 0 ){
                    message.hide();
                    return;
                } else if(dataLength > 99) {
                    dataLength = 99;
                }
                message.show().text(dataLength);                    
            },20000); 
        },
        stop :function(){
           this.fb && clearInterval(this.fb);
           this.fb = null;
           $(".facebookMetro .messageBubble").removeClass("messageBubble-show");
        }           
        
    }
    Gl.hotsiteFB.start();
	PDC && PDC.mark("c_hsvi");
});
			
