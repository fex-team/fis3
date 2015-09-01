<%*      FIS迁移后，将base.tpl/base-rtl.tpl合并为一个，因为它们最大的差别就是dir="ltr/rtl"的区别；后续，这个可以在cms的base中配置$head.dir       *%>
<%assign var="head" value=$root.head%>
<%assign var="body" value=$root.body%>
<%assign var="html" value=$root.html%>
<%cdn url="<%$head.cdn%>"%>
<!doctype html>
<%if empty($head.dir)%>
	<%$head.dir='ltr'%>
<%/if%>

<%$htmlParam = "xmlns:ie<%if !empty($head.dir)%> dir=\"<%$head.dir%>\"<%/if%><%if !empty($body.snsShare)%> itemscope itemtype=\"http://schema.org/Article\" xmlns:fb=\"http://ogp.me/ns/fb#\"<%/if%><%if !empty($head.lang)%> lang=\"<%$head.lang%>\"<%/if%><%if $head.flowLayout === "2"%> class=\"w960\"<%elseif $head.flowLayout === "3"%> class=\"w1020\"<%/if%>"%>

<%html framework="common:static/mod.js" "<%$htmlParam%>" fid="globalhao123" smapleRate="1"%>
	<%head%>
		<meta charset="UTF-8" />
		<%* 预取dns*%>
		<%if !empty($head.prefetch)%>
			<%foreach $head.prefetch as $prefetch%>
				<link rel="<%if !strpos($smarty.server["HTTP_USER_AGENT"], "MSIE 9.0")%>dns-<%/if%>prefetch" href="<%$prefetch%>" />
			<%/foreach%>
			<%if !empty($head.prefetchOff)%>
			    <meta http-equiv="x-dns-prefetch-control" content="off">
			<%/if%>
		<%/if%>
		<base target="_blank"></base>
		<title><%$head.title|escape:"html"%></title>
		<meta name="keywords" content="<%$head.keywords|escape:"html"%>">
		<meta name="description" content="<%$head.description|escape:"html"%>">
        <%*巴西GOOGLE SEO meta*%>
        <%if !empty($head.forGoogleSeo)%>
            <meta name="p:domain_verify" content="4a92c13ab805755d1f02cb67ff5dd773">
        <%/if%>
        <%* 其它meta信息 *%>
        <%if !empty($head.metas)%>
			<%foreach $head.metas as $item%>
			<meta name="<%$item.name%>" content="<%$item.content%>">
			<%/foreach%>
        <%/if%>
        <%* SEO canonical参数*%>
        <%if !empty($head.canonical)%>
        	<link rel="canonical" href="<%$head.canonical%>" />
        <%/if%>
		<%if !empty($body.snsShare)%>
			<meta name="title" content="<%$body.snsShare.content.title%>">
		    <meta itemprop="name" content="<%$body.snsShare.content.title%>">
		    <meta itemprop="description" content="<%$body.snsShare.content.description%>">
			<link rel="image_src" href="<%$body.snsShare.content.logoSrc%>" />
	    <%/if%>
	    <%if !empty($html.prefetchContents)%><%$html.prefetchContents%><%/if%>
	    <%*Global var*%>
		<%widget name="common:widget/global-conf/global-conf.tpl"%>
	    <script><%* 压缩自/widget/ut/ut/ut-ori.js *%>
		var UT={url:"/img/gut.gif",send:function(e,t){e=e||{};var n=window.conf.UT,r=t&&t.url||this.url,i=t&&t.params||n.params,s=e.r=+(new Date),o=window,u=encodeURIComponent,a=o["UT"+s]=new Image,f,l=[];if(i)for(var c in i)i[c]!==f&&e[c]===f&&(e[c]=i[c]);for(f in e)l.push(u(f)+"="+u(e[f]));a.onload=a.onerror=function(){o["UT"+s]=null},a.src=r+"?"+l.join("&"),a=l=null},attr:function(e,t){var n=e.getAttribute("log-mod");if(!n)e.parentNode&&e.parentNode.tagName.toUpperCase()!="BODY"&&this.attr(e.parentNode,t);else{var r=e.getAttribute("log-index");r&&(t.modIndex=r),t.modId=n}},link:function(e){var t={},n=e.getAttribute("href",2);n&&(/^(javascript|#)/.test(n)?(t.ac="b",t.url="none"):(t.ac="a",t.url=n));var r=e.getAttribute("log-index");r&&(t.linkIndex=r);var i=e.getAttribute("data-sort")||"";i&&(t.sort=i,t.value=e.getAttribute("data-val")||"");var isad=e.getAttribute("log-isad");isad=="1"&&(t.ad=1);var s=e.getAttribute("log-oid");return s&&(t.offerid=s),this.attr(e,t),t}};
	    </script>
	    <%block name="headInfo"%><%/block%>
	    <%if empty($head.noBaseCss)%>
	        <%widget name="common:widget/css-base/css-base.tpl"%>
	    <%/if%>
		<%foreach $head.confCSS as $value%>
		<%if !empty($value.href)%><link rel="stylesheet" href="<%$value.href%>" /><%/if%>
		<%/foreach%>
		<%strip%>

		
		<script>
			var pageId="<%$head.pageId%>";

			<%* 针对所有页面，将tn值，传入到cookie，用于持续(session内)跟踪渠道信息 *%>
			<%* 如果是同域跳转，忽略；如果是非同域进入（主动输入/search/收藏夹/facebook等），更新tn值;如果是非同域跳转或者referrer为空，将referrer的host部分或空值以gl_ref植入Cookie中 *%>
			<%* 如果是同域跳转，首页的情况gl_ref植入“/”，二级页的情况gl_ref取“.com”和后面“.”或“/”或“?”之间的值 *%>
			if((document.referrer||'').indexOf(location.protocol+'//'+location.host) !== 0) {
				document.cookie='gl_tn='+(location.search.match(/\btn=([\w-]+)/i) || [0,'/'])[1]+'; path=/';
				document.cookie='gl_fr='+(decodeURIComponent(location.search).match(/\bfr=([\w-+,/]+)/i) || [0,'/'])[1]+'; path=/';
			    document.cookie="gl_ref="+(document.referrer?(document.referrer && document.referrer.match(/\/{2}([^\/]+)\/{1}/)[1]):"")+"; path=/";
			}else{
				document.cookie="gl_ref="+document.referrer.replace(location.protocol+'//'+location.host,"").match(/\/{1}[^\.|\?|\/]*/)[0]+"; path=/";
			}

		<%if !empty($head.gaId)%>
			var _gaq = _gaq || [];
            _gaq.push(['_setAccount', '<%$head.gaId%>']);
            _gaq.push(['_trackPageview']);
            (function() {
                var ga = document.createElement('script');
                ga.type = 'text/javascript';
                ga.async = true;
                ga.src = 'http://stats.g.doubleclick.net/dc.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(ga, s);
            })();
		<%/if%>
		</script>
		<%/strip%>
		<%* 标示fis产出的 inline 、link css位置*%>
		<%cssposition%>
		<%if !empty($head.fontFamily) || !empty($head.fontSize)%>
			<%style%>
				<%if !empty($head.fontFamily)%>
				    html body {font-family:<%$head.fontFamily%>;}
				<%/if%>
				<%if !empty($head.fontSize)%>
				    body {font-size:<%$head.fontSize%>;}
				<%/if%>
			<%/style%>
		<%/if%>
		<%$html.head%>
		<%$html.baseHead%>
		<%$html.hotsiteMergeHead%>
	<%/head%>
	<%* web speed 打点*%>
	<%block name="vsWebspeedHead"%><%/block%>

	<%body class="<%if !empty($head.flowLayout)%>flow-on<%/if%>"%>
		<%if $head.pageLevel == 1 && !$head.noCssHook %>
			<%csshook%>
		<%/if%>
		<%*Flow layout*%>
		<%if !empty($head.flowLayout)%>
			<script>
				window.conf || (window.conf = {});
				<%*页面使用哪种布局的标志位*%>
				conf.flowLayout = <%$head.flowLayout%>;
				<%*共有几种布局方案的配置，选填，不填则使用默认值*%>
				<%if !empty($head.flowConf)%>conf.flowConf = <%json_encode($head.flowConf)%>;<%/if%>
			</script>
			<%*引入动态判断布局js*%>
			<script src="/static/flow-layout.js?__inline"></script>
		<%/if%>
		<%* UT log *%>
		<script>
		<%* 不发统计(for bav mini)*%>
	    <%block name="redirectUt"%><%/block%>

	         <%* 进入页面不发送统计，点击才发(for topbar)*%>
			<%block name="noSendAccessUt"%>
			    UT.send({
				  	type:"<%if $head.partnerIframe == "1"%>p<%/if%>access",
				  	tn:(document.cookie.match(/(?:^| )gl_tn(?:(?:=([^;]*))|;|$)/) || document.referrer.match(/\btn=([\w-]+)/i) || [0,'/'])[1],
				  	guid:(location.search.match(/(^|&|\\?)guid=([^&]*)(&|$)/i) || [0,0,""])[2]
			  	});
			<%/block%>

			!function(W,D,A,E,handle){D[A]?D[A](E,handle,!1):D.attachEvent("on"+E,handle)}(window,document,"addEventListener","mousedown",function(e){e=e||event;var t=e.target||e.srcElement;for(var n=0;n<=2;n++){if(t.tagName==="BODY"||t.tagName==="HTML")break;if(t.tagName==="A"){var data=UT.link(t);data.position="links";UT.send(data);break}else if(t.getAttribute("data-utsend")){var data=UT.link(t);data.ac="b";t.getAttribute("data-pos")&&(data.position=t.getAttribute("data-pos"));UT.send(data);break}t=t.parentNode}});
        </script>
		<%if !empty($head.trackSAction) && !empty($head.trackSAction.tnExp) && preg_match($head.trackSAction.tnExp, $root.urlparam['tn'])%>
            <%* 特殊统计代码验证 *%>
                <%$head.trackSAction.code%>
        <%/if%>

		<%if !empty($head.effectiveMeature)%>
		<script>!function(){var b,a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src="http://me-cdn.effectivemeasure.net/em.js",b=document.getElementsByTagName("script")[0],b.parentNode.insertBefore(a,b)}()</script>
		<%/if%>

		<%if empty($head.noBaseUt)%>
		    <%widget name="common:widget/ut-log/ut-log.tpl"%>
		<%/if%>

		<%block name="layout"%><%/block%>

		<ie:homepage id="ieSetHomePage" style="behavior:url(#default#homepage);" />
		<%if !empty($head.statusOK)%><%$head.statusOK%><%/if%>
		<%* web speed 打点*%>
		<%block name="vsWebspeedBody"%><%/block%>
	<%/body%>
	
	<%foreach $head.confJS as $value%>
	    <%if !empty($value.src)%>
	        <script type="text/javascript" src="<%$value.src%>"></script>
	    <%/if%>
	<%/foreach%>
	<%$html.foot%>
	<%$html.baseFoot%>
<%/html%> 
