<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/valentine/ltr/ltr.css"%> <%else%> <%require name="home:widget/valentine/rtl/rtl.css"%> <%/if%>

<div class="mod-valentine" id="<%$body.valentine.id%>" monkey="valentine" log-mod="valentine">
	<a class="banner" href="<%$body.valentine.banner.url%>" title="<%$body.valentine.banner.title%>" sort="banner">
		<img src="<%$body.valentine.banner.image%>" alt="<%$body.valentine.banner.title%>"/>
	</a>
	<div class="content">
		<div class="content-inner">
			<div class="receiver">
				<input type="text" name="receiver" class="input" maxlength="<%$body.valentine.receiver.maxlength%>"/>
				<span class="placeholder"><%$body.valentine.receiver.placeholder%></span>
			</div>
			<div class="sender">
				<input type="text" name="sender" class="input" maxlength="<%$body.valentine.sender.maxlength%>"/>
				<span class="placeholder"><%$body.valentine.sender.placeholder%></span>
			</div>
			<div class="writeletter">
				<input type="button" class="btn-writeletter" value="<%$body.valentine.writeletter.text%>"/>
				<img src="<%$body.valentine.writeletter.image|default:'/static/home/widget/valentine/img/nts/static.png'%>" alt="<%$body.valentine.writeletter.text%>"/>
			</div>
			<div class="sendletter ui-o">
				<%if $body.valentine.facebookShare%>
					<input type="button" class="btn-share" value="<%$body.valentine.facebookShare.ui.btnText%>"/>
				<%else%>
					<a class="btn-sendletter" href="<%$body.valentine.sendletter.url%>"><%$body.valentine.sendletter.text%></a>
				<%/if%>
				<div class="loveimage">
					<img src="<%$body.valentine.sendletter.image|default:'/static/home/widget/valentine/img/nts/animate.gif'%>" alt="<%$body.valentine.sendletter.text%>"/>
					<span class="name name-receiver"></span>
					<span class="name name-sender"></span>
				</div>
			</div>
			<div class="mask">
				<i class="close">&times;</i>
				<%$body.valentine.sendletter.maskTpl%>
			</div>
			<span class="heart heart-receiver">♥</span>
			<span class="heart heart-sender">♥</span>
		</div>
	</div>
</div>
<%script%>
	conf.valentine = {
		id: "<%$body.valentine.id%>",
		url: "<%$body.valentine.sendletter.url%>",
		<%if !empty($body.valentine.facebookShare)%>
		fbShare: <%json_encode($body.valentine.facebookShare)%>,
		fbShareAppId: "<%$body.facebook.appId%>"
		<%/if%>
	};
	require.async('common:widget/ui/jquery/jquery.js',function($){
		$(window).one("e_go.valentine", function () {
			require.async(['home:widget/valentine/valentine-async.js'],function(valentine){
				new valentine();
			});
		});
		if(!$("#sideMagicBox #valentine").length){
			$(window).trigger("e_go.valentine");
		}
	});
<%/script%>
