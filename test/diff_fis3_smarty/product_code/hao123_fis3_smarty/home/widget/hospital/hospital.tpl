<%*   声明对ltr/rtl的css依赖    *%>
<%require name="home:widget/hospital/ltr/<%$head.dir%>.css"%>
<div id="sideHospitle" class="mod-hospitle" log-mod="hospital">
	<form action="http://caloo.jp/hospitals/dosearch" id="HospitalDosearchForm" method="post" accept-charset="utf-8" target="_blank">
		<div class="hd ui-form">
			<div class="top-searchbox">
				<div class="search-row" id="search-area">
					<label class="ui-form_radio"><input type="radio" name="areatype" value="area" checked=""><span><%$body.hospital.area%></span></label>
					<label class="ui-form_radio"><input type="radio" name="areatype" value="station"><span><%$body.hospital.station%></span></label>
					<input type="text" name="area" id="area" value="" class="inputbox" placeholder="<%$body.hospital.note1%>">
				</div>
				<p class="ic-plus"></p>
				<div class="search-row" id="search-keyword">
					<label class="ui-form_radio"><input type="radio" name="keywordtype" value="hospname" checked=""><span><%$body.hospital.hospName%></span></label>
					<label class="ui-form_radio"><input type="radio" name="keywordtype" value="keyword"><span><%$body.hospital.subject%></span></label>
					
					<input type="text" name="keyword" id="keyword" value="" class="inputbox" placeholder="<%$body.hospital.note2%>">
				</div>
			</div>
			
			<input type="submit" value="<%$body.hospital.submit_btn%>" title="<%$body.hospital.submit_btn%>" class="searchbutton" id="searchBtn">
		</div>
		<div class="bd ui-form">
			<div class="bd-row week-wrap">
				<h4 class="bd-title"><%$body.hospital.weekTitle%></h4>
				<div class="bd-content week-content">
					<%foreach $body.hospital.week_list as $value%>
						<label class="ui-form_radio <%if $value@index gt 4%>color-red<%/if%>"><input type="radio" name="weekday" value="<%$value@index+1%>"><span><%$value.name%></span></label>
						<%if $value@index eq 4%>
							<br/>
						<%/if%>
					<%/foreach%>
				</div>
			</div>
			<div class="bd-row time-wrap">
				<h4 class="bd-title time-title"><%$body.hospital.timeTitle%></h4>
				<div class="bd-content time-content">
					<select name="time" id="timeSelect">
						<option value="-1">(指定なし)</option>
						<option value="0">0時</option>
						<option value="1">1時</option>
						<option value="2">2時</option>
						<option value="3">3時</option>
						<option value="4">4時</option>
						<option value="5">5時</option>
						<option value="6">6時</option>
						<option value="7">7時</option>
						<option value="8">8時</option>
						<option value="9">9時</option>
						<option value="10">10時</option>
						<option value="11">11時</option>
						<option value="12">12時</option>
						<option value="13">13時</option>
						<option value="14">14時</option>
						<option value="15">15時</option>
						<option value="16">16時</option>
						<option value="17">17時</option>
						<option value="18">18時</option>
						<option value="19">19時</option>
						<option value="20">20時</option>
						<option value="21">21時</option>
						<option value="22">22時</option>
						<option value="23">23時</option>
					</select>
				</div>
			</div>
			<div class="bd-row hosp-choice-wrap">
				<h4 class="bd-title"><%$body.hospital.criteria%></h4>
				<div class="bd-content week-content">
					<%foreach $body.hospital.criteria_list as $value%>
						<label class="ui-form_checkbox"><input type="checkbox" name="criteria[<%$value.id%>]" value="<%$value.name%>"><span><%$value.name%></span></label>
					<%/foreach%>
				</div>
			</div>
			<div class="bd-row else-choice-wrap">
				<h4 class="bd-title"><%$body.hospital.else%></h4>
				<div class="bd-content week-content">
					<%foreach $body.hospital.else_list as $value%>
						<label class="ui-form_checkbox"><input type="checkbox" name="criteria[<%$value.id%>]" value="<%$value.name%>"><span><%$value.name%></span></label>
						<%if $value@index eq 2%>
							<br/>
						<%/if%>
					<%/foreach%>
				</div>
			</div>
		</div>	
	</form>
</div>
<%script%>
	conf.hospital = {
		note1: "<%$body.hospital.note1%>",
		note2: "<%$body.hospital.note2%>"
	};
	require.async("common:widget/ui/jquery/jquery.js", function ($) {
		$(window).one("e_go.hospital", function () {
			require.async(['home:widget/ui/hospital/hospital.js'],function(hospital){
				hospital();
			});
		});
		if(!$("#sideMagicBox #sideHospitle").length){
			$(window).trigger("e_go.hospital");
		}
	});
<%/script%>
