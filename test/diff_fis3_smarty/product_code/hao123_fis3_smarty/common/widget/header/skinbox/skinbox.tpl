<%style%>
<%if $head.dir=='ltr'%>
@import url('/widget/header/skinbox/ltr/ltr.css?__inline');
<%else%>
@import url('/widget/header/skinbox/rtl/rtl.css?__inline');
<%/if%>
<%if !empty($body.skinBox.iconImg)%>
body .ico-skinbox {
	background: url(<%$body.skinBox.iconImg%>) no-repeat left top;
}
<%/if%>
<%/style%>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%>
<%require name="common:widget/header/skinbox/ltr/ltr.more.css"%>
<%else%>
<%require name="common:widget/header/skinbox/rtl/rtl.more.css"%>
<%/if%>

<div class="skinbox-wrap">
	<a class="skinbox-header" href="javascript:;">
		<i class="ico-skinbox"></i>
		<%if !empty($body.skinBox.iconLiteral)%>
		<span class="title-skinbox <%if $head.dir=='ltr'%>s-mlm<%else%>s-mrm<%/if%>"><%$body.skinBox.iconLiteral%></span>
		<%/if%>
		<i class="ico-skinbox-triangle"></i>
	</a>
</div>

<%script%>
conf.skin = <%json_encode($body.skinBox)%>;

require.async("common:widget/ui/jquery/jquery.js", function($){
	$(window).one("append.skin", function(){
		require.async("common:widget/header/skinbox/skinbox-async.js");
	});
	$(window).one("slide.skin", function(){
		require.async("common:widget/header/skinbox/skin-mod.js", function(Skin){
			var skin = new Skin(conf.skin);
			skin.init();
		});
	});
	$(".skinbox-header").one("click", function(e){
		$(window).trigger("slide.skin");
		e.preventDefault();
	}).one("mouseenter", function(){
		$(window).trigger("append.skin");
	});
	$(function(){
		$(window).trigger("append.skin");
	});
});
<%/script%>