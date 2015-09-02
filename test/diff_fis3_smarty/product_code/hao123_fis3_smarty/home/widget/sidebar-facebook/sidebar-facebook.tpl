<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/sidebar-facebook/ltr/ltr.css"%> <%else%> <%require name="home:widget/sidebar-facebook/rtl/rtl.css"%> <%/if%>

<div id="fbMod" class="fb-mod fb-mod--fold fb-mod--login fb-mod--loading" alog-alias="fb" log-mod="fb-box">
	<div class="fb-mod_c">
		<div class="fb-mod_head">
			<div class="fb-mod_ct">
				<div class="fb-mod_avatar"></div>
				<div>
					<div class="fb-mod_usrinfo"></div>
					<a class="fb-mod_logout" href="###" onclick="return !1"><%$body.facebook.tplLogout%></a>
				</div>
				<div class="fb-mod_tab_links">
					<a href="http://www.facebook.com/reqs.php#friend" class="fb-mod_tab_friend" data-sort="icon_friend"><em></em></a>
					<a href="http://www.facebook.com/messages/" class="fb-mod_tab_msg" data-sort="icon_messages"><em></em></a>
					<a href="http://www.facebook.com/notifications" class="fb-mod_tab_notify" data-sort="icon_notifications"><em></em></a>
				</div>
			</div>
			<div class="fb-mod_submit_wrap">
				<textarea class="fb-mod_submit" placeholder="<%$body.facebook.tplSuggestText%>"></textarea>
				<div class="fb-mod_submit_bar">
					<button class="fb-mod_btn fb-mod_btn-confirm fb-mod_submit_btn"><%$body.facebook.tplPost%></button>
					<div class="fb-mod_loader"></div>
				</div>
			</div>
		</div>
		<a class="fb-mod_refresh" href="###" onclick="return !1" data-sort="refresh"></a>
		<div class="fb-mod_body">
			<div class="fb-mod_tip"><span></span></div>
			<div class="fb-mod_body_loader">
				<div class="fb-mod_loader"></div>
			</div>
			<ul class="fb-mod_list"></ul>
		</div>
		<div class="fb-mod_login">
			<a class="fb-mod_btn fb-mod_btn-confirm fb-mod_login_btn" href="###" onclick="return !1"><%$body.facebook.tplLoginTo%></a>
			<p class="fb-mod_login_label"><%$body.facebook.tplLoginHere%></p>
		</div>
		<div class="fb-mod_c_loading">
			<div class="fb-mod_loader"></div>
		</div>
	</div>
</div>
<%script%>
conf.FBClient = {
	// Your application ID
	appId: '<%$body.facebook.appId%>'
	, modPath: '<%$body.facebook.modPath%>'
	// javascript sdk path & set lang
	, sdkPath: '<%$body.facebook.sdkPath%>'
	// true to fetch fresh status
	, status: <%$body.facebook.status%>
	// true to enable cookie support
	, cookie: "<%$sysInfo.country%>.hao123.com"
	// true to parse XFBML tags
	, xfbml: <%$body.facebook.xfbml%>
	// Manually set the object retrievable from getAuthResponse
	, oauth: <%$body.facebook.oauth%>
	// false to disable logging
	, logging: <%$body.facebook.logging%>
	, permissions: "<%$body.facebook.permissions%>"
	// auto refresh interval (s)
	, refreshInterval: <%$body.facebook.refreshInterval%>
	// tip stay time, except the new posts number tip when autofresh
	, tipStayTime: <%$body.facebook.tipStayTime%>
	// max post box height, can not be infinite match content
	, postBoxMaxHeight: <%$body.facebook.postBoxMaxHeight%>
	// load number
	, initLoadNum: <%$body.facebook.initLoadNum%>
	, scrollLoadNum: <%$body.facebook.scrollLoadNum%>
	, refreshLoadNum: <%$body.facebook.refreshLoadNum%>
	/*move ui-DOM conf & tpl-DOM conf to fbclient.js */
	, tplSuggestText: "<%$body.facebook.tplSuggestText%>"
	, tplNoOldPost: '<%$body.facebook.tplNoOldPost%>'
	, tplNoNewPost: '<%$body.facebook.tplNoNewPost%>'
	, tplNewPosts: '<%$body.facebook.tplNewPosts%>'
	, tplNetworkError: '<%$body.facebook.tplNetworkError%>'
	, tplSubmitFailed: '<%$body.facebook.tplSubmitFailed%>'
	, tplSubmitSucceed: '<%$body.facebook.tplSubmitSucceed%>'
	, tplSubmitNonBlank: '<%$body.facebook.tplSubmitNonBlank%>'
	, tplSubmitLimit: '<%$body.facebook.tplSubmitLimit%>'
	, tplPublishedSucceed: '<%$body.facebook.tplPublishedSucceed%>'
	, tplPublishedFailed: '<%$body.facebook.tplPublishedFailed%>'
	, tplLikeFailed: '<%$body.facebook.tplLikeFailed%>'
	, tplUnLikeFailed: '<%$body.facebook.tplUnLikeFailed%>'
	, tplDeleteSucceed: '<%$body.facebook.tplDeleteSucceed%>'
	, tplDeleteFailed: '<%$body.facebook.tplDeleteFailed%>'
	, tplNewLabel: "<%$body.facebook.tplNewLabel%>"
	, tplLogout: "<%$body.facebook.tplLogout%>"
	, tplLike: "<%$body.facebook.tplLike%>"
	, tplUnLike: "<%$body.facebook.tplUnLike%>"
	, tplComment: "<%$body.facebook.tplComment%>"
	, tplShare: "<%$body.facebook.tplShare%>"
	, tplPost: "<%$body.facebook.tplPost%>"
	, tplLoginHere: "<%$body.facebook.tplLoginHere%>"
	, tplLoginTo: "<%$body.facebook.tplLoginTo%>"
	, tplTimeLine_1: '<%$body.facebook.tplTimeLine_1%>'
	, tplTimeLine_2: '<%$body.facebook.tplTimeLine_2%>'
	, tplTimeLine_3: '<%$body.facebook.tplTimeLine_3%>'
	, tplTimeLine_4: '<%$body.facebook.tplTimeLine_4%>'
	, tplTimeLine_5: '<%$body.facebook.tplTimeLine_5%>'
	, tplTimeLine_6: '<%$body.facebook.tplTimeLine_6%>'
	, tplTimeLine_7: '<%$body.facebook.tplTimeLine_7%>'
	, tplConfirm: '<%$body.facebook.tplConfirm%>'
	, tplLater: '<%$body.facebook.tplLater%>'
	, tplNoNewMsg: '<%$body.facebook.tplNoNewMsg%>'
	, tplLiked: '<%$body.facebook.tplLiked%>'
	, tplBubble: '<%$body.facebook.tplBubble%>'
};

require.async('home:widget/ui/sidebar-facebook/facebook.js', function(FBClient) {
	FBClient.init();
});

<%/script%>