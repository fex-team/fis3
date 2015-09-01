<%style%>
<%if $head.dir=='ltr'%> 
@import url('/widget/header/userbar-btn-header/ltr-s/ltr.css?__inline');
<%else%> 
@import url('/widget/header/userbar-btn-header/rtl-s/rtl.css?__inline');
<%/if%>
<%/style%>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%>
<%require name="common:widget/header/userbar-btn-header/ltr-s/ltr.more.css"%> 
<%else%> 
<%require name="common:widget/header/userbar-btn-header/rtl-s/rtl.more.css"%> 
<%/if%>

	<%if strpos($smarty.server["HTTP_USER_AGENT"], "MSIE")%>
		<%assign var="browser" value=$body.userbarBtn.ie%>
		<%assign var="browserData" value=$body.headerTest.userbarBtn.ie%>
	<%elseif strpos($smarty.server["HTTP_USER_AGENT"], "Firefox")%>
		<%assign var="browser" value=$body.userbarBtn.firefox%>
		<%assign var="browserData" value=$body.headerTest.userbarBtn.firefox%>
	<%else%>
		<%assign var="browser" value=$body.userbarBtn.chrome%>
		<%assign var="browserData" value=$body.headerTest.userbarBtn.chrome%>
	<%/if%>
	<div class="userbar-btn-hd" log-mod="sethp-btn" id="userbarBtnHd">
	</div>
	<%script%>
		conf.userbarBtnHd = {
			browser: <%json_encode($browser)%>,
			browserData: '<%$browserData%>',
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
			},
			isSetHomeFf: <%if $body.headerTest.userbarBtn.firefox === "sethome"%>'0'<%else%>'1'<%/if%>
		};
		conf.setHomeOnFf ||(conf.setHomeOnFf = <%json_encode($body.setHomeOnFf)%>);
		require.async(["common:widget/header/userbar-btn-header/userbar-btn-header-async.js"],function(userbarBtn){
			userbarBtn();
		});
	<%/script%>
