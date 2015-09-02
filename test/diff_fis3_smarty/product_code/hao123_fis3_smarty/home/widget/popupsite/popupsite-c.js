/*
*  @author chenguangyin
*  @version 1.0.1
*  用户自定义信息由cookie转到localStorage，消除cookie超出大小限制时页面无法访问的风险
*  同时方便把用户信息迁移到后台和账号系统打通
 */

var $ = jQuery = require("common:widget/ui/jquery/jquery.js");
var helper = require("common:widget/ui/helper/helper.js");
var UT = require("common:widget/ui/ut/ut.js");

require("common:widget/ui/jquery/widget/jquery.ui.autocomplete/jquery.ui.autocomplete.js");
require("common:widget/ui/jquery/widget/jquery.ui.autocomplete.html/jquery.ui.autocomplete.html.js");

window.conf || (window.conf = {});
window.Gl || (window.Gl = {});

var CONF      = conf.popupSite,
    SELFSITES = CONF.selfSites,
    SETSITE   = CONF.setSite,
    HISCONF   = CONF.history,
    REMIND    = CONF.newSiteRemind,
    LIST      = CONF.list,
    MAX       = SELFSITES.limitNum,
    SUGURL    = CONF.suggestUrl,
    DEFAUICON = CONF.defaultIcon;

var TPL = {
    // 全局TPL
    globalTpl: '<div class="popup-site_mask" id="popSiteMask"></div><div class="popup-site_container" id="popSiteWrap" log-mod="customsites" style="top:' + (CONF.top||484) + 'px;"><div class="popup-site_head">#{head}</div><div class="popup-site_self"><div class="self_site" id="selfSites">#{selfContent}</div><div class="self_tips" id="selfTips"><div class="self_arrow"><div></div></div>#{selfTipsContent}</div></div><form id="setSite">#{setSiteContent}</form><div class="popup-site_history">#{history}</div><div class="popup-site_cms" id="popCms">#{cms}</div>#{addSuccess}</div>',
    // 弹出框头部TPL
    headTpl: '<p class="popup-site_title">#{titleContent}</p><span id="popupClose" class="popup-site_close" title="#{closeTips}"></span>',
    // 收藏网站超过规定数目时显示TIPS
    selfTipsTpl: '<p><span class="self_tips_icon"></span>#{selfTips}</p>',
    // 收藏网址的每个有效item的TPL 
    selfItemTpl: ' <span class="site_item" data-name="#{name}" data-url="#{url}" data-icon="#{icon}" data-type="#{type}"><span class="item_text"><img class="item_icon" src="#{icon}" onerror="this.src=\'' + DEFAUICON + '\';this.onerror=null;">#{name}</span><i class="item_edit" title="' + SELFSITES.editTips + '"></i><i class="item_delete" title="'+SELFSITES.delTips+'"></i></span>',
    // 已收藏网址修改后保存使用
    editItemTpl: '<img class="item_icon" src="#{icon}" onerror="this.src=\'' + DEFAUICON + '\';this.onerror=null;">',
    // 收藏网址的默认虚线框
    selfItemDefaultTpl: '<span class="item_default"></span>',
    // 添加、编辑网址TPL
    setSiteTpl: '<div class="popup-site_set"><label for="siteUrl">#{url}:</label><input class="site_url" id="siteUrl" autocomplete="off" /><label for="siteName">#{name}:</label><input class="site_name" id="siteName" autocomplete="off" /><span class="site_add" data-status="active">#{add}</span><span class="site_edit" data-status="sleep">#{edit}</span></div>',
    // 用户访问历史记录的整体TPL
    historyWrapperTpl: '<div class="history_head"><span class="history_tips" style="background-image: url(' + HISCONF.guideImage + ');"></span>#{title}</div><div class="history_content" data-type="history" id="popHistory"></div><p class="history_nosite" id="historyNoSite">#{noSite}</p>',
    // 每个网址的TPL，用于历史记录网址、CMS配置的网址
    siteItemTpl: '<span class="site_item" data-name="#{name}" data-url="#{url}" data-icon="#{icon}" data-type="#{type}"><span class="item_text"><img class="item_icon" src="#{icon}" onerror="this.src=\'' + DEFAUICON + '\';this.onerror=null;">#{name}</span></span>',
    // CMS每个分类的TPL
    cmsSortWrapperTpl: '<div class="cms_sort"><div class="sort_head">#{title}</div><div class="sort_content" data-type="#{type}">#{sortContent}</div></div>',
    // 一键添加成功后显示动画
    addSuccesTpl: '<div id="popAddSuc" style="display:none;"><div id="popAddInner"><span class="site_item"><span class="item_text" style="color: #00B174;"><span class="item_icon"></span>' + CONF.addSuccess + '</span></span></div></div>',
    // 热区下拉框itemTPL
    customSiteItemTpl: '<a class="custom_item"  href="#{url}" data-name="#{name}" data-url="#{url}" data-icon="#{icon}" data-type="#{type}" target="_blank" tabindex="-1"><span class="ico-txt"><img class="site-icon" src="#{icon}" onerror="this.src=\'' + DEFAUICON + '\';this.onerror=null;">#{name}</span><i class="btn modify sprite-modify_normal"></i><i class="btn del sprite-del_normal"></i></a>'
};



