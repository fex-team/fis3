<%extends file='home/page/layout/layout-index.tpl'%>

<%* extra headInfo*%>
<%block name="headInfo"%>
	<%* webspeed-head *%>
	<%widget name="common:widget/webspeed/webspeed-head.tpl"%>
<%/block%>

<%* newer guide *%>
<%block name="newer-guide"%>
	<%if date("ymdhis", $sysInfo["baiduidCt"]) >= date("ymdhis", $sysInfo["serverTime"])%>
		<%if !empty($body.guide.showGuide)%>
			<%widget name="home:widget/guide/guide.tpl"%>
		<%elseif !empty($body.newUserGuider) && $body.newUserGuider.isHidden!=="true"%>
			<%widget name="home:widget/user-guider/user-guider.tpl" mod="newUserGuider"%>
		<%/if%>
	<%/if%>
	<%if !empty($body.newFunctionGuider) && $body.newFunctionGuider.isHidden!=="true"%>
		<%widget name="home:widget/user-guider/user-guider.tpl" mod="newFunctionGuider"%>
	<%/if%>
<%/block%>

<%block name="login-popup"%>
	<%widget name="common:widget/login-popup/login-popup.tpl"%>
<%/block%>

<%* user bar *%>
<%block name="user-bar"%>

	<%if !empty($body.headerTest.widget)%>
		<%widget name="common:widget/header/`$body.headerTest.widget`.tpl"%>
	<%else%>
		<%widget name="common:widget/header/header.tpl"%>
	<%/if%>
<%/block%>

<%* search group *%>
<%block name="search-group"%>
	<%if !empty($body.searchBox.widget)%>
		<%widget name="common:widget/`$body.searchBox.widget`/`$body.searchBox.widget`.tpl"%>
	<%else%>
		<%widget name="common:widget/search-box/search-box.tpl"%>
	<%/if%>
<%/block%>

<%* userbar btn *%>
<%block name="userbar-btn-test"%>
    <%if !empty($body.headerTest.widget) && $body.headerTest.userbarBtnIsHidden === '0'%>
		<%widget name="common:widget/header/userbar-btn-test/userbar-btn-test.tpl"%>
	<%/if%>
<%/block%>

<%* hot sites *%>
<%block name="hot-site"%>
	<%if !empty($body.personalNav) && empty($body.personalNav.hide)%>
		<%widget name="home:widget/personal-nav/personal-nav.tpl"%>
	<%/if%>
	<%if !empty($body.hotSites.widget)%>
		<%widget name="home:widget/`$body.hotSites.widget`/`$body.hotSites.widget`.tpl"%>
	<%else%>
		<%widget name="home:widget/hot-site/hot-site.tpl"%>
	<%/if%>
	<%widget name="home:widget/customsites/customsites.tpl"%>
	<script>window.PDC && PDC.first_screen && PDC.first_screen();</script>


	<%* bigpipegrender and bigpipe js *%>
	<%widget name="home:widget/bigrender-bigpipe/bigrender-bigpipe.tpl"%>
	<%* 左边工具栏 *%>
	<%if !empty($body.sidetoolbar.showNew)%>
		<%widget name="home:widget/sidebar-preload/sidebar-preload.tpl" mid="<%$body.sidetoolbar.mid%>"%>
	<%elseif !empty($body.sidetoolbar)%>
		<%widget name="home:widget/sidetoolbar/sidetoolbar.tpl"%>
	<%/if%>
	<%* 底部电商导航浮层 *%>
	<%if !empty($body.ecommercePrompt)%>
		<%widget name="home:widget/ecommerce-prompt/ecommerce-prompt.tpl"%>
	<%/if%>
	<%* 复活节彩蛋游戏 *%>
	<%if !empty($body.easterGame)%>
		<%widget name="home:widget/easter-game/easter-game.tpl"%>
	<%/if%>

