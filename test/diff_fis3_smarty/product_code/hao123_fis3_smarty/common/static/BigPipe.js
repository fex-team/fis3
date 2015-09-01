var BigPipe = function() {

    function ajax(url, cb, data) {
        var xhr = new XMLHttpRequest;
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                cb(this.responseText);
            }
        };
        xhr.open(data?'POST':'GET', url + '&t=' + ~~(1e6 * Math.random()), true);
        if (data) xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(data);
    }


    function renderPagelet(obj, pageletsMap, rendered, specificId) {
        if (obj.id in rendered) {
            return;
        }
        rendered[obj.id] = true;

        if (obj.parent_id) {
            renderPagelet(
                pageletsMap[obj.parent_id], pageletsMap, rendered);
        }

        //
        // 将pagelet填充到对应的DOM里
        //

        //有指定的id 

        if( specificId ){
            var dom = document.getElementById(specificId),
                fragment = document.createElement("div");
            fragment.innerHTML = obj.html;
            dom.appendChild(fragment);
        } else{
            var dom = document.getElementById(obj.id);
            if (!dom) {
                dom = document.createElement('div');
                dom.id = obj.id;
                document.body.appendChild(dom);
            }
              dom.innerHTML = obj.html;
        }
        
        var fragment = document.createElement("div"),
            scriptText = [],
            text = "",
            node;
        fragment.innerHTML = obj.html;
        scriptText = fragment.getElementsByTagName("script");
        for (var i = scriptText.length - 1; i >= 0; i--) {
            node = scriptText[i];
            text = node.text || node.textContent || node.innerHTML || "";
            window[ "eval" ].call( window, text );
        };
    }


    function render(pagelets, specificId) {
        var i, n = pagelets.length;
        var pageletsMap = {};
        var rendered = {};

        //
        // 初始化 pagelet.id => pagelet 映射表
        //
        for(i = 0; i < n; i++) {
            var obj = pagelets[i];
            pageletsMap[obj.id] = obj;
        }

        for(i = 0; i < n; i++) {
            renderPagelet(pagelets[i], pageletsMap, rendered, specificId);
        }
    }


    function process(data, specificId) {
        var rm = data.resource_map;

        if (rm.async) {
            require.resourceMap(rm.async);
        }


        if (rm.css) {
            LazyLoad.css(rm.css, function() {
                if (rm.style) {
                    var dom = document.createElement('style');
                    dom["type"] = "text/css";
                    if (dom.styleSheet) { // IE
                        dom.styleSheet.cssText = rm.style;
                    } else {
                        dom.innerHTML = rm.style;
                    }
                    document.getElementsByTagName('head')[0].appendChild(dom);
                }
                render(data.pagelets, specificId);
                if (rm.js) {
                    LazyLoad.js(rm.js, function() {
                        rm.script && window.eval(rm.script);
                    });
                }
                else {
                    rm.script && window.eval(rm.script);
                }
            });
        } else {
            if (rm.style) {
                var dom = document.createElement('style');
                dom["type"] = "text/css";
                if (dom.styleSheet) { // IE
                    dom.styleSheet.cssText = rm.style;
                } else {
                    dom.innerHTML = rm.style;
                }
                document.getElementsByTagName('head')[0].appendChild(dom);
            }
            render(data.pagelets, specificId);
            if (rm.js) {
                LazyLoad.js(rm.js, function() {
                    rm.script && window.eval(rm.script);
                });
            }
            else {
                rm.script && window.eval(rm.script);
            }
        }
    }


    function asyncLoad(arg, widgetPath, specificId) {
        if (!(arg instanceof Array)) {
            arg = [arg];
        }
        var obj, arr = [];
        for (var i = arg.length - 1; i >= 0; i--) {
            obj = arg[i];
            if (!obj.id) {
                throw new Error('missing pagelet id');
            }
            arr.push('pagelets[]=' + obj.id);
        }
        var apiPath =  "/fetchwidget",
            //判断是否使用api接口获取widget内容
            url = widgetPath ? (location.protocol + "//" + location.host + apiPath + location.search) : location.href,
            //判断是否传递参数给api
            param = widgetPath ? ["&name="+ widgetPath] : [];
        //过滤url中的锚点定位
        url = url.split("#")[0];
        //补全url
        url = url + ( url.indexOf("?") > -1  ? "&" : "?") + arr.join('&') + param.join('&');
        //test ajax no debug's `mode=`
        url=url.replace(/mode=\d*&/, '');

        ajax(url, function(res) {
            var data = window.JSON?
                JSON.parse(res) :
                eval('(' + res + ')');

            process(data, specificId);
        });
    }

    return {
        asyncLoad: asyncLoad
    }
}();
