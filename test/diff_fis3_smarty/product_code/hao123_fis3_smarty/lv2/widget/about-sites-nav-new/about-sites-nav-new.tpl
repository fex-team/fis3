<%*   声明对ltr/rtl的css依赖    *%>
<%require name="lv2:widget/about-sites-nav-new/`$head.dir`/`$head.dir`.css"%>

<div class="nav-lv2 <%if $head.dir=='ltr'%>s-mrm<%else%>s-mlm<%/if%>" id="navList">
	<ul class="nav-lv2_list">
		<%foreach $body.tabNav.links as $value%>
			<li<%if !empty($value.style)%> style="<%$value.style%>"<%/if%>>
				<a href="<%$value.url%>" <%if $value.toNewPage != "1"%>onclick="return false"<%/if%>><span><%$value.name%></span><%if !empty($value.ico)%><i class="<%$value.ico%>"<%if !empty($value.ico_url)%> style="background:url(<%$value.ico_url%>) no-repeat left top"<%/if%>></i><%/if%></a>
			</li>
		<%/foreach%>
		<li><div class="nav-lv2-bs">&nbsp;</div></li>
	</ul>
</div>
<%script%>
	require.async('lv2:widget/about-sites-nav-new/about-sites-nav-new.js',function(aboutInit){
		aboutInit();
	})
<%/script%>
