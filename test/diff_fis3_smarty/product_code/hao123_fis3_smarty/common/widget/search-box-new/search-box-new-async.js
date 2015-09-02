/*
 * Search box group
 */

var $ = require("common:widget/ui/jquery/jquery.js"),
    UT = require("common:widget/ui/ut/ut.js"),
    helper = require("common:widget/ui/helper/helper.js");

require("common:widget/ui/suggest/suggest.js");
require('common:widget/ui/jquery/jquery.cookie.js');

Gl.searchGroup = function(o) {

    var _conf = conf.searchGroup,
        type = o.type || "index",
        logoPath = _conf.conf[type].logoPath,
        defaultN = _conf.conf[type].curN || 0,

        logo = $("#searchGroupLogo"), 
        logoGroup = $("#searchGroupLogos"),
        tabs = $("#searchGroupTabs"),
        form = $("#searchGroupForm"),
        input = $("#searchGroupInput"),
        btn = $("#searchGroupBtn"),
        params = $("#searchGroupParams"),
        hSeWords = $("#hotSearchWords"),
        webEngine = $("#searchGroupWebEngine"),
        inputWrap = input.parent(),

        curTab = $("a:eq(" + defaultN + ")", tabs),
        curWordTab = curTab.attr("data-t"),
        defaultData = _conf.sug[_conf.list[curWordTab].engine[defaultN].id],

        //record which form was selected in tabs
        storeForm = {},
        onceTime = true,
        logoHash = {
            'yahoo': 'yahoo',
            'google': 'google',
            'baidu': 'baidu',
            'defau': 'defau'
        },
        defaultTab = _conf.conf[type].defaultTab || 'web',

        $bd = $(document.body),

        
        getCurLogo = function(attr) {
            var tmpObj = null;
            attr = attr.toLowerCase();
            for (var i in logoHash) {
                if (attr.search(i) > -1) {
                    tmpObj = logoHash[i];
                    break;
                }
            }
            if (tmpObj === 'yahoo' && conf.country === 'jp') {
                tmpObj = 'yahoo_jp';
            }
            return (tmpObj || 'defau');
        },

        //reset the form about action and params
        resetForm = function(data, n) {

            var ret = [];
            var theLogoPath = $bd.hasClass("skin-type-dark") ? (_conf.conf[type].logoPath + "dark/") : _conf.conf[type].logoPath;
            var logoGroupDt = $("dt", logoGroup).clone();
            var isFixed = $bd.hasClass("header-fixed-up");

            // Fixed bug in IE8
            logoGroup.html('');
            logoGroup.append(logoGroupDt);

            // rebinding logo element
            logo = $("#" + (o.logoId || "searchGroupLogo"), logoGroupDt);

            form.attr("action", data[n].action);
            input.attr("name", data[n].q);

            logo.attr("alt", data[n].name);
            logo.parent().attr("title", data[n].name);
            logo.parent().attr("data-n", n);
            logo.attr("data-id", data[n].id);

            if (isFixed) {
                logo.attr("src", "/resource/fe/headerTest/search/" + getCurLogo(data[n].logo) + ".png");
            } else {
                logo.attr("src", theLogoPath + data[n].logo + ".png");
            }

            logoGroup.append(function() {
                ret = [];
                $.each(data, function(key, val) {
                    if (isFixed) {
                        ret.push('<dd class="box-search_logo_hide"><a href="#" onclick="return false" title="' + val.name + '" hidefocus="true" data-n="' + key + '"><img id="searchGroupLogo_' + key + '" src="/resource/fe/headerTest/search/' + getCurLogo(val.logo) + '.png" alt="' + val.name + '" /><span class="box-search-logo-item-tips">' + val.name + '</span></a></dd>');
                    } else {
                        ret.push('<dd class="box-search_logo_hide"><a href="#" onclick="return false" title="' + val.name + '" hidefocus="true" data-n="' + key + '"><img id="searchGroupLogo_' + key + '" src="' + theLogoPath + val.logo + '.png" alt="' + val.name + '" /></a></dd>');
                    }
                });
                return ret.join("");
            });

            params.html(function() {
                ret = [];
                $.each(data[n].params, function(key, val) {
                    ret.push('<input type="hidden" name="' + key + '" value="' + val + '">');
                });
                return ret.join("");
            });

            if (data.length <= 1) {
                logoGroup.addClass("box-search_logo_disabled");
            } else {
                logoGroup.removeClass("box-search_logo_disabled");
            }
        },

        resetSug = function(data, n) {
            data = _conf.sug[data[n].id];
            $.each(data, function(key, val) {
                sug.o[key] = val;
            });

            //fix more prams
            !data.templ && (sug.o.templ = false);
            !data.callbackFn && (sug.o.callbackFn = false);
            !data.callbackDataKey && (sug.o.callbackDataKey = false);
            !data.callbackName && (sug.o.callbackName = false);
            !data.callbackDataNum && (sug.o.callbackDataNum = false);
            !data.customUrl && (sug.o.customUrl = false);

            !data.charset && (sug.o.charset = undefined);
            sug.reset(true);
        },

        // toggle for baidu sug
        resetBaiduSug = function(data, n) {

            if (!baidu_sug) {
                return;
            }

            data = data ? data[n].baiduSug : false;

            if (data) {
                baidu_sug.setMode(data.mod);
                baidu_sug.toggle(true);
            } else {
                baidu_sug.toggle(false);
            }
        },

        // toggle for PS video sug
        resetBaiduVideoSug = function(data, n) {
            if (!window["baidu_video_sug"]) {
                return;
            }

            data = data ? data[n].otherSug : false;

            if (data) {
                baidu_video_sug.setMode(data.mod);
                baidu_video_sug.toggle(true);
            } else {
                baidu_video_sug.toggle(false);
            }
        },

        switchTab = function(tab, sugStay) {

            tab = $(tab);
            curTab.removeClass("cur");
            tab.addClass("cur");
            curTab = tab;

            var t = tab.attr("data-t");
            var engines = _conf.list[t].engine;
            var engLen = engines.length;

            //ps sug gut add tab changed name
            tabCategoryName = t;

            //if the last element is null, remove it
            if ($.isEmptyObject(engines[engLen - 1])) {
                engines.length = engLen - 1;
            };

            //record current form(add the current type to storeForm as a key)
            storeForm[t] || (storeForm[t] = 0);

            //reset form
            resetForm(engines, storeForm[t]);

            //reset suggest
            !sugStay && resetSug(engines, storeForm[t]);

            // reset PS video sug
            !sugStay && resetBaiduVideoSug(engines, storeForm[t]);

            // reset baidu sug
            !sugStay && resetBaiduSug(engines, storeForm[t]);
        },

        showLogo = function() {
            var n = logo.parent().attr("data-n");
            var logoList = $("dd", logoGroup);
            var isFix = $bd.hasClass("header-fixed-up");
            var logLen = logoList.length;

            if (logoGroup.hasClass("box-search_logos_show")) {
                logoGroup.removeClass("box-search_logos_show");
                logoList.each(function() {
                    $(this)
                        .addClass("box-search_logo_hide")
                        .removeClass("box-search_logo_first box-search_logo_last");
                });
            } else {
                logoGroup.addClass("box-search_logos_show");
                logoList.each(function(key) {
                    var $that = $(this);

                    if (onceTime) {
                        var $imgEle = $that.find("img").first();
                        if ($imgEle.attr("data-src")) {
                            $imgEle.attr("src", $imgEle.attr("data-src"));
                            $imgEle.removeAttr("data-src");
                        }
                    }

                    key != n && $that.removeClass("box-search_logo_hide");
                    if (isFix && (logLen > 1) && (key != n)) {
                        if (n == 0) {
                            if (key === 1) {
                                $that.addClass("box-search_logo_first");
                            }
                            if (key === logLen - 1) {
                                $that.addClass("box-search_logo_last");
                            }
                        } else if (n == logLen - 1) {
                            if (key === 0) {
                                $that.addClass("box-search_logo_first");
                            }
                            if (key === logLen - 2) {
                                $that.addClass("box-search_logo_last");
                            }
                        } else {
                            if (key === 0) {
                                $that.addClass("box-search_logo_first");
                            }
                            if (key === logLen - 1) {
                                $that.addClass("box-search_logo_last");
                            }
                        }
                    }
                });
                onceTime = false;
            }
        },

        //sug instantiation
        sug = Gl.suggest(input[0], {
            classNameWrap: "sug-search",
            classNameQuery: "sug-query",
            classNameSelect: "sug-select",
            delay: _conf.conf[type].delay,
            n: _conf.conf[type].n,
            autoFocus: false,
            requestQuery: defaultData.requestQuery,
            requestParas: defaultData.requestParas,
            url: defaultData.url,
            callbackFn: defaultData.callbackFn,
            callbackDataKey: defaultData.callbackDataKey,
            onCheckForm: function(form) {

                if (!(/^hao123$/.test(logo.attr("data-id")))) return;

                if (!$(form).find("input[name='haobd']").get(0)) {
                    $(form).append("<input type='hidden' name='haobd' value='" + $.cookie('BAIDUID') + "' />");
                }
            },
            onMouseSelect: function(li) {
                var t = curTab.attr("data-t");
                var _action = _conf.list[t].engine[storeForm[t]].action;
                var utObj = {
                    type: "click",
                    position: "search",
                    engine: _conf.list[t].engine[storeForm[t]].id.toLowerCase(),
                    value: encodeURIComponent(input.val()),
                    modId: "search",
                    element: "sug",
                    tab: t
                };

                //fix action
                if (/#\{([^}]*)\}/mg.test(_action)) {
                    form.attr("action", helper.replaceTpl(_action, {
                        q: encodeURIComponent(input.val())
                    }));
                    input.attr("disabled", true);
                    setTimeout(function() {
                        input.attr("disabled", false);
                    }, 16);
                }
                input.select();

                if ($bd.hasClass("header-fixed-up")) {
                    utObj.sort = "header";
                }
                UT.send(utObj);
            },
            templ: defaultData.templ
        });


    //ps sug gut add tab 
    window.tabCategoryName = curTab.attr("data-t");

    //clear the input's value after refresh
    input.val("");

    //record the default form'n
    storeForm[curTab.attr("data-t")] = 0;

    //select text in input after submit
    form.on("submit", function() {
        // input.select();
        var t = curTab.attr("data-t"),
            _action = _conf.list[t].engine[storeForm[t]].action,
            _url = _conf.list[t].engine[storeForm[t]].url,
            val = encodeURIComponent(input.val()),
            utObj = {
                type: "click",
                position: "search",
                engine: _conf.list[t].engine[storeForm[t]].id.toLowerCase(),
                modId: "search",
                element: "input",
                tab: t,
                value: val
            };

        if (/^hao123$/.test(logo.attr("data-id"))) {
            if (!form.find("input[name='haobd']").get(0)) {
                form.append("<input type='hidden' name='haobd' value='" + $.cookie('BAIDUID') + "' />");
            }
        }
        form.attr("action", _action);


        // set charset to big5 while the engine is ruten
        if (t == "shopping" && /ruten.png/.test(logo.attr("src"))) {
            form[0].acceptCharset = document.charset = "big5";
        } else {
            form[0].acceptCharset = document.charset = "utf-8";
        }

        if ($bd.hasClass("header-fixed-up")) {
            utObj.sort = "header";
        }

        UT.send(utObj);

        input.select();

        //fix action
        if (/#\{([^}]*)\}/mg.test(_action)) {
            form.attr("action", helper.replaceTpl(_action, {
                q: val
            }));
            input.attr("disabled", true);
            setTimeout(function() {
                input.attr("disabled", false);
                input.select();
            }, 16);
        }

    });

    resetBaiduVideoSug(_conf.list[curTab.attr('data-t')].engine, defaultN);

    resetBaiduSug(_conf.list[curTab.attr('data-t')].engine, defaultN);

    //to let lv2 page NOT to auto focus SEARCH INPUT! by NE
    if (o.autoFocus == null) {
        o.autoFocus = true; //default TRUE!
    }
    if (o.autoFocus) {
        input.focus();
    }

    input.on("focus", function() {
        inputWrap.addClass("box-search_focus");
    });
    input.on("blur", function() {
        inputWrap.removeClass("box-search_focus");
    });

    tabs.on("mousedown", function(e) {
        var el = e.target,
            tabTo;
        el.tagName === "SPAN" && (el = el.parentNode);

        tabTo = el.getAttribute("data-t");
        if (tabTo) {
            switchTab(el);
            UT.send({
                type: "click",
                position: "switchTab",
                modId: "search",
                sort: tabTo
            });
        }
        form.acceptCharset = document.charset = "utf-8";

        setTimeout(function() {
            input.focus();
        }, 5);
    });

    conf.pageType !== "lv2" && window["PDC"] && PDC.mark("c_sxvi");


    $(document).on("mousedown", function(e) {
        var el = e.target;
        logoGroup.hasClass("box-search_logos_show") && el !== logoGroup[0] && !$.contains(logoGroup[0], el) && showLogo();
    });

    logoGroup.on("click", function(e) {
        var el = e.target,
            $el = $(el),
            $ta = el.tagName,

            t = curTab.attr("data-t"),
            n = storeForm[t],
            _n,
            engines = _conf.list[t].engine,
            engLen = engines.length;

        //remove the last null ,IE8 bug
        if ($.isEmptyObject(engines[engLen - 1])) {
            engines.length = engLen - 1;
        };
        if ($ta === "IMG" || $ta === "SPAN") {
            _n = ~~$el.parent().attr("data-n");
        } else if ($ta === "A") {
            _n = ~~$el.attr("data-n");
        } else {
            _n = ~~$el.children().attr("data-n");
        }

        if (curTab.attr("data-t") == "web") {
            webEngine.attr("data-num", _n);
        }


        form[0].acceptCharset = document.charset = "utf-8";


        if (_n !== n) {
            storeForm[t] = _n;
            resetForm(engines, _n);

            //reset suggest
            resetSug(engines, _n);

            //reset PS video sug
            resetBaiduVideoSug(engines, _n);

            //reset baidu sug
            resetBaiduSug(engines, _n);
        }
        showLogo();

    });
    // realize hot search words module
    hSeWords.on("click", function(e) {
        var tar = e.target,
            href = $(tar).attr("href"),
            //data_n  = webEngine.attr("data-num"),
            engine = _conf.list[curWordTab].engine[0], // default first search engine
            urlPath = engine.action, // url string except query string. some search engine end with '?'
            query = engine.q, // query variable
            param = $.param(engine.params), // like a=b&b=2
            hadlParam = param ? ("&" + param) : "", // like &a=b&b=2 or ""
            url = "";

        if (tar.tagName.toLowerCase() === "a" && href === "#") {
            // handled url
            url = urlPath + (urlPath.charAt(urlPath.length - 1) == "?" ? "" : "?") + query + "=" + encodeURIComponent($(tar).text()) + hadlParam;
            window.open(url);
        }

    });

    // hot search word send search action UT
    hSeWords.on("mousedown", "a", function(e) {
        UT.send({
            type: "click",
            position: "search",
            engine: _conf.list[curWordTab].engine[0].id,
            modId: "hot-word",
            tab: curWordTab,
            value: encodeURIComponent($.trim($(this).attr("data-val")))
        });
        e.stopPropagation(); // avoid links auto UT
    });


    /*for header when fixed & width = 40px*/
    var $window = $(window),
        recordTab = null, // 吸顶时刻如果tab不是web的话记录当前tab
        restoreTo = function() { // 吸顶变正常时恢复之前的tab
            if (recordTab) {
                switchTab(recordTab);
            } else {
                switchTab($("a[data-t='"+defaultTab+"']", tabs), true);
                logoGroup.removeClass("box-search_logos_show");
            }
        },
        transTo = function() { // 正常变吸顶时切到web的tab
            if (curTab.attr("data-t") != defaultTab) {
                recordTab = curTab;
                switchTab($("a[data-t='"+defaultTab+"']", tabs));
            } else {
                recordTab = null;
                switchTab($("a[data-t='"+defaultTab+"']", tabs), true);
                logoGroup.removeClass("box-search_logos_show");
            }
        };

    $window.on("headerFixed.transTo", function() {
        transTo();
    });
    $window.on("headerFixed.restore", function() {
        restoreTo();
    });
}