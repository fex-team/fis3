
	<div class="mod-side">
		<div class="s-mbm pr">
			<label for="datepicker"><%$body.lottery.dateText%>:</label><input type="text" id="datepicker"/>
		</div>
		<div class="s-mbm pr">
			<label for="citypicker"><%$body.lottery.cityText%>:</label><span
			 class="ib">
				<input type="text" id="citypicker" readonly="true"/>
				<span class="lottery-trigger"><i></i></span>
				<ul id="citylist" class="lottery-dropdownlist"></ul>
			</span>
		</div>
		<a class="lottery-search" id="lotterySearch" href="javascript:;"><%$body.lottery.searchText%></a>
		<p class="precise-pos"><span id="preciseLottery"></span></p>
		<div class="lottery-result">
			<table id="lotteryTable">
				<tr>
					<th class="col_l"><%$linksValue.colText1%></th>
					<th><%$linksValue.colText2%></th>
				</tr>
			</table>
		</div>
	</div>
	<%script%>
		conf.lottery = {
			displayType: "<%$body.lottery.displayType%>"?"<%$body.lottery.displayType%>":conf.country,
			dateFormat: "<%$body.lottery.dateFormat|default:'dd-mm-yy'%>",
			changeHour: "<%$body.lottery.changeHour%>",
			minDate: "<%$body.lottery.minDate%>",
			maxDate: "<%$body.lottery.maxDate|default:0%>",
			apiError: "<%$body.lottery.apiError%>",
			apiError2: "<%$body.lottery.apiError2%>"
		};
	<%/script%>