/**
 * 所有方法在DOMready之后执行，模版拼接发生在用户点击添加收藏网址之后，全部是动态拼接生成
 * 首次点击
 *      step 1: 取消原先自定义点击事件，绑定弹出框的事件方法
 *      step 2: 获取用户已收藏网址，拼接到模版
 *      step 3：从CMS获取分类网址，去重后拼接添加到全局模板里面
 *      step 4：将拼接好的模版添加到document body
 *      step 5：获取用户历史记录，去重后拼接到模版
 *      step 6：绑定各种事件
 *
 * 非首次点击
 *      step 1: 更新已收藏网址
 *      step 2: 显示pop框
 *      step 3: 更新历史记录，添加时需去重
 *
 *
 *   需绑定的事件：
 *     1. 弹出框的关闭；
 *     2. 已收藏网址的修改、删除；
 *     3. 网址的修改、添加；
 *     4. 历史网址、CMS网址一键添加。
 *
 *
 *   需注意的问题:
 *     1. 不管是否点击查看历史记录，弹出框出现时都要访问一次history(最终策略)
 *     2. 保持弹出框的添加网址和热区下面的添加网址同步，策略为当关闭pop框时或刷新页面前
 *        再把所有的添加网址放入热区的customSite
 *     3. 添加、编辑网址的SUG功能实现有点麻烦，参照hot-site
 *     4. 添加网址后，网址如何消失（动画），如何添加到已收藏网址（也需要动画）
 *
 **/
