<%if !empty($head.webspeed.alog)%>
    <script>
        /* 配置需要统计的模块，不需要的模块不配置即可 */
        window.alogObjectConfig = {
            product: '10',
            page: '<%$head.webspeed.idforWebSpeed%>',
            speed: {
                sample: '<%$head.webspeed.sample|default:1%>'
            },
            exception: { 
                sample: '1'
            }
        };
     
        /* 该段代码必须放在上面的window.alogObjectConfig配置之后 */
        void function(e,t,n,a,r,o){function c(t){e.attachEvent?e.attachEvent("onload",t,!1):e.addEventListener&&e.addEventListener("load",t)}function i(e,n,a){a=a||15;var r=new Date;r.setTime((new Date).getTime()+1e3*a),t.cookie=e+"="+escape(n)+";path=/;expires="+r.toGMTString()}function s(e){var n=t.cookie.match(new RegExp("(^| )"+e+"=([^;]*)(;|$)"));return null!=n?unescape(n[2]):null}function d(){var e=s("PMS_JT");if(e){i("PMS_JT","",-1);try{e=eval(e)}catch(n){e={}}e.r&&t.referrer.replace(/#.*/,"")!=e.r||alog("speed.set","wt",e.s)}}c(function(){alog("speed.set","lt",+new Date),r=t.createElement(n),r.async=!0,r.src=a+"?v="+~(new Date/864e5),o=t.getElementsByTagName(n)[0],o.parentNode.insertBefore(r,o)}),d()}(window,document,"script",__uri("/static/dp.min.js"));
        
        document.addEventListener("DOMContentLoaded", function(event) {
            alog('speed.set', 'drt', +new Date);
        });
        if (document.attachEvent) {
            window.attachEvent("onload", function() {
                PDC.mark("lt")
            }, false)
        } else {
            window.addEventListener("load", function() {
                PDC.mark("let");
                PDC._setFS && PDC._setFS();
            })
        }
    </script>
<%else%>
    <script>
        if (typeof PDC != 'undefined') {
            PDC.idforWebSpeed = "<%$head.webspeed.idforWebSpeed%>";
            PDC.sample = <%$head.webspeed.sample%>;
            <%if !empty($head.webspeedSplit)%>
            try {<%$head.webspeedSplit%>} catch (e) {}
            <%/if%>
            <%if !empty($head.webspeed.startNetTest)%>
            PDC.oldNetTest = {};
            PDC.oldNetTest.sample = <%$head.webspeed.startNetTest.sample%>;
            PDC.oldNetTest.domains = <%json_encode($head.webspeed.startNetTest.domains)%>;
            <%/if%>

             PDC.init({
                is_login: 0,
                sample: PDC.sample,
                <%if !empty($head.webspeed.netTest)%>
                net_test: {
                    sample: <%$head.webspeed.netTest.sample%>,
                    url: "<%$head.webspeed.netTest.url%>"
                },
                <%/if%>
                product_id: 10,
                page_id: PDC.idforWebSpeed
            });

        <%if $sysInfo.country != 'tw' && $sysInfo.country != 'sa'%>
        (function(){PDC.extend({_navTiming:window.performance&&performance.timing,ready:(function(callback){var readyBound=false,readyList=[],DOMContentLoaded,isReady=false;if(document.addEventListener){DOMContentLoaded=function(){document.removeEventListener("DOMContentLoaded",DOMContentLoaded,false);ready()}}else{if(document.attachEvent){DOMContentLoaded=function(){if(document.readyState==="complete"){document.detachEvent("onreadystatechange",DOMContentLoaded);ready()}}}}function ready(){if(!isReady){isReady=true;for(var i=0,j=readyList.length;i<j;i++){readyList[i]()}}}function doScrollCheck(){try{document.documentElement.doScroll("left")}catch(e){setTimeout(doScrollCheck,1);return}ready()}function bindReady(){if(readyBound){return}readyBound=true;if(document.addEventListener){document.addEventListener("DOMContentLoaded",DOMContentLoaded,false);window.addEventListener("load",ready,false)}else{if(document.attachEvent){document.attachEvent("onreadystatechange",DOMContentLoaded);window.attachEvent("onload",ready);var toplevel=false;try{toplevel=window.frameElement==null}catch(e){}if(document.documentElement.doScroll&&toplevel){doScrollCheck()}}}}bindReady();return function(callback){isReady?callback():readyList.push(callback)}})(),Cookie:{set:function(name,value,max_age){max_age=max_age||10;var exp=new Date();exp.setTime(new Date().getTime()+max_age*1000);document.cookie=name+"="+escape(value)+";path=/;expires="+exp.toGMTString()},get:function(name){var arr=document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));if(arr!=null){return unescape(arr[2])}return null},remove:function(name){this.set(name,"",-1)}},_is_sample:function(ratio){if(!PDC._random){PDC._random=Math.random()}return PDC._random<=ratio},_load_analyzer:function(){var special_pages=this._opt.special_pages||[];var radios=[this._opt.sample];for(var i=0;i<special_pages.length;i++){radios.push(special_pages[i]["sample"])}var radio=Math.max.apply(null,radios);if(PDC._is_sample(radio)==false){return}PDC._analyzer.loaded=true;PDC._load_js(PDC._analyzer.url,function(){var callbacks=PDC._analyzer.callbacks;for(var i=0,l=callbacks.length;i<l;i++){callbacks[i]()}})},_load_js:function(url,callback){var script=document.createElement("script");script.setAttribute("type","text/javascript");script.setAttribute("src",url);script.onload=script.onreadystatechange=function(){if(!this.readyState||this.readyState=="loaded"||this.readyState=="complete"){script.onload=script.onreadystatechange=null;if(typeof callback==="function"){callback(url,true)}}};script.onerror=function(e){if(typeof callback==="function"){callback(url,false)}};document.getElementsByTagName("head")[0].appendChild(script)},send:function(){if(PDC._analyzer.loaded==true){WPO_PDA.send()}else{PDC._load_analyzer();PDC._analyzer.callbacks.push(function(){WPO_PDA.send()})}}},PDC);!function(){var Cookie=PDC.Cookie,jt=Cookie.get("PMS_JT"),isset=false;if(jt){Cookie.remove("PMS_JT");jt=eval(jt);if(!jt.r||document.referrer.replace(/#.*/,"")==jt.r){(PDC._render_start-jt.s)>100&&PDC.mark("wt",(PDC._render_start-jt.s))}}function clickHandle(e){var e=e||window.event;var target=e.target||e.srcElement;if(target.nodeName=="A"){var url=target.getAttribute("href");if(!/^#|javascript:/.test(url)){Cookie.set("PMS_JT",'({"s":'+(+new Date)+',"r":"'+document.URL.replace(/#.*/,"")+'"})');isset=true}}}if(document.attachEvent){document.attachEvent("onclick",clickHandle)}else{document.addEventListener("click",clickHandle,false)}}();PDC.ready(function(){PDC.mark("drt")});if(document.attachEvent){window.attachEvent("onload",function(){PDC.mark("lt")},false)}else{window.addEventListener("load",function(){PDC.mark("let");PDC._setFS&&PDC._setFS();PDC._opt.ready!==false&&PDC._load_analyzer()})}})();
        <%else%>
            (function(){__wpo.util._fetched_script_list={};__wpo.util.loadJs=function(b,c){if(__wpo.util._fetched_script_list[b]===true){c();return}var a=document.createElement("script");a.setAttribute("type","text/javascript");a.setAttribute("src",b);a.onload=a.onreadystatechange=function(){if(!this.readyState||this.readyState=="loaded"||this.readyState=="complete"){a.onload=a.onreadystatechange=null;if(typeof c==="function"){c(b,true)}}};document.getElementsByTagName("head")[0].appendChild(a);this._fetched_script_list[b]=true};__wpo.util.extend(__wpo.pdc,{_debug:false,_analysis:function(){this._setFS();var a=this;__wpo.util.loadJs(this._analyzer.url,function(){__wpo.log.setOpt({log_path:a._opt.log_path});__wpo.pda.run(PDC.metadata());var b=a._opt.net_test;if(__wpo.pdc._is_sample(b.sample)){__wpo.network.test(a._opt.product_id,b.url)}if(a._debug===true){console.log(__wpo.pda.getMetrics())}})},run:function(){var a=PDC._opt.sample;if(this._is_sample(a)==false||this._render_start<=0){return}if(document.attachEvent){window.attachEvent("onload",function(){__wpo.pdc._analysis()},false)}else{window.addEventListener("load",function(){__wpo.pdc._analysis()})}},metadata:function(){var d=this._opt;var c={env:{user:(d.is_login==true?1:0),product_id:d.product_id,page_id:d.page_id},time_to_title:this._time_to_title,render_start:this._render_start,timing:this._timing};return c},debug:function(){this._debug=true;var a=this._is_sample();console.info("is sample : "+a);if(a===true){console.log(__wpo.pda.getMmetrics())}else{this._analysis()}}});PDC.run()})();
        <%/if%>
           
        }
    </script>
<%/if%>

