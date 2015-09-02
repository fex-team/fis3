
	<%*   声明对ltr/rtl的css依赖    *%>
	<%if $head.dir=='ltr'%> <%require name="lv2:widget/plugin-intro/ltr/ltr.css"%> <%else%> <%require name="lv2:widget/plugin-intro/rtl/rtl.css"%> <%/if%>

	<div class="plugin-intro_top" style="background:#ba9d73 url(<%$body.pluginIntroPage.intro_bg%>) center 0 no-repeat;">
		<div class="plugin-intro_topBg" style="background:url(<%$body.pluginIntroPage.intro_bg%>) center 0 no-repeat; ">
			<a href="<%$body.pluginIntroPage.plugin_url%>" id="plugin-intro_btn">
				<img src="<%$body.pluginIntroPage.intro_btn%>" width="301" height="58" />
			</a>
		</div>
	</div>
	<div class="plugin-intro_body">
		<img src="<%$body.pluginIntroPage.intro_body%>" width="642" height="1049" />
	</div>
	<%if empty($body.pluginIntroPage.js_unable) %>
		<%script%>
			conf.pluginIntro={
				introBtnImgAdded : "<%$body.pluginIntroPage.intro_btn_added%>",
				pluginUrl : "<%$body.pluginIntroPage.plugin_url%>"
			};

			require.async('lv2:widget/plugin-intro/plugin-intro.js',function(initInstall){
				initInstall();
			});
		<%/script%>
	<%/if%>
	

