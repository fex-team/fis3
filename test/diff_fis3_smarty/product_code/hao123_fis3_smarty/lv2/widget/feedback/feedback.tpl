<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="lv2:widget/feedback/ltr/ltr.css"%> <%else%> <%require name="lv2:widget/feedback/rtl/rtl.css"%> <%/if%>
	<div class="feedback-con">
		<div class="feedback-inner_con cf">
			<form action="<%$body.feedback.submitUrl%>" method="post" id="feedback-form" accept-charset="" enctype="" target="_self">
				<%if !empty($html.feedback)%>
					<%$html.feedback%>
				<%/if%>
				<br/>
				<div class="feedback-cat" <%if !empty($body.feedback.isHidden)%> style="visibility:hidden"<%/if%>>
					<span class="catTitle"><%$body.feedback.selectTitle%>:</span>
					<input type="radio" name="feedback_list" label="<%$body.feedback.errorMsg.cannotOpen%>"> <%$body.feedback.errorMsg.cannotOpen%> 
					<input type="radio" name="feedback_list" label="<%$body.feedback.errorMsg.issues%>"> <%$body.feedback.errorMsg.issues%>
					<input type="radio" name="feedback_list" label="<%$body.feedback.errorMsg.fixHeadPage%>"> <%$body.feedback.errorMsg.fixHeadPage%>
					<input type="radio" name="feedback_list" label="<%$body.feedback.errorMsg.exchangeLinks%>"> <%$body.feedback.errorMsg.exchangeLinks%>
					<input type="radio" name="feedback_list" label="<%$body.feedback.errorMsg.cooperation%>"> <%$body.feedback.errorMsg.cooperation%>
					<input type="radio" name="feedback_list" label="<%$body.feedback.errorMsg.piracy%>"> <%$body.feedback.errorMsg.piracy%>
					<input type="hidden" class="feedbackContainer" name="feedback_type" value="">
					<span class="commenceName" style="display:none"><%$body.feedback.chooseType%></span>
				</div>
				<br/>
				<div class="feedback-content_title cf">
					<label for="feedbackText"><%$body.feedback.contentTitle%></label>
					<span id="feedback-word-count">
						<span id="feedback-word-count-l">0</span>/1000
					</span>
				</div>
				<div class="feedback-content">
					<label id="feedback-error-tip" for="feedbackText">
    					<%$body.feedback.errorTip%>
    				</label>
			        <textarea id="feedbackText" class="feedback-content-text" name="description" maxlength="1000"></textarea>
			        <input type="hidden" name="product_line" value="<%$body.feedback.product_line%>">
					<input type="hidden" name="ac" value="create">
					<input type="hidden" name="fr" value="http://<%$sysInfo.country%>.hao123.com">
    			</div>
				<label class="feedback-content_title" for="feedback-way"><%$body.feedback.contactTitle%></label>
				<div class="feedback-contact_content">
					<label class="feedback-contact_way" for="feedback-way" id="feedback-way-label"><%$body.feedback.contactWay%></label>
					<input type="text" class="feedback-inputtext" name="email" id="feedback-way" autocomplete="off"/>
				</div>
				<div class="ibw btn-search cf">
					<span class="btn-search_l"></span>
					<button type="submit" id="searchGroupBtn" hidefocus="true" class="ib btn-search_c"><%$body.feedback.submitButton%></button>
					<span class="btn-search_r"></span>
				</div>
			</form>
			<%if !empty($body.feedback.safeDes)%><span class="safeDes"><%$body.feedback.safeDes%></span><%/if%>
			<form class="encryption-form" action="<%$body.feedback.submitUrl%>" method="post" style="display:none;" accept-charset="" enctype="" target="_self">
				<input type="hidden" value="" name="product_line"  class="productline"/>
				<input type="hidden" value="" name="encode_data" class="encodedata"/>
			</form>
		</div>
	</div>
<script src="http://crypto-js.googlecode.com/svn/tags/3.0.2/build/rollups/aes.js"></script>
<script src="http://crypto-js.googlecode.com/svn/tags/3.0.2/build/rollups/md5.js"></script>
<script src="http://crypto-js.googlecode.com/svn/tags/3.0.2/build/components/pad-zeropadding.js"></script>
<%script%>

	conf.feedback={
		errorTip:"<%$body.feedback.errorTip%>"
	}
	require.async('lv2:widget/feedback/feedback.js');
<%/script%>
