<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> 
    <%require name="home:widget/daily-sign/ltr/ltr.css"%> 
<%else%> 
    <%require name="home:widget/daily-sign/rtl/rtl.css"%> 
<%/if%>
<%style%>
.mod-daily-sign {visibility: hidden;}
<%/style%>
<div class="mod-daily-sign" id="<%$body.dailySign.id%>" log-mod="daily-sign">
    <div class="ds-title">
        <div class="ds-out-title"></div>
        <a href="<%$body.dailySign.jumpUrl%>" class="ds-in-title"></a>
    </div>
    <div class="ds-bubble" style="display: none;">
        <b class="ui-arrow ui-arrow-t"></b>
        <div class="ds-out-bubble"></div>
        <div class="ds-in-bubble"></div>
    </div>
</div>

<%script%>
    conf.dailySign = <%json_encode($body.dailySign)%>;
	require.async(['home:widget/daily-sign/daily-sign-async.js', 'common:widget/header/account-test/account-test-async.js'], function(contro) {
        if(window.loginCtroller) {
            loginCtroller.checkStatus({
                success: function(data) {
                    contro.loggedInit();
                }
            });
        }
    });
<%/script%>

