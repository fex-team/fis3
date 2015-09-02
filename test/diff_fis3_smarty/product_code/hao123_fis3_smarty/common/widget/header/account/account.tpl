<%style%>
<%if $head.dir=='ltr'%> 
@import url('/widget/header/account/ltr/ltr.css?__inline');
<%else%> 
@import url('/widget/header/account/rtl/rtl.css?__inline');
<%/if%>
<%/style%>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="common:widget/header/account/ltr/ltr.more.css"%> <%else%> <%require name="common:widget/header/account/rtl/rtl.more.css"%> <%/if%>
<div id="fBook" class="mod-login"<%if !empty($body.commonLogin.isHidden)%> style="visibility:hidden"<%/if%> log-mod="account">
	<div class='mod-login_avatar'>
		<img class="mod-login_img" src="/widget/img/bg.png"/>
	</div>
	<div class='mod-login_body'>
		<p class='mod-login_name'><%$body.commonLogin.txtDefaultBtn%></p>
		<p class="mod-login_email" dir="ltr"></p>
		<div class="mod-login_logout">
			<a href="#" target='_self'><%$body.commonLogin.logoutTxt%></a>
		</div>
	</div>	
</div>
<%script%>
window.conf || (window.conf = {});
	<%*
	/**
	 * common login configuration
	 * @type {Object}
	 * @author	Thomas_曹奋泽
	 * @update	2013-05-23 0:31
	 * Facebook页面登录退出的配置信息(可供PM使用)
	 * conf.commonLogin:入口。
	 * 信息：(1)iWidth，iHeight:弹出窗口宽高。
	 * 		 (2)userip: 登录时的参数信息(可配)。
	 * 		 (3)jumpUrl:登录时的参数信息(可配)。
	 * 		 (4)loginUrl:登录时的参数信息(可配)。
	 * 		 (5)checkLoginUrl：Ajax请求地址。
	 * 		 (6)logoutUrl:退出时请求的URL地址，刷新页面。
	 * 		 (7)domainName:各国机房服务器地址(优先选择的地址)。
	 * 		 (8)txtDefaultBtn:默认按钮文字信息(可配)。
	 * 		 (9)txtErrorMsg:错误状态提示信息(可配)。
	 * 		 (10)level:权限级别(可配)。
	 */
	*%>   

	conf.commonLogin = {
		iWidth:<%$body.commonLogin.iWidth%>,
		iHeight:<%$body.commonLogin.iHeight%>,     
		countryCode:conf.country,
		
		<%if !empty($sysInfo.userip)%>
		userip: "<%$sysInfo.userip%>",
		<%else%>
		userip: "sdfdslgksdlgk",
		<%/if%>

		loginCallbackName: "<%$body.commonLogin.loginCallbackName%>",

		jumpUrl: "<%$body.commonLogin.jumpUrl%>",
		hao123LoginUrl: "<%$body.commonLogin.hao123LoginUrl%>",
		checkLoginUrl:"<%$body.commonLogin.checkLoginUrl%>",
		logoutUrl:"<%$body.commonLogin.logoutUrl%>",
		domainName: <%json_encode($body.commonLogin.domainName)%>,
		txtDefaultBtn: "<%$body.commonLogin.txtDefaultBtn%>",
		txtErrorMsg: "<%$body.commonLogin.txtErrorMsg%>",
		idcMap: <%json_encode($body.commonLogin.idcMap)%>,
		level: "<%$body.commonLogin.level%>",
		message:"<%$body.commonLogin.message%>",
		infoMsg:"<%$body.commonLogin.infoMessage%>"
	};

	require.async("common:widget/ui/jquery/jquery.js", function($) {
		$(window).one("e_go.account", function () {
			require.async("common:widget/header/account/account-async.js", function () {
				// init
				$(function() {
				   	$("#fBook")[0] && $("#fBook").css("visibility") !== 'hidden' && window.loginCtroller && loginCtroller.init();
				});
			});
		});

		$(function () {
			$(window).trigger("e_go.account");
		});

		$("#fBook").one("mouseenter", function () {
			$(window).trigger("e_go.account");
		});
	});
<%/script%>
