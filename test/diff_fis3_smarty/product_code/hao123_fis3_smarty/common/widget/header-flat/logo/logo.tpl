<%style%>
<%if $head.dir=='ltr'%>
@import url('/widget/header-flat/logo/ltr/ltr.css?__inline');
<%else%>
@import url('/widget/header-flat/logo/rtl/rtl.css?__inline');
<%/if%>
<%/style%>

<%style%>
<%if !empty($body.headerTest.ceilingLogo)%>
.header-fixed #indexLogo {
	background: url(<%$body.headerTest.ceilingLogo%>) no-repeat <%if $head.dir=='ltr'%>left<%else%>right<%/if%> center !important;
}
<%/if%>
<%if !empty($body.headerTest.widget)%>
.userbar-logo {
    width: <%if $head.dir=='ltr'%><%$body.headerTest.logoWidth|default:'345'%><%else%><%$body.headerTest.logoWidth|default:'345'%><%/if%>px;
}
<%/if%>
<%/style%>


<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> 
<%require name="common:widget/header-flat/logo/ltr/ltr.more.css"%> 
<%else%> 
<%require name="common:widget/header-flat/logo/rtl/rtl.more.css"%> 
<%/if%>


<div class="userbar-logo <%if $head.dir=='ltr'%>fl<%else%>fr<%/if%>" log-mod="logo">
	<%* 如果存在匹配的渠道 *%>
	<%if $smarty.cookies.tnValue !== '/' %>
		<%foreach $body.logo.tns as $tnLogo%>
		   	<%if !empty($tnLogo.tnNum) && (preg_match($tnLogo.tnNum, $root.urlparam.tn) || strpos($root.urlparam.tn,$tnLogo.tnNum) !== false) %>
		   		<%$body.logo.url = $tnLogo.url%>
		    	<%$body.logo.src = $tnLogo.src%>
		    	<%$body.logo.indexTitle = $tnLogo.indexTitle%>
		    	<%$body.logo.secTitle = $tnLogo.secTitle%>
		    	<%$body.logo.slogan = $tnLogo.slogan%>
		    	<%$body.logo.sloganSize = $tnLogo.sloganSize%>
		   	<%/if%>
		<%/foreach%>
		<%foreach $body.logoTips.tns as $tnTips%>
		   	<%if !empty($tnTips.tnNum) && (preg_match($tnLogo.tnNum, $root.urlparam.tn) || strpos($root.urlparam.tn,$tnTips.tnNum) !== false) %>
		   		<%$body.logoTips.url = $tnTips.url%>
		    	<%$body.logoTips.text = $tnTips.text%>
		    	<%$body.logoTips.closeText = $tnTips.closeText%>
				<%$body.logoTips.version = $tnTips.version%>
		    	<%$body.logoTips.show = $tnTips.show%>
		    	<%$body.logoTips.alwaysShow = $tnTips.alwaysShow%>
		    	<%$body.logoTips.userOption = $tnTips.userOption%>
		    	<%$body.logoTips.tipsWidth = $tnTips.tipsWidth%>
		   	<%/if%>
		<%/foreach%>
	<%/if%>
	<a href="<%$body.logo.url%>" id="indexLogo" onclick="return false" title="<%$body.logo.indexTitle%>">
		<img src="<%$body.logo.baseSrc%>" id="indexLogoImg" alt="<%$body.logo.indexTitle%>" title="<%$body.logo.indexTitle%>"/>
	</a>

	<h1 class="userbar-logo_slogan"<%if !empty($body.logo.sloganSize)%> style="font-size:<%$body.logo.sloganSize%>"<%/if%>><%$body.logo.slogan%></h1>
	<div id="logoTips" class="userbar-logo_tip <%if !empty($body.logoTips.yellow)%>yellow<%/if%>" <%if !empty($body.logoTips.tipsWidth)%>style="width:<%$body.logoTips.tipsWidth%>px"<%/if%>>
		<div class="arrow">
			<div class="arrow_bg"></div>
		</div>
		<p><%$body.logoTips.text%> <a href="<%$body.logoTips.url%>" id="tipLink"><%$body.logoTips.closeText%><%if !empty($body.logoTips.closeText)%><span class="tipLinkArrow"></span><%/if%></a><span id="tipClose" class="tip-close"></span></p>
	</div>
</div>

<%script%>
	conf.logo = {
	    imgSrc: "<%$body.logo.src%>",
		passQueryParam: "<%$body.logo.passQueryParam%>",
		notOpenNew : "<%$body.logo.notOpenNew%>",
		autoCloseTip: "<%$body.logo.autoCloseTip%>",
		noJump: "<%$body.logo.noJump%>"
	};
	conf.logoTips = {
		show: "<%$body.logoTips.show%>",
		alwaysShow: "<%$body.logoTips.alwaysShow%>",
		version: "<%$body.logoTips.version%>",
		userOption: "<%$body.logoTips.userOption%>",
		country: conf.country,
		passQueryParam: "<%$body.logo.passQueryParam%>",
		sortDisappearTime: "<%$body.logoTips.sortDisappearTime%>",
		sortMarinTop: "<%$body.logoTips.sortMarinTop%>",
		tipsHideTime: "<%$body.logoTips.tipsHideTime%>"
	};
	conf.logoActivity = <%json_encode($body.logoActivity)%>;
	require.async(["common:widget/ui/jquery/jquery.js", "common:widget/header-flat/logo/logo-async.js"], function ($) {
		Gl.logo(conf.pageType);
		Gl.logoTips();
	});
<%/script%>
