<style>
    .side-mod-preload-translate{
        border:1px solid #e3e5e6;
        border-bottom:1px solid #d7d8d9;
        background: #f5f7f7;
    }
    .side-mod-preload-translate > *{
        visibility: hidden;
    }
</style>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/translate/ltr/ltr.css"%> <%else%> <%require name="home:widget/translate/rtl/rtl.css"%> <%/if%>
<div id="translate" class="mod-translate" monkey="translate" log-mod="translate">
	<form id="mod-side-translate" action="http://translate.google.com" onsubmit="">
			<div class="mod-translate-container">
				<i class="mod-translate-text"><%$body.translate.language%>:</i>
				<br />
				<select class="pick_language">
					<%foreach $body.translate.list as $value%>
						<option value="<%$value.from_id%>#<%$value.to_id%>"><%$value.from%>-<%$value.to%></option>
					<%/foreach%>
				</select>
				<br />
				<i class="mod-translate-text"><%$body.translate.content%>:</i>
				<br />

				<input type="hidden" class="needInfo_start" name="sl" value="<%$body.translate.default_from%>" />
				<input type="hidden" class="needInfo_end" name="tl" value="<%$body.translate.default_to%>" />
				<div class="translate_content_wrapper">
					<span class="translate_note_info"><%$body.translate.defaultInfo%></span>
					<textarea name="q" class="translate_content" onkeyup="this.value = this.value.substring(0, 222)"></textarea>
				</div>

				<input type="submit" class="translate-submit" value="<%$body.translate.translate_submit%>"/>
			</div>
		</form>
	<a class="charts_more" href="http://translate.google.com"><%$body.translate.moreInfo%><i class="arrow_r">›</i></a>
</div>
	<%script%>
		require.async('common:widget/ui/jquery/jquery.js',function($){
			$(window).one("e_go.translate", function () {
				require.async(['home:widget/ui/translate/translate.js'],function(translate){
					translate();
				});
			});
			if(!$("#sideMagicBox #translate").length){
				$(window).trigger("e_go.translate");
			}
		});
	<%/script%>
