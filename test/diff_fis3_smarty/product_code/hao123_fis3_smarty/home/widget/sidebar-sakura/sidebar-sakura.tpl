<%if $head.dir=="ltr"%>
	<%require name="home:widget/sidebar-sakura/ltr/ltr.css"%>
<%else%>
	<%require name="home:widget/sidebar-sakura/rtl/rtl.css"%>
<%/if%>
<div class="mod-sidebar-sakura" id="sidebarSakura" log-mod="sidebar-sakura">
	<div class="sakura-container">
		<form name="sakuraSearch" action="http://www.mapple.net/sp_sakura/list.asp?lPageBack=1">
			<div class="sakura-place block">
				<h3><i></i><span>エリア：</span></h3>
				<select name="place">
					<option value="">地方を選んでください</option>
			        <option value="B01" >北海道</option>
			        <option value="A02" >東北</option>
			        <option value="B02" >&nbsp;&nbsp;青森</option>
			        <option value="B03" >&nbsp;&nbsp;岩手</option>
			        <option value="B04" >&nbsp;&nbsp;宮城</option>
			        <option value="B05" >&nbsp;&nbsp;秋田</option>
			        <option value="B06" >&nbsp;&nbsp;山形</option>
			        <option value="B07" >&nbsp;&nbsp;福島</option>
			        <option value="A03" >関東</option>
			        <option value="B08" >&nbsp;&nbsp;茨城</option>
			        <option value="B09" >&nbsp;&nbsp;栃木</option>
			        <option value="B10" >&nbsp;&nbsp;群馬</option>
			        <option value="B11" >&nbsp;&nbsp;埼玉</option>
			        <option value="B12" >&nbsp;&nbsp;千葉</option>
			        <option value="B13" >&nbsp;&nbsp;東京</option>
			        <option value="B14" >&nbsp;&nbsp;神奈川</option>
			        <option value="A04" >甲信越</option>
			        <option value="B15" >&nbsp;&nbsp;新潟</option>
			        <option value="B19" >&nbsp;&nbsp;山梨</option>
			        <option value="B20" >&nbsp;&nbsp;長野</option>
			        <option value="A05" >北陸</option>
			        <option value="B16" >&nbsp;&nbsp;富山</option>
			        <option value="B17" >&nbsp;&nbsp;石川</option>
			        <option value="B18" >&nbsp;&nbsp;福井</option>
			        <option value="A06" >東海</option>
			        <option value="B21" >&nbsp;&nbsp;岐阜</option>
			        <option value="B22" >&nbsp;&nbsp;静岡</option>
			        <option value="B23" >&nbsp;&nbsp;愛知</option>
			        <option value="B24" >&nbsp;&nbsp;三重</option>
			        <option value="A07" >関西</option>
			        <option value="B25" >&nbsp;&nbsp;滋賀</option>
			        <option value="B26" >&nbsp;&nbsp;京都</option>
			        <option value="B27" >&nbsp;&nbsp;大阪</option>
			        <option value="B28" >&nbsp;&nbsp;兵庫</option>
			        <option value="B29" >&nbsp;&nbsp;奈良</option>
			        <option value="B30" >&nbsp;&nbsp;和歌山</option>
			        <option value="A08" >中国</option>
			        <option value="B31" >&nbsp;&nbsp;鳥取</option>
			        <option value="B32" >&nbsp;&nbsp;島根</option>
			        <option value="B33" >&nbsp;&nbsp;岡山</option>
			        <option value="B34" >&nbsp;&nbsp;広島</option>
			        <option value="B35" >&nbsp;&nbsp;山口</option>
			        <option value="A09" >四国</option>
			        <option value="B36" >&nbsp;&nbsp;徳島</option>
			        <option value="B37" >&nbsp;&nbsp;香川</option>
			        <option value="B38" >&nbsp;&nbsp;愛媛</option>
			        <option value="B39" >&nbsp;&nbsp;高知</option>
			        <option value="A10" >九州・沖縄</option>
			        <option value="B40" >&nbsp;&nbsp;福岡</option>
			        <option value="B41" >&nbsp;&nbsp;佐賀</option>
			        <option value="B42" >&nbsp;&nbsp;長崎</option>
			        <option value="B43" >&nbsp;&nbsp;熊本</option>
			        <option value="B44" >&nbsp;&nbsp;大分</option>
			        <option value="B45" >&nbsp;&nbsp;宮崎</option>
			        <option value="B46" >&nbsp;&nbsp;鹿児島</option>
			        <option value="B47" >&nbsp;&nbsp;沖縄</option>
				</select>
			</div>
			<div class="sakura-condition block">
				<h3><i></i><span>開花状況：</span></h3>
				<%foreach $body.sidebarSakura.condition as $condition%>
				<div class="inpput-container">
					<input type="radio" name="condition" id="sakuraCondition<%$condition@index%>" value="<%$condition.condition%>" />
					<label for="sakuraCondition<%$condition@index%>"><%$condition.text%></label>
				</div>
				<%/foreach%>
			</div>
			<div class="sakura-point block">
				<h3><i></i><span>その他：</span></h3>
				<%foreach $body.sidebarSakura.point as $point%>
				<div class="inpput-container">
					<input type="checkbox" name="<%$point.point%>" id="sakuraPoint<%$point@index%>" value="1" />
					<label for="sakuraPoint<%$point@index%>"><%$point.text%></label>
				</div>
				<%/foreach%>
			</div>
			<input type="submit" value="<%$body.sidebarSakura.buttonText%>" class="search-btn" />
		</form>
	</div>
	<div class="sakura-more">
		<a href="<%$body.sidebarSakura.more.link%>" data-sort="more"><%$body.sidebarSakura.more.text%><em> ></em></a>
	</div>
	<span class="flower big"></span>
	<span class="flower small"></span>
</div>

<%script%>
	conf.sidebarSakura = {
		"id" : "sidebarSakura"
	};
	require.async( ["common:widget/ui/jquery/jquery.js", "common:widget/ui/ut/ut.js"], function( $, UT ){
		$( "#" + conf.sidebarSakura.id ).on( "click", ".search-btn", function(){
			UT.send( {
				modId : "sidebar-sakura",
				positon : "search",
				ac : "b"
			} );
		} );
	} );
<%/script%>