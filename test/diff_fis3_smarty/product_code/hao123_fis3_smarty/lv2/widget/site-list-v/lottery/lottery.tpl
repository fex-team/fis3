
	<%*   声明对ltr/rtl的css依赖    *%>
	<%if $head.dir=='ltr'%> <%require name="lv2:widget/site-list-v/lottery/ltr/ltr.css"%> <%else%> <%require name="lv2:widget/site-list-v/lottery/rtl/rtl.css"%> <%/if%>
	<%foreach $data as $linksValue%>
		<dl class="box-lv2 s-mbm mod-lottery">
			<dt><%$linksValue.name%></dt>
			<dd>
				<div class="tc">
					<span class="s-mbm pr ib">
						<label for="datepicker"><%$linksValue.dateText%>:</label>
						<input type="text" id="datepicker"/>
					</span>
					<span class="s-mbm pr ib">
						<label for="citypicker"><%$linksValue.cityText%>:</label>
						<span class="ib">
							<input type="text" id="citypicker" readonly="true"/>
							<span class="lottery-trigger"><i></i></span>
							<ul id="citylist" class="lottery-dropdownlist"></ul>
						</span>
					</span>
					<button class="lottery-search" id="lotteryLv2Search"><%$linksValue.searchText%></button>
				</div>
				<p class="precise-pos">KẾT QUẢ XỔ SỐ &nbsp;<span id="preciseLottery"></span></p>
				<table id="lotteryTable">
					<tr>
						<th class="col_l"><%$linksValue.colText1%></th>
						<th><%$linksValue.colText2%></th>
					</tr>
				</table>
			</dd>
		</dl>
	<%/foreach%>
	<%script%>
		conf.lottery = {
			displayType: "<%$body.moduleList[0].data[0].displayType%>"?"<%$body.moduleList[0].data[0].displayType%>":conf.country,
			dateFormat: "<%$body.moduleList[0].data[0].dateFormat|default:'dd-mm-yy'%>",
			defaultDate: "<%$body.moduleList[0].data[0].defaultDate|default:0%>",
			minDate: "<%$body.moduleList[0].data[0].minDate%>",
			maxDate: "<%$body.moduleList[0].data[0].maxDate|default:0%>"
		};
		<%if !empty($body.datepicker.show) && $body.datepicker.show == "1"%>
		<%*日期控件*%>
		conf.datepicker = <%json_encode($body.datepicker)%>;
		conf.datepicker.firstDay = ~~conf.datepicker.firstDay;
		conf.datepicker.isRTL = !!(~~conf.datepicker.isRTL);
		conf.datepicker.showMonthAfterYear = !!(~~conf.datepicker.showMonthAfterYear);
		<%/if%>
		require.async(["common:widget/ui/jquery/jquery.js", "common:widget/ui/lottery/lottery.js"],function($,sideLottery){
			if($(".mod-lottery").length){
				sideLottery(conf.pageType);
			}
		});
	<%/script%>
