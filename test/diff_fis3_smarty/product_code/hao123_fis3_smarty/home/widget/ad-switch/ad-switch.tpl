<style>
    .side-mod-preload-ad-switch{
        border:1px solid #e3e5e6;
        border-bottom:1px solid #d7d8d9;
        background: #f5f7f7;
        min-height: 66px;
    }
    .side-mod-preload-ad-switch > *{
        visibility: hidden;
    }
</style>

<%if !empty($body.<%$mod%>.time)%>

	<%*   声明对ltr/rtl的css依赖    *%>
	<%if $head.dir=='ltr'%> <%require name="home:widget/ad-switch/ltr/ltr.css"%> <%else%> <%require name="home:widget/ad-switch/rtl/rtl.css"%> <%/if%>

	<%*
		广告策略升级：
		1．  保留原有轮播功能，Banner尺寸和支持的格式不变。
		2．  同一位置的Banner模块，轮播和随机（$body.<%$mod%>.random == 1）展现只能二选一。
		3．  按照页面PV随机展现，即页面每个PV展现Banner 随机。
		4．  每个Banner展现概率一样，支持1-N幅Banner。
	*%>

	<%if !empty($body.<%$mod%>.random) && $body.<%$mod%>.random%>
	<%* 随机策略 note:shuffle直接操作原数组 *%>
		<%$VAR_ad_group=shuffle($body.<%$mod%>.ad_group)%>
		<%$VAR_ad_group=array_slice($body.<%$mod%>.ad_group,0,1)%>
	<%else%>
	<%* 轮播策略 *%>
		<%$VAR_ad_group=$body.<%$mod%>.ad_group%>
	<%/if%>

	<div class="mod-charges mod-charges_switch pr<%if !empty($body.<%$mod%>.haveCtrl)%> mod-charges_havectrl<%/if%>" log-mod="adbanner" id="<%$mod%>_pass">
	</div>

	<%script%>
		conf = conf || {};
		conf["<%$mod%>_pass"] = <%json_encode( $body.<%$mod%> )%>;
		conf["<%$mod%>_pass"].id = "<%$mod%>_pass";
		require.async(["common:widget/ui/jquery/jquery.js", "home:widget/ad-switch/ad-switch-async.js"], function($, RightAds) {
			new RightAds( "<%$mod%>_pass" );
		});
	<%/script%>
<%/if%>
