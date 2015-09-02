<%if $head.dir=='ltr'%> 
	<%require name="common:widget/login-popup/ltr/ltr.css"%> 
<%else%> 
	<%require name="common:widget/login-popup/rtl/rtl.css"%> 
<%/if%>

<%script%>
require.async(["common:widget/ui/jquery/jquery.js", "common:widget/ui/popup/popup.js"], function($, Popup){
	<%if !empty($body.loginPopup.selector)%>
		$(document).on("click", "<%$body.loginPopup.selector%>", function(){
			if(window.loginCtroller.verify != 1){
				var options = {
					title: "<%$body.loginPopup.title%>",
					content: '<div class="login-popup-content"><div class="popup-login-btn" id="popupFBBtn"><i class="i-popup-fb"></i><span class="popup-login-text"><%$body.loginPopup.FBButton%></span></div><p class="popup-login-desc"><%$body.loginPopup.description%></p></div>',
					key: "loginPop",
					dir: "<%$head.dir%>"
				};
				Gl.loginPopup = new Popup(options);
				Gl.loginPopup.init();
			}
		}).on("click", "#popupFBBtn", function(){
			if(window.loginCtroller.verify != 1){
				window.loginCtroller && window.loginCtroller.fire();
			}
		});
	<%/if%>
});
<%/script%>