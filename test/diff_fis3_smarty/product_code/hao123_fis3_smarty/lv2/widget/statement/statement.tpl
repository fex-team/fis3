<%*   声明对ltr/rtl的css依赖    *%>
<%require name="lv2:widget/statement/ltr/ltr.css"%> 
<div class="mod-statement" dir="ltr">
	<div class="top">
		<div class="top-title"><%$body.Statement.topTitle%></div>
		<div class="lv2-settings">
			<span class="lv2-settings-btn"><%$body.Statement.country%> : <span class="country"></span><i class="arrow"></i></span>
			<div class="lv2-settings-dropdown" style="display:none;">
				<ul class="lv2-settings-site">				
				</ul>
			</div>			
		</div>
		<div class="description"><%$body.Statement.description%></div>
	</div>
	<div class="content">
		<div class="content-title"><%$body.Statement.contentTitle%></div>
		<ul class="linkman">
			<%foreach $body.Statement.linkman as $value%>
				<s></s>
				<li class="linkman-item">
					<img src="<%$value.photo%>" />
					<span class="info"><label><%$body.Statement.info.name%>:&nbsp</label><span><%$value.name%></span></span>
					<span class="info"><label><%$body.Statement.info.title%>:&nbsp</label><span><%$value.title%></span></span>
					<span class="info"><label><%$body.Statement.info.email%>:&nbsp</label><span><%$value.email%></span></span>
					<span class="info"><label><%$body.Statement.info.address%>:&nbsp</label><span><%$value.address%></span></span>
				</li>
			<%/foreach%>
		</ul>	
	</div>
</div>


<%script%>
	require.async('lv2:widget/statement/statement.js');
<%/script%>