<%/block%>
<%block name="trigger-flow-css"%>
	 <%if !empty($head.flowLayout)%><%* 开关on的加载新的合并文件 *%>
		<%widget name="home:widget/trigger-flow/trigger-flow.tpl"%>
	 <%/if%>
<%/block%>
<%* coolSort : edited by wmf 2012/9/28 *%>
<%block name="sort-area"%>
	<%if !empty($body.sortArea) && $body.sortArea.isHidden !== "true"%>
		<%widget name="home:widget/sort-area/sort-area.tpl"%>

	<%******为了平滑过渡现在版本和重构后的版本，重构版本稳定后剔除*********%>
	<%elseif !empty($body.embedlv2sortsite) && $body.embedlv2sortsite.isHidden !== "true"%>
		<%widget name="home:widget/embed-lv2-sortsite/embed-lv2-sortsite.tpl"%>
		<%if !empty($body.coolSortTest.bigSize) && $body.coolSortTest.bigSize == 'true'%>
			<%widget name="home:widget/sortsite-bigsize/sortsite-bigsize.tpl"%>
		<%else%>
			<%widget name="home:widget/sortsite/sortsite.tpl"%>
		<%/if%>
	<%else%>
		<%if !empty($body.coolSortTest.bigSize) && $body.coolSortTest.bigSize == 'true'%>
			<%widget name="home:widget/sortsite-bigsize/sortsite-bigsize.tpl"%>
		<%else%>
			<%widget name="home:widget/sortsite/sortsite.tpl"%>
		<%/if%>
	<%/if%>

	<%if !empty($head.webspeed.idforWebSpeed) && !empty($head.webspeed.sample)%>
		<%widget name="common:widget/webspeed/webspeed-body.tpl"%>
	<%/if%>
<%/block%>




<%block name="side-mod"%>
	<%if isset($body.rightModOrder)%>
		<%****************************************任何人不要在这里rightHole填东西，右边栏只要cms名称与widget一致，自动出来！**************%>
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
			<%if !empty($rightModTplPath) && file_exists(<%$sysInfo.templateRoot|cat:"$rightModTplPath"%>)%>
				<div x="__getHash('../static/BigPipe.js')" class="<%if $mod@index%>s-mtm<%else%>side-mod-preload-<%$modname%><%/if%>">
					<%*第一个模块同步加载*%>
					<%if $mod@index>0 && $head.pageLevel == 1%>
						<%widget name="home:widget/`$modname`/`$modname`.tpl" mode='quickling' group='fis_rightcolumn' pagelet_id=$mod|cat:$mod@index fetch_widget="home:widget/rightcolumn/rightcolumn.tpl"%>
					<%else%>
						<%widget name="home:widget/`$modname`/`$modname`.tpl" mod_name=$modname%>
					<%/if%>
				</div>
			<%/if%>
		<%/foreach%>
	<%/if%>
	<%* 页底跳转 *%>
	<%if !empty($body.anchorside) && empty($body.anchorside.hide)%>
		<%widget name="home:widget/anchorside/anchorside.tpl" mode='quickling' group='fis_rightcolumn'%>
	<%/if%>
<%/block%>

<%* bottomSort : edited by wmf 2013/3/28 *%>
<%block name="bottom-bar"%>
		<%if !empty($body.bottomEcommerce) && $body.bottomEcommerce.isHidden !== "true"%>
			<div id="bottomEcommerce" class="mod-bottom-ecommerce l-g box-border" log-mod="bottom-ecommerce" style="height:392px;">
				<%widget name="home:widget/bottom-ecommerce/bottom-ecommerce.tpl"  mode="quickling" pagelet_id="fis_bottomEco" group="bottom"%>
			</div>
		<%/if%>
		<%if !empty($body.bottomSort.widget)%>
		<div class="l-g box-border toolbar-v" monkey="bottom" log-mod="bottom" style="min-height:319px;margin-top: 10px;">
				<%widget name="home:widget/`$body.bottomSort.widget`/`$body.bottomSort.widget`.tpl" mode="quickling" pagelet_id="fis_bottom" group="bottom"%>
		</div>
		<%else%>
			<%widget name="home:widget/bottombar/bottombar.tpl"  mode="quickling" pagelet_id="fis_bottombar" group="bottom"%>
		<%/if%>
		<%if $body.bottomBook.isHidden === "0"%>
		    <%widget name="home:widget/bottom-book/bottom-book.tpl"%>
		<%/if%>

