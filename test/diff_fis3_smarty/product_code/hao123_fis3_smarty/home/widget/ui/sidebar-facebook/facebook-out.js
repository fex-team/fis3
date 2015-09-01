var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var sidebarMessageBubble = require('home:widget/custom-sidebar/custom-sidebar-messagebubble.js');

//打开页面时做的一个消息提示的功能
$(function(){

	var conf = window.conf.FBClient;
	var unread = 0;
	var apiTimes = 0;
	var sideFbIcon = $(".sidebarFacebookIcon");

	//facebook api needed
	$(document.body).append('<div id="fb-root" class=" fb_reset"></div>');

	//request facebook sdk
	$.ajax({
	    url: conf.sdkPath,
	    dataType: "script",
	    cache: true,
	    success: sdkSuccessCallback
	});

	function sdkSuccessCallback(){
        if(!window.FB) return;
        window.conf.FBClient.initial = true;
        FB.init({
              appId: conf.appId
            , status: conf.status
            , cookie: conf.cookie
            , expires : 100
            , xfbml: 1
            , oauth: conf.oauth
        });
	    FB.getLoginStatus(function(response) {
			loginSuccessCallback(response);
	    });
	}

	function loginSuccessCallback(response){
        if(response && response.authResponse && response.authResponse.userID){
			dealMessage("friendrequests");
			dealMessage("notifications");
			dealMessage("inbox");
    	}
	}

	function dealMessage(fieldName){
	    FB.api("/me?fields="+fieldName, function(response) {
	    	var summary;
	    	apiTimes++;
	    	if(response[fieldName] && (summary = response[fieldName].summary)){
				if(fieldName == "friendrequests"){
					unread += summary.unread_count ? summary.unread_count : 0;
				}else{
					unread += summary.unseen_count ? summary.unseen_count : 0;
				}
	    	}
		    if(apiTimes == 3 && unread > 0){
				showPop(unread);
			}
	    });
	}

	function showPop(num){
		if( window.conf.customSidebar ){
			var message = new sidebarMessageBubble();
			message.setMessage($(".si-sidebarFacebook"),num,"sidebarFacebook");
		} else {
			sideFbIcon.find(".applist-i").text(num).show();
		}
		
	}
});