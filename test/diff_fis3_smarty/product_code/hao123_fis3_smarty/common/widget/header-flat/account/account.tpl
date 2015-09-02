<%style%>
<%if $head.dir=='ltr'%> 
@import url('/widget/header-flat/account/ltr/ltr.css?__inline');
<%else%> 
@import url('/widget/header-flat/account/rtl/rtl.css?__inline');
<%/if%>
<%/style%>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> 
<%require name="common:widget/header-flat/account/ltr/ltr.more.css"%> 
<%else%> 
<%require name="common:widget/header-flat/account/rtl/rtl.more.css"%> 
<%/if%>

<div id="accountWrap" class="<%if $body.messageBoxforShop.isHidden==='0'%>account-msg-shop<%/if%> account_wrap box-message<%if !empty($body.commonLogin.manyLogin)%> account_many account_many_<%$sysInfo.country%><%/if%>" log-mod="account">
  <div class="account_inner">
    <div class="account_trig"><img id="headPic" src="<%$body.headerTest.accountDefaultImg%>"></div>
    <i class='ico-message-new hide'></i>
    <div class="account-dropdown_wrap">
        <%if $body.messageBoxforShop.isHidden==='0'%>
		<div class="arrow">
			<div class="arrow_bg"></div>
		</div>
		<%/if%>
		<%*widget name="common:widget/header-flat/message/message.tpl"*%>
        <div class="account-loginfo_wrap">
       </div>
    </div>
  </div>
</div>

<%script%>
	<%*
	/**
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
		iWidth     : <%$body.commonLogin.iWidth%>,
		iHeight    : <%$body.commonLogin.iHeight%>,     
		countryCode: conf.country,
		
		<%if !empty($sysInfo.userip)%>
		userip: "<%$sysInfo.userip%>",
		<%else%>
		userip: "sdfdslgksdlgk",
		<%/if%>

		loginCallbackName: "<%$body.commonLogin.loginCallbackName%>",

		jumpUrl       : "<%$body.commonLogin.jumpUrl%>",
		hao123LoginUrl: "<%$body.commonLogin.hao123LoginUrl%>",
		checkLoginUrl : "<%$body.commonLogin.checkLoginUrl%>",
		logoutUrl     : "<%$body.commonLogin.logoutUrl%>",
		domainName    : <%json_encode($body.commonLogin.domainName)%>,
		txtErrorMsg   : "<%$body.commonLogin.txtErrorMsg%>",
		idcMap        : <%json_encode($body.commonLogin.idcMap)%>,
		level		  : "<%$body.commonLogin.level%>",
		message       : "<%$body.commonLogin.message%>",
		infoMsg       : "<%$body.commonLogin.infoMessage%>",
		defauImg      : "<%$body.headerTest.accountDefaultImg%>",
		defauUrl      : "<%$body.headerTest.accountUrl%>",
		txtDefaultBtn : "<%$body.commonLogin.txtDefaultBtn%>",
		logoutTxt     : "<%$body.commonLogin.logoutTxt%>",
		newLoginTxt   : "<%$body.commonLogin.newLoginTxt%>",
		manyLogin     : "<%$body.commonLogin.manyLogin%>",
		manyAccount   : <%json_encode($body.commonLogin.manyAccount)%>,
		activitySign  : "<%$body.commonLogin.activitySign%>",
		activitySignUrl: "<%$body.commonLogin.activitySignUrl%>"
	};

require.async(["common:widget/ui/jquery/jquery.js", "common:widget/header-flat/account/account-async.js"], function ($) {
    if(window.loginCtroller) {
   	    loginCtroller.init();
   	    loginCtroller.isInited = true;
    }
});
<%/script%>
