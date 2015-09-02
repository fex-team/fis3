<style>
    .side-mod-preload-bus{
        border:1px solid #e3e5e6;
        border-bottom:1px solid #d7d8d9;
        background: #f5f7f7;
    }
    .side-mod-preload-bus > *{
        visibility: hidden;
    }
</style>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/bus/ltr/ltr.css"%> <%else%> <%require name="home:widget/bus/rtl/rtl.css"%> <%/if%>
	<div id="sideBus" class="mod-bus" monkey="sideBus" log-mod="bustransfer">
		<form id="mod-side-bus" action="<%$body.bus.url%>" onsubmit="">
			<input type="hidden" id="flatlon" name="flatlon" value="">
			<div class="bus-info">
				<p class="bus-info-detail">
					<i class="bus-info-mesaage"><%$body.bus.from%>:&nbsp;</i><span class="bus-note-info"><%$body.bus.note1%></span><input type="text" name="from" class="from-position" autocomplete="off">
					<input type="hidden" id="tlatlon" name="tlatlon" value="">
				</p>
				<p class="bus-info-detail">
					<i class="bus-info-mesaage"><%$body.bus.to%>:&nbsp;</i><span class="bus-note-info"><%$body.bus.note2%></span><input type="text" name="to" class="to-position" autocomplete="off">
				</p>
				<p class="bus-info-detail">
					<span class="bus-info-mesaage"><%$body.bus.transfer%>:&nbsp;</span>
					<input type="text" name="via" class="via-position" autocomplete="off">
					<input type="hidden" name="shin" id="sexp" value="1">
					<input type="hidden" name="ex" id="exp" value="1">
					<input type="hidden" name="al" id="air" value="1">
					<input type="hidden" name="hb" id="hbus" value="1">
					<input type="hidden" name="lb" id="bus" value="1">
					<input type="hidden" name="sr" id="fer" value="1">
					<input type="hidden" name="expkind" id="expkind" value="1">
				</p>
				<div class="bus-info-r">
					<i class="exchange"></i>
				</div>
				<div class="bus-info-b">
					<p class="bus-info-detail bus-info-selet">
						<select name="ym" id="ym">
						</select>
						<select name="d" id="d">
						  <option value="01">1日</option>
						  <option value="02">2日</option>
						  <option value="03">3日</option>
						  <option value="04">4日</option>
						  <option value="05">5日</option>
						  <option value="06">6日</option>
						  <option value="07">7日</option>
						  <option value="08">8日</option>
						  <option value="09">9日</option>
						  <option value="10">10日</option>
						  <option value="11">11日</option>
						  <option value="12">12日</option>
						  <option value="13">13日</option>
						  <option value="14">14日</option>
						  <option value="15">15日</option>
						  <option value="16">16日</option>
						  <option value="17">17日</option>
						  <option value="18">18日</option>
						  <option value="19">19日</option>
						  <option value="20">20日</option>
						  <option value="21">21日</option>
						  <option value="22">22日</option>
						  <option value="23">23日</option>
						  <option value="24">24日</option>
						  <option value="25">25日</option>
						  <option value="26">26日</option>
						  <option value="27">27日</option>
						  <option value="28">28日</option>
						  <option value="29">29日</option>
						  <option value="30">30日</option>
						  <option value="31">31日</option>
						</select>
					</p>
					<input type="hidden" id="datepicker" name="datepicker">
					<p class="bus-info-detail bus-info-selet">
						<select name="hh" id="hh">
						  <option value="0">0</option>
						  <option value="01">1</option>
						  <option value="02">2</option>
						  <option value="03">3</option>
						  <option value="04">4</option>
						  <option value="05">5</option>
						  <option value="06">6</option>
						  <option value="07">7</option>
						  <option value="08">8</option>
						  <option value="09">9</option>
						  <option value="10">10</option>
						  <option value="11">11</option>
						  <option value="12">12</option>
						  <option value="13">13</option>
						  <option value="14">14</option>
						  <option value="15">15</option>
						  <option value="16">16</option>
						  <option value="17">17</option>
						  <option value="18">18</option>
						  <option value="19">19</option>
						  <option value="20">20</option>
						  <option value="21">21</option>
						  <option value="22">22</option>
						  <option value="23">23</option>
						</select>
						<span>:</span>
						<select name="m1" id="m1">
						   <option value="0">0</option>
						   <option value="1">1</option>
						   <option value="2">2</option>
						   <option value="3">3</option>
						   <option value="4">4</option>
						   <option value="5">5</option>
						</select>
						<select name="m2" id="m2" tabindex="520">
						  <option value="0">0</option>
						  <option value="1">1</option>
						  <option value="2">2</option>
						  <option value="3">3</option>
						  <option value="4">4</option>
						  <option value="5">5</option>
						  <option value="6">6</option>
						  <option value="7">7</option>
						  <option value="8">8</option>
						  <option value="9">9</option>
						</select>
						<select name="type" id="bus-method" tabindex="520">
						  <option value="1"><%$body.bus.start%></option>
						  <option value="4"><%$body.bus.des%></option>
						  <option value="3"><%$body.bus.begin%></option>
						  <option value="2"><%$body.bus.end%></option>
						</select>
						<!-- <input type="radio" class="radio-type" name="type" value="1" checked/>&nbsp;&nbsp;
						<input type="radio" class="radio-type" name="type" value="4"/> -->
					</p>
					<p class="bus-info-detail">
						<span class="order-bus"><%$body.bus.order%>:</span>
						<input type="hidden" name="ws" id="ws" value="2">
						<select name="s" class="order_items">
							<option value="0" selected=""><%$body.bus.order_item.first%></option>
							<option value="2"><%$body.bus.order_item.second%></option>
							<option value="1"><%$body.bus.order_item.third%></option>
						</select>
					</p>
					<p class="bus-info-detail">
						<input type="submit" class="bus-submit" value="<%$body.bus.submit_btn%>"/>
					</p>
				</div>

			</div>
			<a class="charts_more" href="<%$body.bus.url_submit%>"><%$body.bus.text%><i class="arrow_r">›</i></a>
		</form>
</div>
	<%script%>
		require.async("common:widget/ui/jquery/jquery.js", function ($) {
			$(window).one("e_go.bus", function () {
				require.async(['home:widget/ui/bus/bus.js'],function(bus){
					bus();
				});
			});
			if(!$("#sideMagicBox #sideBus").length){
				$(window).trigger("e_go.bus");
			}
		});
	<%/script%>
