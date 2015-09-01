<style>
    .side-mod-preload-useful{
        border:1px solid #e3e5e6;
        border-bottom:1px solid #d7d8d9;
        background: #f5f7f7;
    }
    .side-mod-preload-useful > *{
        visibility: hidden;
    }
</style>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/useful/ltr/ltr.css"%> <%else%> <%require name="home:widget/useful/rtl/rtl.css"%> <%/if%>


<%* RightSort : edited by wmf 2012/9/28 *%>
	<div class="mod-useful box-border favsite-count" monkey="sidebar" log-mod="sortsites-side">
		<dl class="mod-side cf">
			<dt><%$body.<%$mod%>.RightSortTopTitle%><div class="bot_line"></div></dt>
			<%foreach $body.<%$mod%>.links as $value%>
				<dd<%if !empty($value.class)%> class="<%$value.class%>"<%/if%>><a href="<%$value.url%>"<%if !empty($value.style)%> style="<%$value.style%>"<%/if%> <%if !empty($value.offerid)%> log-oid="<%$value.offerid%>"<%/if%>  ><%$value.name%><%if !empty($value.ico)%><i class="<%$value.ico%>"<%if !empty($value.ico_url)%> style="background:url(<%$value.ico_url%>) no-repeat left top"<%/if%>></i><%/if%></a></dd>
			<%/foreach%>
		</dl>
	</div>