$(function() {
    // 测试是否支持cookie
    jQuery.cookie("supportCookie", true);
    var supportCookie = !!jQuery.cookie("supportCookie");

    var COOK          = ($.cookie("FLASHID") || $.cookie("BAIDUID") || "").substr(0, 32);
    var SelfData      = []; // 已收藏网址


    // 用到的通用方法
    var Common = {

        // 获取添加网址的icon url
        getFavIconUrl: function(url) {
            var prohost;
            prohost = url.match(/([^:\/?#]+:\/\/)?([^\/@:]+)/i);
            prohost = prohost ? prohost : [true, "http://", document.location.hostname];

            //补全url
            if (!prohost[1]) {
                prohost[1] = "http://";
            }
            //抓取ico
            return prohost[1] + prohost[2] + "/favicon.ico";
        },

        // 去除特殊字符
        filterStr: function(str) {
            var pattern = /[><'"]/g;
            
            return str.replace(pattern, '');
        },

        // URL前面添加http://
        addHttp: function(url) {
            return (url.search(/.+:\/\//) > -1) ? url : ("http://" + url);
        },
        // url去掉末尾的'/'
        fixUrl: function(url) {
            var len = url.length;
            return (url.charAt(len - 1) === "/") ? url.substring(0, len - 1) : url;
        },

        // 验证url、name完全相同的元素是否在已收藏网址已经存在
        isRepeat: function(data) {
            var name  = data.name,
                that  = this,
                url   = that.addHttp( that.fixUrl(data.url) ),
                index = false;

            $.each(SelfData, function(key, value) {
                if (name === value.name && url === that.addHttp( that.fixUrl(value.url) )) {
                    return (index = key);
                }
            });
            return index;
        },

        // 验证url、name、type完全相同的元素是否在已收藏网址已经存在,用于history、CMS数据去重
        isExist: function(data) {
            var name  = data.name,
                that  = this,
                url   = that.addHttp( that.fixUrl(data.url) ),
                index = false,
                type  = data.type;

            $.each(SelfData, function(key, value) {
                if (type === value.type && name === value.name && url === that.addHttp( that.fixUrl(value.url) )) {
                    return (index = key);
                }
            });
            return index;
        },
        // 发送统计
        sendLog: function(pos, sort, url) {
            if(url) {
                UT.send({
                    type    : 'click',
                    ac      : 'b',
                    position: pos,
                    sort    : sort,
                    url     : url,
                    modId   : "customsites"
                });
            } else {
                UT.send({
                    type    : 'click',
                    ac      : 'b',
                    position: pos,
                    sort    : sort,
                    modId   : "customsites"
                });
            }
        }
    };
    

    // 网址相关
    var SiteHandler = {

        /**
         * 添加网址(except：已收藏网址修改)
         * 去重，URL、name完全相同时不再添加，同时已添加的相同网址高亮显示
         * 还需要检查已添加网址是否已超过规定数目
         **/
        addSite: function(obj, ele) {
            var len         = SelfData.length,
                that        = this,
                isRepeat    = 0,
                urlInput    = $("#siteUrl"),
                nameInput   = $("#siteName"),
                selfSite    = $("#selfSites"),
                effecItem   = selfSite.children(".site_item"),
                defauItem   = selfSite.children(".item_default"),
                selfItemTpl = TPL.selfItemTpl;
            if(len < MAX) {
                isRepeat = Common.isRepeat(obj);

                if(isRepeat !== false) {
                    that.highLight(effecItem.eq(isRepeat));
                    ele ? '' : urlInput.focus();

                } else {
                    effecItem.removeClass("site_item-hl");
                    defauItem.first().replaceWith(helper.replaceTpl(selfItemTpl, obj));
                    ele ? that.removeSite(ele, function() {
                        that.highLight($("#selfSites").children(".site_item").eq(len));
                    }) : urlInput.focus(); // 如果是一键添加，删除被添加的元素
                    urlInput.val("");
                    nameInput.val("");
                    SelfData.push(obj);

                    if(ele) {
                        Common.sendLog("add", "direct", obj.url);
                    } else {
                        Common.sendLog("add", "input", obj.url);
                    }

                    if(len + 1 == MAX) {
                        $("#setSite").find(".site_add").addClass("site_disabled");
                    }
                }
                
            } else {
                $("#selfTips").stop(true, true).fadeIn(100).delay(2000).fadeOut(200);
            }
        },

        /**
         * 输入添加网址
         **/
        addInputSite: function(name, url) {
            url = Common.filterStr(url);
            name = Common.filterStr(name);
            var iconUrl = Common.getFavIconUrl(url);
            this.addSite({
                'type'  : "self",
                'name'  : name || this.fixSite(url),
                'url'   : Common.addHttp(url),
                'icon'  : iconUrl,
                'imgurl': iconUrl
            });
        },

        /**
         * 一键添加网址
         **/
        addDirectSite: function(ele) {

            var iconUrl = ele.attr("data-icon");
            this.addSite({
                'type'  : ele.attr("data-type"),
                'name'  : ele.attr("data-name"),
                'url'   : ele.attr("data-url"),
                'icon'  : iconUrl,
                'imgurl': iconUrl
            }, ele);
        },

        /**
         * 编辑已添加网址，要编辑的网址的url、name显示到form里面修改，
         * 同时form的add按钮消失，edit按钮出现,聚焦url输入框
         **/
        editSite: function(ele) {
            var targt = $("#setSite"),
                name  = ele.attr("data-name"),
                url   = ele.attr("data-url"),
                index = $("#selfSites").children(".site_item").index(ele);

            targt.attr({
                "data-name"  : name,
                "data-url"   : url,
                "data-index" : index
            });
            $("#siteName").val(name);
            $("#siteUrl").val(url);

            targt.find(".site_add").attr("data-status", "sleep").hide();
            targt.find(".site_edit").attr("data-status", "active").css("display", "inline-block");
            $("#siteUrl").focus();
        },

        /**
         * 保存编辑过的已添加网址，需要去重
         * 成功的话form的edit按钮消失，add按钮出现
         **/
        saveSite: function(name, url) {
            var targt    = $("#setSite"),
                icon     = Common.getFavIconUrl(url),
                urlInput = $("#siteUrl"),
                nameInput= $("#siteName"),
                index    = targt.attr("data-index"),
                nameOld  = targt.attr("data-name"),
                urlOld   = targt.attr("data-url"),
                cur      = $("#selfSites").children(".site_item").eq(index);

            url  = Common.addHttp(url);
            name = name || this.fixSite(url);
            if((nameOld === name) && (urlOld === url)) {
                
            } else {
                name = Common.filterStr(name);
                icon = Common.filterStr(icon);
                url  = Common.filterStr(url);
                cur.attr({
                    "data-name" : name,
                    "data-url"  : url,
                    "data-icon" : icon
                });
                cur.find(".item_icon").replaceWith(helper.replaceTpl(TPL.editItemTpl, {
                    'icon': icon
                }));
                cur.children("span.item_text").contents().filter(function() {
                    return this.nodeType == 3;
                }).replaceWith(name);

                if(urlOld !== url) {
                    Common.sendLog("add", "input", url);
                }
                SelfData[index].name   = name;
                SelfData[index].url    = url;
                SelfData[index].icon   = icon;
                SelfData[index].imgurl = icon;
            }
            urlInput.val("");
            nameInput.val("");
            setTimeout(function() {
                cur.removeClass("site_item-hl");
            }, 800);
            targt.find(".site_edit").attr("data-status", "sleep").hide();
            targt.find(".site_add").attr("data-status", "active").css("display", "inline-block");
            urlInput.focus();
            
        },

        /**
         * 删除网址，删除后一键添加的网址在CMS或history中再次出现，
         * 输入添加的删除后无动作
         **/
        deleteSite: function(ele) {
            var targt    = $("#setSite"),
                type     = ele.attr("data-type"),
                editSite = targt.find("span.site_edit"),
                addSite  = targt.find("span.site_add"),
                index    = $("#selfSites").children(".site_item").index(ele),
                frag     = "";

            $("#siteUrl").val("");
            $("#siteName").val("");
            editSite.attr("data-status", "sleep").hide();
            addSite.attr("data-status", "active").css("display", "inline-block");

            if (type && type !== "self") {

                frag = helper.replaceTpl(TPL.siteItemTpl, {
                    'name': ele.attr("data-name"),
                    'type': ele.attr("data-type"),
                    'url' : ele.attr("data-url"),
                    'icon': ele.attr("data-icon")
                });

                if (type === "history") {
                    $("#historyNoSite").hide();
                    $("#popHistory").append(frag);
                } else {
                    $("#popCms").find(".sort_content[data-type='" + type + "']").append(frag);
                }
            }

            SelfData.splice(index, 1); // 从数组中删除已删除的网址
            ele.hide();
            ele.parent().append(TPL.selfItemDefaultTpl);
            ele.remove();

            if(SelfData.length === MAX -1) {
                addSite.removeClass("site_disabled");
            }
        },

        // 移除一键添加到已收藏网址后的一键网址，同时有动画
        removeSite: function(ele, callback) {
            var pos = ele.offset(),
                addSuc = $("#popAddSuc"),
                tar = $("#popAddInner"),
                par = $("#popSiteWrap").offset();

            addSuc.css({
                top: pos.top - par.top,
                left: pos.left - par.left
            });
            tar.prepend(ele.clone());
            ele.css("visibility", "hidden");
            addSuc.show();
            tar.animate({top : "-26"}, 350, function() {
                var that = this;
                addSuc.delay(450).fadeOut(50, function() {
                    ele.remove();
                    $(that).css("top","0");
                    $(that).children().first().remove();
                    callback();
                });
                
            });
        },
         /**
         * 高亮效果
         *
         **/
        highLight: function(ele) {
            ele.addClass("site_item-hl");
            var hl = setTimeout(function() {
                ele.removeClass("site_item-hl");
                clearTimeout(hl);
            }, 1200);
        },
        /**
         * 输入网址添加或者编辑网址后添加都要fix
         * 没有网址name时根据url截出
         **/
        fixSite: function(url) {
            var speHostName = ["com", "co"],
                newName     = url;

            if(url.match("http://")) {
                url = url.split("http://")[1];
                newName = url;
            }
            //自动填充名称字段
            url = url.split("/")[0].split(".");
            if (url && url[1]) {
                //如果有com直接使用com前面的
                var pos = -1,
                    name = "";
                jQuery.each(speHostName, function(key, val) {
                    var position = jQuery.inArray(val, url);
                    if (position > 0) {
                        pos = position;
                        return false;
                    }
                });
                //有com
                if (pos > 0) {
                    name = url[pos - 1];
                    //没有com
                } else {
                    name = (url.length > 2) ? url[1] : url[0];
                }
                newName = name;
            }
            return newName;
        },

        bindEvent: function() {

            var that   = this,
                namObj = $("#siteName"),
                name   = '',
                urlObj = $("#siteUrl"),
                url    = '';
            // 设置网站按钮事件注册
            $("#setSite").on("click", ".site_add", function() {
                url  = $.trim(urlObj.val());
                name = $.trim(namObj.val());
                if(url !== '') {
                    that.addInputSite(name, url);
                } else {
                    if(SelfData.length >= MAX) {
                        $("#selfTips").stop(true, true).fadeIn(50).delay(2000).fadeOut(100);
                    } else {
                        urlObj.focus();
                        urlObj.css("border-color", "#FF0000");
                    }
                    
                }
            })
            .on("click", ".site_edit", function() {
                url  = $.trim(urlObj.val());
                name = $.trim(namObj.val()); // jquery不会自动去除空白
                if(url !== '') {
                    that.saveSite(name, url);
                } else {
                    urlObj.focus();
                    urlObj.css("border-color", "#FF0000");
                }
            });
            // 输入框
            $("#siteUrl, #siteName").focusin(function(e) {
                $(this).css("border-color", "#00B174");

                if( $(e.target).is(namObj) ) {
                    url  = $.trim(urlObj.val());
                    name = $.trim(namObj.val()); 
                    if(name === '' && url !== '') {
                        namObj.val(that.fixSite(url));
                    }
                }
            })
            .focusout(function() {
                $(this).css("border-color", "#D9D9D9");
            })
            .keydown(function(e) {
                if( $(e.target).is(urlObj)) {
                    urlObj.css("border-color", "#00B174");
                }
                if(e.which == 13) {
                    url  = $.trim(urlObj.val());
                    name = $.trim(namObj.val());
                    if(url !=='') {
                        $("#setSite").find("span[data-status=active]").trigger("click");
                    } else {
                        urlObj.focus();
                        urlObj.css("border-color", "#FF0000");
                    }
                }
            });
        }
    };


    // 已收藏
    var SelfSiteHandler = {
        /**
         * 获取已收藏网址（localSorage）
         *
         **/
        getSelfSites: function() {
            return $.parseJSON(localStorage.getItem("customSite") || '{"list":[]}').list;
        },
        /**
         * 更新收藏网址
         *
         **/
        updateSelfSites: function() {
            var that        = this,
                selfItemTpl = TPL.selfItemTpl,
                selfDefTpl  = TPL.selfItemDefaultTpl,
                selfContent = '',
                num         = 0, //用于统计当前已收藏网址数目
                iconUrl     = '',
                obj         = {},
                group       = [],
                temp        = 0; // 用于处理已收藏网址

            group = that.getSelfSites();
            num = (group ? group.length : 0);
            SelfData = [];

            if (num > 0) {
                $.each(group, function(index, value) {
                    iconUrl = value.imgurl;
                    obj = {
                        'type': value.type || 'self',
                        'name': value.name,
                        'url': Common.addHttp(value.url),
                        'icon': iconUrl || Common.getFavIconUrl(value.url),
                        'imgurl': iconUrl
                    };

                    SelfData.push(obj);
                    selfContent += helper.replaceTpl(selfItemTpl, obj);
                });
            }

            // 已收藏网站不够规定数目的话用虚线框代替
            for (; temp < MAX - num; temp++) {
                selfContent += selfDefTpl;
            }

            return selfContent;
        },

        // 已收藏网址修改、删除功能hover及点击事件注册
        bindEvent: function() {

            $('#selfSites').on("mouseover", ".item_edit", function() {
                $(this).addClass("item_edit-hover");
            })
            .on("mouseout", ".item_edit", function() {
                $(this).removeClass("item_edit-hover");
            })
            .on("click", ".item_edit", function() {
                var par = $(this).parent();
                par.parent().children(".site_item").removeClass("site_item-hl");
                par.addClass("site_item-hl");
                SiteHandler.editSite(par);
                Common.sendLog("set", "edit");
            })
            .on("mouseover", ".item_delete", function() {
                $(this).addClass("item_delete-hover");
            })
            .on("mouseout", ".item_delete", function() {
                $(this).removeClass("item_delete-hover");
            })
            .on("click", ".item_delete", function() {
                SiteHandler.deleteSite($(this).parent());
                Common.sendLog("set", "delete");
            });
        }
    };


    // 历史记录相关
    var HistoryHandler = {
        /**
         * 获取历史记录（ajax）
         *
         **/
        getHistory: function(callback) {
            var collect = [];

            $.ajax({
                url      : "/historyurl/get",
                data     : { id: COOK },
                success  : function(data) {
                    var data = $.parseJSON(data).data;
                    if (data.length > 0) {
                    	$("#historyNoSite").hide();
                        $.each(data, function(key, value) {
                            collect.push({
                                'name'  : value.t,
                                'url'   : Common.addHttp(value.u),
                                'icon'  : Common.getFavIconUrl(value.u),
                                'imgurl': Common.getFavIconUrl(value.u)
                            });
                        });
                        callback(collect);

                    } else {
                        $("#historyNoSite").show();
                    }
                },
                error   : function() {
                    //$("#popSiteWrap").find(".popup-site_history").remove();
                },
                type    : "POST"
            });
        },
        /**
         * 更新pop框历史记录
         *
         **/
        updateHistory: function(data) {
            var siteItemTpl = TPL.siteItemTpl,
                str  = ''; // 保存去重后拼装的history item模版

            $.each(data, function(key, val) {
                val.type = 'history';
                if (Common.isExist(val) !== false) {// history数据去重
                    return 1; 
                }
                str += helper.replaceTpl(siteItemTpl, val);
            });
            $("#popHistory").html(str);
        },
        /**
         * history网址hover、点击事件注册
         */
        bindEvent: function() {

            $("#popHistory").on("mouseenter", ".site_item", function() {
                $(this).addClass("site_item-hover");
            })
            .on("mouseleave", ".site_item", function() {
                $(this).removeClass("site_item-hover");
            })
            .on("click", ".site_item", function() {
                SiteHandler.addDirectSite($(this));
            });
        }
    };


    // SUG
    var InputSug = {
        initSug : function() {
            var siteAddr = $("#siteUrl"),
                siteName = $("#siteName"),
                customForm = $("#setSite");

            if (!window.baidu) {
                window.baidu = {};
            }
            window.baidu.sug = function(data) {
                var suggest = [],
                    l = data.s.length,
                    isVisibleForm = customForm.is(":visible");
                if ((l > 0) && isVisibleForm) {
                    var regEx = new RegExp("^" + custom_suggest_currentVal, "i");
                    $.each(data.s, function(key, val) {

                        var lab = val.replace(regEx, "<span class='current-val'>" + custom_suggest_currentVal + "</span>");
                        suggest.push({
                            label: lab,
                            value: val
                        });
                    });
                    custom_suggest_resp(suggest);
                } else {
                    siteAddr.autocomplete("close");
                }
            };
            //测试数据
            var autoOpts = {
                source: function(req, resp) {
                    var currentVal = req.term;
                    //全局表单列表,给回调函数
                    custom_suggest_resp = resp;
                    //全局记录表单输入当前值
                    custom_suggest_currentVal = currentVal;
                    $.ajax({
                        dataType: 'jsonp',
                        type: "get",
                        url: SUGURL,
                        data: {
                            prod: "global_hao123_" + conf.country,
                            wd: currentVal
                        },
                        jsonp: "callback"
                    });
                },
                html: true,
                select: function(e, ui) {
                    //回车，鼠标点击不提交
                    e.preventDefault();
                    var url = ui.item.value,
                        speHostName = ["com", "co"];
                    //空串
                    if (!url) {
                        return;
                    }
                    siteAddr.val(url);
                    //自动填充名称字段
                    url = String(url).split("/")[0].split(".");
                    if (url && url[1]) {
                        //如果有com直接使用com前面的
                        var pos = -1,
                            name = "";
                        jQuery.each(speHostName, function(key, val) {
                            var position = jQuery.inArray(val, url);
                            if (position > 0) {
                                pos = position;
                                return false;
                            }
                        });
                        //有com
                        if (pos > 0) {
                            name = url[pos - 1];
                            //没有com
                        } else {
                            name = (url.length > 2) ? url[1] : url[0];
                        }
                        siteName.val(name);

                        Common.sendLog("add", "sug");
                    }
                    //关闭
                }
            };
            siteAddr.autocomplete(autoOpts);
        },
        bindEvent : function() {
            $(document).mousedown(function(e) {
                var target = $(e.target),
                    customForm = $("#setSite"),
                    siteAddr = $("#siteUrl"),
                    autocompleteWidget = siteAddr.autocomplete("widget"),
                    isCloseCustomCon = customForm && !target.closest("#setSite").length && !target.closest( ".ui-menu-item",autocompleteWidget).length,
                    isVisibleForm = customForm.is(":visible");
                if (isCloseCustomCon) {
                    siteAddr.autocomplete("close");
                    //解决网速比较慢的情况,防止suggest出现慢
                } else if (!isVisibleForm) {
                    siteAddr.autocomplete("close");
                }
            });
        }
    };


    // 整体
    var PopupSite = {
        global     : TPL.globalTpl,
        isRendered : false,

        // 关闭pop框时需要发送统计、更新localStorage、添加网址同步到热区下拉层
        closePop: function() {
            var data = {},
                temp = '',
                tpl  = TPL.customSiteItemTpl;

            data.list = SelfData;

            // 更新热区下拉层网址
            $.each(data.list, function(key, value) {
                temp += helper.replaceTpl(tpl, value);
            });
            $("#custom_list").find("a.custom_item").remove();
            $(temp).insertBefore("#add-btn");
            if(SelfData.length >= MAX) {
                $("#add-btn").hide();
            }
            $("#popSiteMask, #popSiteWrap").hide(); // 关闭pop框
            localStorage.setItem("customSite", $.toJSON(data)); // 更新localSorage

        },

        // 在下拉框显示CMS更新提醒
        showRemind: function(content) {
            $("#add-btn").css("position", "relative").append("<i class='popup-site_remind'>" + content + "</i>");
        },
       
        /**
         * dom渲染，需要处理是否为首次渲染
         * 首次渲染时DOM节点不存在，需要渲染已收藏网址（localStorage）、设置form网址、
         *     历史记录（ajax）、CMS推荐网址
         * 非首次渲染时只需首先在隐藏的pop框里面更新已收藏网址（localStorage，然后
         *     从历史记录（ajax）里面读取数据，更新历史记录，最后直接显示pop框
         *
         **/
        render: function(isRendered) {

            var that        = this,
                siteItemTpl = TPL.siteItemTpl,
                cmsTpl      = TPL.cmsSortWrapperTpl,
                cms         = [],
                selfContent = '';

            // 根据是否为首次渲染做分别处理
            if (!isRendered) {

                // 已收藏网站数据处理
                selfContent = SelfSiteHandler.updateSelfSites();

                // CMS数据处理
                $.each(LIST.sort(function(m, n) { // 按照每个分类的sort排序
                    return m.sort - n.sort;

                }), function(index, value) {
                    cms[index] = '';
                    $.each(value.sitesList, function(key, val) {
                        val.type = value.title;
                        val.url  = Common.addHttp(val.url);
                        if (Common.isExist(val) !== false) {return 1;} // CMS数据去重

                        val.icon    = val.icon || Common.getFavIconUrl(val.url);
                        cms[index] += helper.replaceTpl(siteItemTpl, val);
                    });
                    cms[index] = helper.replaceTpl(cmsTpl, {
                        'title'      : value.title,
                        'type'       : value.title,
                        'sortContent': cms[index]
                    });
                });


                // 各类数据填充到全局模版
                that.global = helper.replaceTpl(TPL.globalTpl, {
                    // pop框头部信息
                    head           : helper.replaceTpl(TPL.headTpl, {
                        'titleContent': CONF.title,
                        'closeTips'   : CONF.closeTips
                    }),
                    // 已收藏网站超过规定数目时再添加时显示提示
                    selfTipsContent: helper.replaceTpl(TPL.selfTipsTpl, {
                        'selfTips': SELFSITES.overflow
                    }),
                    // 添加、修改网址的表单数据
                    setSiteContent : helper.replaceTpl(TPL.setSiteTpl, {
                        'url' : SETSITE.url,
                        'name': SETSITE.name,
                        'add' : SETSITE.addBtn,
                        'edit': SETSITE.editBtn
                    }),
                    history       : helper.replaceTpl(TPL.historyWrapperTpl, HISCONF),// 历史记录
                    cms           : cms.join(""), // cms数据
                    addSuccess    : TPL.addSuccesTpl,
                    selfContent   : selfContent // 已收藏网站数据
                });



                $(document.body).append(that.global); // DOM渲染
                if(SelfData.length >= MAX) {
                    $("#setSite").find(".site_add").addClass("site_disabled");
                }
                if(SUGURL) {
                    InputSug.initSug();
                }
                HistoryHandler.getHistory(HistoryHandler.updateHistory); // DOM渲染后获取历史记录，并渲染，避免网络情况异常导致pop框出不来
                that.bindEvent();

            // 非首次点击
            } else {
                $("#selfSites").html(SelfSiteHandler.updateSelfSites()); // 更新已收藏网址
                if(SelfData.length < MAX) {
                    $("#setSite").find(".site_add").removeClass("site_disabled");
                }
                $("#popSiteMask, #popSiteWrap").show(); // 显示pop框
                HistoryHandler.getHistory(HistoryHandler.updateHistory); // 更新历史记录，去重

            }
            $("#siteUrl").focus();
        },

        // 绑定事件
        bindEvent: function() {

            var that = this;

            HistoryHandler.bindEvent();
            SiteHandler.bindEvent();
            SelfSiteHandler.bindEvent();
            if(SUGURL) {
                InputSug.bindEvent();
            }

            // pop框按钮开关的事件注册
            $("#popupClose").on("mouseover", function() {
                $(this).addClass("popup-site_close-hover");
            })
            .on("mouseout", function() {
                $(this).removeClass("popup-site_close-hover");
            })
            .on("click", function() {
                that.closePop();
            });

            // 防止直接刷新页面时localStorage不保存
            $(window).on("beforeunload", function() {
                localStorage.setItem("customSite", $.toJSON({list: SelfData})); // 更新localStorage
            });

            // CMS网站hover、点击事件注册
            $("#popCms").on("mouseenter", ".site_item", function() {
                $(this).addClass("site_item-hover");
            })
            .on("mouseleave", ".site_item", function() {
                $(this).removeClass("site_item-hover");
            })
            .on("click", ".site_item", function() {
                SiteHandler.addDirectSite($(this));
            });

        },

        // 初始化
        init: function() {

            var that = this;
            // 覆盖热区下拉层默认点击事件
            $("#add-btn").on("click", function(e) {
                e.stopPropagation();
                that.render(that.isRendered);
                that.isRendered = true;

                // CMS更新提醒只出现一次
                var remind = $("#add-btn").find(".popup-site_remind");
                remind.length && remind.remove();
            });
        }
    };
    

    if (supportCookie && window.localStorage) {
        PopupSite.init();
    } else {
        
    }

});