<%/block%>

<%* footprint : edited by wmf 2012/9/28 *%>
<%block name="footer"%>
	<%if !empty($body.footerSEO) && $body.footerSEO.isHidden != "1"%>
		<%widget name="common:widget/footer-seo/footer-seo.tpl"%>
	<%else%>
		<%widget name="common:widget/footer/footer.tpl" linkList=$body.footprint.links copyright=$html.copyright mode="quickling" pagelet_id="fis_footer" group="bottom"%>
	<%/if%>
	<%widget name="home:widget/foot-script/foot-script.tpl"%>
<%/block%>

<%*首页的facebook模块移动到右边栏，是为了减少请求和减少首页的处理*%>

<%* popupsite *%>
<%block name="popupsite"%>
    <%if $body.popupSite.isHidden === "0"%>
        <%widget name="home:widget/popupsite/popupsite.tpl"%>
    <%/if%>

	<%if !empty($body.sidetoolbar) && empty($body.sidetoolbar.showNew) && empty($smarty.get.fispagemode)%>
		<%foreach $body.sidetoolbar.list as $list%>
			<%widget name="home:widget/<%$list.widget[0].widgetId%>/<%$list.widget[0].widgetId%>.tpl" mode="quickling" pagelet_id="<%$list.widget[0].pageletId|default:$list.widget[0].widgetId %>" class="<%$list.id%>" textarea_style="display:none" is_rend=false group="sidetoolbar" mid="<%$list.widget[0].moduleId|cat:time()|default:''%>" mod_id="<%$list.widget[0].modId%>" widget_id="<%$list.widget[0].pageletId%>" list_id="<%$list.id%>"%>
		<%/foreach%>
	<%/if%>

	<%block name="anniversary"%>
		<%if !empty($smarty.get.mission) && !empty($body.anniversary.<%$smarty.get.mission%>) && empty($body.anniversary.isHidden)%>
			<%widget name="home:widget/anniversary/anniversary.tpl"%>
		<%/if%>
	<%/block%>
	<%block name="send-bless"%>
		<%if !empty($body.sendBless) && empty($body.sendBless.isHidden)%>
			<%widget name="home:widget/send-bless/send-bless.tpl"%>
		<%/if%>
	<%/block%>
	<%widget name="home:widget/history-add/history-add.tpl"%>
	<%if !empty($body.snow) && $body.snow.isHidden !== "true"%>
		<%widget name="home:widget/snow/snow.tpl"%>
	<%/if%>

	<%if !empty($body.eventWater) && $body.eventWater.isHidden !== "1"%>
		<%widget name="home:widget/water/water.tpl"%>
	<%/if%>
<%/block%>

<%*机器屌丝，故把faceook与右边栏打包下载*%>
<%block name="facebook"%>
	<%widget name="home:widget/facebook/facebook.tpl" mode="quickling" pagelet_id="fis_facebook" group="fis_rightcolumn"%>
<%/block%>

<%* 皮肤的装载容器和可点击区域 *%>
<%block name="skin-background"%>
	<div id='skin-bgimage'></div>
	<div class="skin-clickarea" id="skin-clickarea-left"></div>
	<div class="skin-clickarea" id="skin-clickarea-right"></div>
<%/block%>

<%* 与合作方的广告位 *%>
<%block name="banner-frame"%>
	<%if !empty($body.bannerFrame.show)%>
		<%widget name="common:widget/banner-frame/banner-frame.tpl"%>
	<%/if%>
<%/block%>
