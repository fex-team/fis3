<%strip%>
<%if !empty($body.breadsCrumb)%>
    <%require name="lv2:widget/channel-breads/`$head.dir`/`$head.dir`.css"%>

    <div class="mod-channel-breads" log-mod="channel-breads">
		<h2><%$body.breadsCrumb.pageName%></h2>
		<p>
			<a href="http://<%$sysInfo.country%>.hao123.com/" target="_self"><%$body.breadsCrumb.homeName|default:"HOME"%></a>
			&nbsp;&gt;&nbsp;<%$body.breadsCrumb.pageName%>
		</p>
    </div>
<%/if%>
<%/strip%>