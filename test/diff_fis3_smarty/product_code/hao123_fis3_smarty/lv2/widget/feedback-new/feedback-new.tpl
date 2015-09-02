<%*   声明对ltr/rtl的css依赖    *%>
<%require name="lv2:widget/feedback-new/`$head.dir`/`$head.dir`.css"%>
<div class="feedback-con">
	<div class="feedback-inner_con cf">
		<form action="<%$body.feedback.submitUrl%>" method="post" id="feedback-form" accept-charset="" enctype="" target="_self">
			<%if !empty($html.feedback)%>
				<%$html.feedback%>
			<%/if%>
			<div class="feedback-bd ui-form ui-form--blue">
				<%if !empty($body.feedback.emotionMsg)%>
					<%$dataEmotion = $body.feedback.emotionMsg%>
					<div class="feedback-emotion">
						<span class="feed-com-title"><%$dataEmotion.emotionTitle%></span>
						<%foreach $dataEmotion.emotionGroup as $list%>
							<label class="ui-form_radio <%if $head.dir == 'rtl'%>ui-form_radio-rtl<%/if%>" <%if !empty($list.isHidden) && $list.isHidden == "1"%> style="display:none"<%/if%>>
								<input type="radio" name="emotion_list" value="<%$list.showValue%>"><span><%$list.showTitle%></span>
							</label>
						<%/foreach%>
						<input type="hidden" class="emotionContainer" name="emotion" value="">				
					</div>
				<%/if%>
				<div class="feedback-cat" id="feedback-cat" <%if !empty($body.feedback.isHidden)%> style="visibility:hidden"<%/if%>>
					<span class="catTitle feed-com-title"><%$body.feedback.selectTitle%>:</span>
					<label class="ui-form_radio <%if $head.dir == 'rtl'%>ui-form_radio-rtl<%/if%>">
						<input type="radio" name="feedback_list"><span><%$body.feedback.errorMsg.cannotOpen%></span>
					</label>
					<label class="ui-form_radio <%if $head.dir == 'rtl'%>ui-form_radio-rtl<%/if%>">
						<input type="radio" name="feedback_list"><span><%$body.feedback.errorMsg.issues%></span>
					</label>
					<label class="ui-form_radio <%if $head.dir == 'rtl'%>ui-form_radio-rtl<%/if%>">
						<input type="radio" name="feedback_list"><span><%$body.feedback.errorMsg.fixHeadPage%></span>
					</label>
					<label class="ui-form_radio <%if $head.dir == 'rtl'%>ui-form_radio-rtl<%/if%>">
						<input type="radio" name="feedback_list"><span><%$body.feedback.errorMsg.exchangeLinks%></span>
					</label>
					<label class="ui-form_radio <%if $head.dir == 'rtl'%>ui-form_radio-rtl<%/if%>">
						<input type="radio" name="feedback_list"><span><%$body.feedback.errorMsg.cooperation%></span>
					</label>
					<label class="ui-form_radio <%if $head.dir == 'rtl'%>ui-form_radio-rtl<%/if%>">
						<input type="radio" name="feedback_list"><span><%$body.feedback.errorMsg.piracy%></span>
					</label>
					<input type="hidden" class="feedbackContainer" name="feedback_type" value="">
					<span class="commenceName" style="display:none"><%$body.feedback.chooseType%></span>
				</div>
				<div class="feedback-content_title cf w500">
					<label for="feedbackText" class="feed-com-title"><%$body.feedback.contentTitle%></label>
					<span id="feedback-word-count" class="feed-count">
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
				<label class="feedback-content_title w500 feed-com-title" for="feedback-way"><%$body.feedback.contactTitle%></label>
				<div class="feedback-contact_content">
					<label class="feedback-contact_way" for="feedback-way" id="feedback-way-label"><%$body.feedback.contactWay%></label>
					<input type="text" class="feedback-inputtext" name="email" id="feedback-way" autocomplete="off"/>
                    <span  class="feedback-way-tip" style="display:none;"><%$body.feedback.emailTip%> </span>
				</div>
				<div class="ibw btn-search cf">
					<span class="btn-search_l"></span>
					<button type="submit" id="searchGroupBtn" hidefocus="true" class="ib btn-search_c"><%$body.feedback.submitButton%></button>
					<span class="btn-search_r"></span>
				</div>
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