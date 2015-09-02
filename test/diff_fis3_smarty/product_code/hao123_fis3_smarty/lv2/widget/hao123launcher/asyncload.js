(function() {
    window.hao123 || (window.hao123 = {});


    function renderPagelet(obj, pageletsMap, rendered, conId) {
        if (obj.id in rendered) {
            return;
        }
        rendered[obj.id] = true;

        if (obj.parent_id) {
            renderPagelet(
                pageletsMap[obj.parent_id], pageletsMap, rendered, conId);
        }

        //
        // 将pagelet填充到对应的DOM里
        //

        
        var dom; 
        if( obj.id && ( dom = document.getElementById(obj.id) ) ){
            dom.innerHTML = obj.html;
            //有指定的id
        } else{
            dom = document.getElementById(conId),
            fragment = document.createElement("div");
            fragment.innerHTML = obj.html;
            dom.appendChild(fragment);
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


    function render(pagelets, conId) {
        if (!(pagelets instanceof Array)) {
                pagelets = [pagelets];
        }

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
            renderPagelet(pagelets[i], pageletsMap, rendered, conId);
        }
    }


    function process(data, conId) {
        //
        if( data.status && data.status !== "200" ){
            throw Error(data.info);
        }
        var rm = data.resource_map;
        if (rm.async) {
            require.resourceMap(rm.async);
        }


        if (rm.css) {
            hao123.lazyLoad.css(rm.css, function() {
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
                render(data.pagelets, conId);
                if (rm.js) {
                    hao123.lazyLoad.js(rm.js, function() {
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
            //执行html
            data.pagelets && render(data.pagelets, conId);
            if (rm.js) {
                hao123.lazyLoad.js(rm.js, function() {
                    rm.script && window.eval(rm.script);
                });
            }
            else {
                rm.script && window.eval(rm.script);
            }
        }
    }
    /*
         
          根据参数id异步请求服务器对应的widget
          @method asyncLoad
          @param {object} {
                widgetId @array 需获取的widget id ,例如：[{id:'widgetid1'},{id:'widgetid2'}],
                widgetName @string 需要编译的模块名称
                module @string widget所属的模块，例如：home,app
                containerId @string widget对应html挂着容器id
                fileType @string widget的文件类型，默认是tpl
                api @string 请求url地址，默认为openapi

          }
    
    */


    function asyncLoad(param) {
            //需获取widget id
        var widgetId = param['widgetId'],
            //
            conId = param['containerId'],
            obj, 
            arr = [],
            params,
            //请求api地址
            apiUrl = param['api'] || "/openapi",
            //apiurl是否需要补全
            apiUrl = /^http/.test(apiUrl) ? apiUrl : (location.protocol + "//" + location.host + apiUrl + location.search),
            module = param['module'],
            //widgetName
            widgetName = param['widgetName'];

        //过滤url中的锚点定位
        apiUrl = apiUrl.split("#")[0];

        //兼用内部fis模块
        if( widgetId ){
            if (!(widgetId instanceof Array)) {
                widgetId = [widgetId];
            }
            for (var i = widgetId.length - 1; i >= 0; i--) {
                obj = widgetId[i];
                if (!obj.id) {
                    throw new Error('missing pagelet id');
                }
                arr.push('pagelets[]=' + obj.id);
            }
        }
        // 支持通用iframe，通过传入appType来进行区分实例化的iframe内容
        if( param.appType ){
            arr.push( 'appType=' + param['appType'] );
        }

        //widget的文件类型，默认为js
        param['fileType'] && arr.push('fileType=' +  param['fileType']);
        //标识请求类型
        arr.push('widgetName='+widgetName, 'module='+module, "containerId="+conId,"method=jsonp","callback=hao123.process");
        //额外的参数
        if( (params = param['params'] ) ){
            for(var key in params){
                arr.push(key + "=" + params[key]);
            }
        }
        //请求完整地址
        apiUrl = apiUrl + ( apiUrl.indexOf("?") > -1  ? "&" : "?") + arr.join('&');
        //请求模块内容
        hao123.getJSON({
            url: apiUrl
        });
    }
    hao123.process = process;
    hao123.asyncLoad = asyncLoad;
})();
