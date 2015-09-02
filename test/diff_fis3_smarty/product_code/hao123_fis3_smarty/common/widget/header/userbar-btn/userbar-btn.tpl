<%style%>
<%if $head.dir=='ltr'%> 
@import url('/widget/header/userbar-btn/ltr/ltr.css?__inline');
<%else%> 
@import url('/widget/header/userbar-btn/rtl/rtl.css?__inline');
<%/if%>
<%/style%>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="common:widget/header/userbar-btn/ltr/ltr.more.css"%> <%else%> <%require name="common:widget/header/userbar-btn/rtl/rtl.more.css"%> <%/if%>

	<%if strpos($smarty.server["HTTP_USER_AGENT"], "MSIE")%>
		<%assign var="browser" value=$body.userbarBtn.ie%>
	<%elseif strpos($smarty.server["HTTP_USER_AGENT"], "Firefox")%>
		<%assign var="browser" value=$body.userbarBtn.firefox%>
	<%else%>
		<%assign var="browser" value=$body.userbarBtn.chrome%>
	<%/if%>
	<div class="userbar-btn" log-mod="sethp-btn" id="userbarBtnOld">
		<%foreach array_reverse($browser) as $value%>
			<%if $value eq "addfav"%>
			<a href="<%$body.addFav.url%>" id="addFav" onclick="return false;" class="userbar-btn-item">	
				<i class="userbar-addfav"></i>				
				<span><%$body.addFav.title%></span>
			</a>
			<%elseif $value eq "download"%>
			<a href="<%$body.download.url%>" id="shortCut" class="userbar-btn-item">
				<i class="userbar-down"></i>
				<span><%$body.download.title%></span>
			</a>
			<%else%>
			<a href="<%$body.setHome.url%>" id="setHome" onclick="return false;" class="userbar-btn-item">
				<i class="userbar-sethome"></i>
				<span><%$body.setHome.title%></span>
			</a>
			<%/if%>
		<%/foreach%>
	</div>
	<%script%>
		conf.userbarBtn = {
			<%if !empty($body.userbarBtn.maxSpanWidth)%>maxSpanWidth: '<%$body.userbarBtn.maxSpanWidth%>',<%/if%>
			addFavText: '<%$body.addFav.error%>'		
		};
		conf.setHomeOnFf ||(conf.setHomeOnFf = <%json_encode($body.setHomeOnFf)%>);

		require.async("common:widget/ui/jquery/jquery.js", function($) {
			$(window).one("e_go.userbarbtn", function () {
				require.async("common:widget/header/userbar-btn/userbar-btn-async.js", function () {
					Gl.userbarBtn();
				});
			});

			$(function () {
				$(window).trigger("e_go.userbarbtn");
			});

			$(".userbar-btn").one("mouseenter", function () {
				$(window).trigger("e_go.userbarbtn");
			});
		});
	<%/script%>
