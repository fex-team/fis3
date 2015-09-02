if(conf.flowLayout == 1){
	!function(prefix, queries, speed) {
	    var WIN = window
	        , DOC = document
	        , resizing = 0
	        , addEventListener = WIN.addEventListener
	        , respond = function(body) {
	            body = DOC.documentElement;
	            if(!body) return;
	            var className = body.className
	                , match = function(width, queries) {
	                    if(width >= +queries[0].k) return 0;
	                    for(var l = queries.length, q; q = +queries[--l].k;) {
	                        if(width > q) return l;
	                    }
	                }(body.clientWidth || WIN.innerWidth || 0, (queries || []).sort(function(a, b) {
	                    return +b.k - +a.k;
	                }));
	            if (match >= 0 && !~className.indexOf(prefix + queries[match].v)) {
                    /*conf.curLayout：页面当前使用布局的宽度*/
                    conf.curLayout = +queries[match].v;
                    body.className = className.replace(new RegExp("\\s*" + prefix + "\\d+\\s*", "g"), "") + " " + prefix + conf.curLayout;
                    /*通知其它模块layout变化的message频道名称为"module.flow.switch",发送通信时传递的参数是当前页面对应的宽度，示例如下：message.send("module.flow.switch",width);接收通信的模块需要添加代码示例如下：message.on("module.flow.switch",function(width){});*/
                    window.Gl && Gl.message && Gl.message.send("module.flow.switch", conf.curLayout)
                }
	        }
	    respond();
	    setTimeout(function() {
	        (addEventListener ? addEventListener : WIN.attachEvent)((addEventListener ? "" : "on") + "resize", function() {
	            resizing = 1;
	        });
	    }, 0);
	    !function() {
	        if(resizing) {
	            resizing = 0;
	            respond();
	        }
	        setTimeout(arguments.callee, speed || 200)
	    }();
	}/*参数可配*/(
		// the prefix of class name
	    "w"

	    // queries list
	    , conf.flowConf || [{k: 1, v: "960"}, {k: 1024, v: "1020"}]

	    // switch speed, default: 200
	    // , 200
	);
}else{
	/*页面当前使用布局的宽度*/
	conf.curLayout = conf.flowLayout == 3 ? 1020 : 960;
}
