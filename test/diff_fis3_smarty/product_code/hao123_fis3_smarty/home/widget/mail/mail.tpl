<%* email login area : edited by wmf 2012/9/28 *%>
<style>
    .side-mod-preload-mail{
        border:1px solid #e3e5e6;
        border-bottom:1px solid #d7d8d9;
        background: #f5f7f7;
    }
    .side-mod-preload-mail > *{
        visibility: hidden;
    }
</style>
<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/mail/ltr/ltr.css"%> <%else%> <%require name="home:widget/mail/rtl/rtl.css"%> <%/if%>


	<div class="mod-mail box-border favsite-count" monkey="sidemail" log-mod="mail">
		<dl class="mod-side cf">
			<dt><%$body.MailBox.Title%><div class="bot_line"></div></dt>
			<%foreach $body.MailBox.list as $value%>
				<dd><a class="mail-item mail-<%$value.MailBoxIcon|default:$value@iteration%>" href="<%$value.MailBoxUrl%>"><%$value.MailBoxTitle%></a></dd>
			<%/foreach%>
		</dl>
	</div>
