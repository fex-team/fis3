<%style%>
<%if $head.dir=='ltr'%>
  @import url('/widget/header-flat/userbar-btn-header/ltr/ltr.css?__inline');
<%else%>
  @import url('/widget/header-flat/userbar-btn-header/rtl/rtl.css?__inline');
<%/if%>
<%/style%>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%>
  <%require name="common:widget/header-flat/userbar-btn-header/ltr/ltr.more.css"%>
<%else%>
  <%require name="common:widget/header-flat/userbar-btn-header/rtl/rtl.more.css"%>
<%/if%>

	<%if strpos($smarty.server["HTTP_USER_AGENT"], "MSIE")%>
		<%assign var="browser" value=$body.userbarBtn.ie%>
		<%if $body.headerTest.userbarBtnIsHidden == "1"%>
			<%assign var="browserData" value=$body.headerTest.userbarBtn.ie%>
		<%/if%>
	<%elseif strpos($smarty.server["HTTP_USER_AGENT"], "Firefox")%>
		<%assign var="browser" value=$body.userbarBtn.firefox%>
		<%if $body.headerTest.userbarBtnIsHidden == "1"%>
			<%assign var="browserData" value=$body.headerTest.userbarBtn.firefox%>
		<%/if%>
	<%else%>
		<%assign var="browser" value=$body.userbarBtn.chrome%>
		<%if $body.headerTest.userbarBtnIsHidden == "1"%>
			<%assign var="browserData" value=$body.headerTest.userbarBtn.chrome%>
		<%/if%>
	<%/if%>
	<div class="userbar-btn" log-mod="sethp-btn" id="userbarBtnHd">
	</div>
	<%script%>
		conf.userbarBtnHd = {
			browser: <%json_encode($browser)%>,
			browserData: '<%$browserData|default:""%>',
			addfav: {
			    'content': '<%$body.addFav.content%>',
			    'title': '<%$body.addFav.title%>',
			    'url': '<%$body.addFav.url%>',
			    'error': '<%$body.addFav.error%>'
			},
			download: {
			    'content': '<%$body.download.content%>',
			    'title': '<%$body.download.title%>',
			    'url': '<%$body.download.url%>'
			},
			sethome: {
			    'content': '<%$body.setHome.content%>',
			    'title': '<%$body.setHome.title%>',
			    'url': '<%$body.setHome.url%>'
			}
		};
		require.async(["common:widget/header-flat/userbar-btn-header/userbar-btn-header-async.js"],function(init){
			init();
		});
	<%/script%>
