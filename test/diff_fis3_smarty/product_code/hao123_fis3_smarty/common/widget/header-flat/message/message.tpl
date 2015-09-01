<%if $head.dir=='ltr'%> 
<%require name="common:widget/header-flat/message/ltr/ltr.more.css"%> 
<%else%> 
<%require name="common:widget/header-flat/message/rtl/rtl.more.css"%> 
<%/if%>

<div class="account-message_wrap wrap-message-content" log-mod="msgbox">
	<ul></ul>
</div>

<%script%>
conf.messageBox = <%json_encode($body.messageBox)%>;
<%if $body.messageBoxforShop.isHidden==='0'%>
conf.msgBoxShop = <%json_encode($body.messageBoxforShop)%>;
<%/if%>
require.async(["common:widget/header-flat/message/message-async.js"], function(Message){
	var message = new Message(conf.messageBox);
	message.init();
});
<%/script%>