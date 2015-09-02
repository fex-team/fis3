<style>
    .side-mod-preload-resulttest{
        border:1px solid #e3e5e6;
        border-bottom:1px solid #d7d8d9;
        background: #f5f7f7;
    }
    .side-mod-preload-resulttest > *{
        visibility: hidden;
    }
</style>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/resulttest/ltr/ltr.css"%> <%else%> <%require name="home:widget/resulttest/rtl/rtl.css"%> <%/if%>
	<div class="mod-exam box-border" id="sideResultTest" monkey="sideResultTest" log-mod="testresult">
		<h3 class="h-2"><%$body.resulttest.first%></h3>
		<hr class="exam_line"/>
		<p class="exam_detail-info"><%$body.resulttest.second%></p>
		<p class="exam_detail-info"><%$body.resulttest.third%></p>
		<p class="exam_detail-info"><%$body.resulttest.forth%></p>
		<hr class="exam_line_limit"/>
		<p class="exam_radio-p">
			<input type="radio" class="exam_radio-type" value="1" name="level" checked/>&nbsp;<%$body.resulttest.five%>&nbsp;
			<input type="radio" class="exam_radio-type" value="2" name="level"/>&nbsp;<%$body.resulttest.six%>
		</p>
		<form id="mod-side-result-test" class="mod-side-result-test" action="http://nateega.masrawy.com/Thanaweya_L1.aspx">
			<p class="exam_radio-p">
				<%$body.resulttest.seven%>&nbsp;<input autocomplete="off" type="text" name="seatno" class="seatno-area"/>
				<input type="submit" value="<%$body.resulttest.eight%>" class="exam_submit" />
			</p>
		</form>
		<i class="icon-new_red new-icon-test"></i>
	</div>
	<%script%>
		require.async(['common:widget/ui/jquery/jquery.js', 'home:widget/resulttest/resulttest-async.js'],function($,resultTest){
			resultTest();
		});
	<%/script%>
