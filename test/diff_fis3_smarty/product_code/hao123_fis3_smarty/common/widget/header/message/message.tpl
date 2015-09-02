<%if $head.dir=='ltr'%> 
<%require name="common:widget/header/message/ltr/ltr.more.css"%> 
<%else%> 
<%require name="common:widget/header/message/rtl/rtl.more.css"%> 
<%/if%>

<div class="account-message_wrap wrap-message-content" log-mod="msgbox">
	<ul></ul>
</div>

<%script%>
window.conf || (window.conf = {});
conf.messageBox = <%json_encode($body.messageBox)%>;
require.async(["common:widget/ui/jquery/jquery.js", "common:widget/header/message/message-async.js"], function($, Message){
	$(function(){
	   	var message = new Message(conf.messageBox);
	   	message.init();
	});
});
<%/script%>