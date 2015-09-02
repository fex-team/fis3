<%strip%>

<%*   声明对ltr/rtl的css依赖    *%>
<%style%>
<%if $head.dir=='ltr'%> 
	@import url('/widget/404/ltr/ltr.css?__inline');
<%else%> 
	@import url('/widget/404/rtl/rtl.css?__inline');
<%/if%>
<%/style%>

<div class="mod-404">
	<div class="bg-light"></div>
	<div class="bg-deep"></div>
	<div class="bg-cloud"></div>	
	<div class="l-wrap desc-wrap">
		<p class="desc"><%$body.notFound.desc%></p>
		<p class="jump">
			<a href="<%$body.notFound.link%>" target="_self"><%$body.notFound.homeWord%></a>
		</p>
		<%if !empty($body.notFound.linksLv2)%>
		<p class="jump-lv2-title"><%$body.notFound.lv2Title%></p>
		<%*二级页的跳转链接*%>
		<div class="jump-lv2">
			<%foreach $body.notFound.linksLv2 as $value%>
				<a href="<%$value.url%>" class="item"><%$value.name%></a>
			<%/foreach%>
		</div>
		<%/if%>
	</div>
    <div class="bg-content">
        <div class="ad-404">
            <div class="adnl_zone id_4657"></div>
            <script type="text/javascript">
                var ADNL = [];
                ADNL.push(["setConstant", "SCAN_ZONE_CLASS", "adnl_zone"]);
                ADNL.push(["setConstant", "CDN_URL", "//cdn.movi11.com"]); 
                ADNL.push(["setConstant", "SUBID", "0"]);
                ADNL.push(["setConstant", "SITEID", 4768]);
                ADNL.push(["setConstant", "API_URL","//d.movi11.com/api/vv"]);
                ADNL.push(["setConstant", "API_MOBILE_URL","//d.movi11.com/api/mvv"]);
                ADNL.push(["setConstant", "ERR_REPORT_ENDPOINT","//a.movi11.com/api/er"]);
                ADNL.push(["scanZones"]);
                ADNL.push(["initialize", "1"]);

                (function (d) {
                    var s = d.createElement('script');
                    s.src = "//cdn.movi11.com/scripts/1/adnl.min.js";
                    s.type = "text/javascript";
                    d.getElementsByTagName('head')[0].appendChild(s);
                })(document);
            </script>
        </div>
    	<div class="bg-404"></div>
    </div>
</div>

<%/strip%>