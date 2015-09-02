<%extends file='common/page/layout/base.tpl'%>
<%block name="layout"%>
<%$body.rightModOrder%>
<%if isset($body.rightModOrder)%>
		<%assign var="rightHole" value=[
			"MusicPlayer" => "music-player",
			"rightAds" => "ad-switch",
			"speedTest" => "speed-test",
			"News" => "news",
			"MailBox" => "mail",
			"RightSort" => "useful",
			"magicBox" => "magicbox",
			"hotsiteSide" => "hotsite-side"
		]
		%>
		<%assign var="rightModOrder" value=","|explode:$body.rightModOrder%>
		<%foreach $rightModOrder as $mod%>
			<%*针对同一模块在页面中多次复用，如多个广告模块*%>
			<%$modname=preg_replace('/^(.+)_\d+$/','$1',$mod)%>
			<%*新老模块名称兼容，后续修改数据后去掉*%>
			<%if !empty($rightHole[$modname])%>
				<%$modname=$rightHole[$modname]%>
			<%else%>
				<%$modname=$modname%>
			<%/if%>
			<%*获取模板的真正路径*%>
			<%$rightModTplPath = <%uri name="home:widget/`$modname`/`$modname`.tpl"%>%>
			<%*判断模块是否存在，防止pm修改错误*%>
			<%if !empty($rightModTplPath)%>
				<div class="<%if $mod@index%>s-mtm<%else%>side-mod-preload-<%$modname%><%/if%>">
					<%*第一个模块同步加载*%>
					<%if $mod@index>0%>
						<%widget name="home:widget/`$modname`/`$modname`.tpl" mode='quickling' group='fis_rightcolumn' pagelet_id=$mod|cat:$mod@index mod_name=$modname%>
					<%/if%>
				</div>
			<%/if%>
		<%/foreach%>
	<%/if%>
<%/block%>
