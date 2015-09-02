
	<div class="mod-side mod-side-2">
		<dl class="tc s-pbs" id="lotteryTable">
		</dl>
		<div class="s-pa15">
			<div class="s-mbm pr">
				<label for="datepicker"><%$body.lottery.dateText%>:</label><span
				class="ib">
					<input type="text" id="datepicker" readonly="true"/>
					<span class="lottery-trigger"><i></i></span>
					<ul id="datelist" class="lottery-dropdownlist"></ul>
				</span>
			</div>
			<div class="s-mbm">
				<label for="lotteryNum"><%$body.lottery.numberText%>:</label><input type="text" id="lotteryNum"/>
			</div>
			<a class="lottery-search" id="lotterySearch" href="<%$body.lottery.resultLinkUrl%>"><%$body.lottery.searchText%></a>
		</div>
	</div>
	<%script%>
		conf.lottery = {
			displayType: "<%$body.lottery.displayType%>"?"<%$body.lottery.displayType%>":conf.country
		};
	<%/script%>
