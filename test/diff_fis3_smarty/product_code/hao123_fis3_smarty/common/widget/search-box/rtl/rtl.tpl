
<dl class="box-search<%if $body.searchBox.logoSize == 's'%> box-search-s<%elseif $body.searchBox.logoSize == 'm'%> box-search-m<%/if%>" monkey="search"  log-mod="search">
	<dt id="searchGroupTabs" class="box-search_tab cf">			
		<%foreach $sBoxTag as $value%>
			<%if $value.catagory != 'more'%>
				<%if empty($body.searchboxTab[$value.catagory])%>
				<%if $value@first%>
				<a data-t="<%$value.catagory%>" class="cur" href="#" onClick="return false"><%$value.title%></a>
				<%else%>				
				    <%if !empty($value.isNewAdd) &&$value.isNewAdd == 'true'%>
                            <%if !empty($value.area) && $value.area =="id" %>                               
                                <%assign var="tmpClassName" value="new_add_prompt_id"%>
                            <%else%>
                                <%assign var="tmpClassName" value="new_add_prompt"%>
                            <%/if%> 
					    	<s class="box-search_sep"></s>
							<a data-t="<%$value.catagory%>" href="#" onClick="return false" style="position:relative;"><%$value.title%><span class="<%$tmpClassName%>"></span></a>
					<%else%>
					    	<s class="box-search_sep"></s>
							<a data-t="<%$value.catagory%>" href="#" onClick="return false"><%$value.title%></a>
					<%/if%>
				<%/if%>
				<%/if%>
			<%else%>
	            <span>
					<dl id="searchGroupMoreTab" class="box-search_more">
						<dt>
							<a href="#" onClick="return false" hidefocus="true"><%$value.title%></a>
							<div class="arrow">
								<div class="arrow_bg"></div>
							</div>
						</dt>
					</dl>
				</span>
			<%/if%>
		<%/foreach%>
	</dt>
	<dd class="box-search_wrap">
		<div class="box-search_inner cf">
			<div class="box-search_logo_wrap">
				<%$sBoxCount = 0%>
				<%foreach $sBoxTag[0].engine as $value%><%if !empty($body.searchboxEngine[$value.id])%><%$sBoxCount = $sBoxCount + 1%><%/if%><%/foreach%>
				<dl class="box-search_logo fr <%if count($sBoxTag[0].engine) - $sBoxCount == 1%>box-search_logo_disabled<%/if%>" id="searchGroupLogos">
					<dt>
	                	<%foreach $sBoxTag[0].engine as $value%>
	                	<%if empty($body.searchboxEngine[$value.id])%>
						<a href="#" id="searchGroupWebEngine" onclick="return false" title="<%$value.title%>" hidefocus="true" data-n="0" data-num="0">
		                	<img id="searchGroupLogo" src="<%if !empty($body.searchBox.logoPath)%><%$body.searchBox.logoPath%><%$value.logo%>.png<%else%>/resource/fe/<%$sysInfo.country%>/search_logo<%if $body.searchBox.logoSize == 's'%>_s<%elseif $body.searchBox.logoSize == 'm'%>_m<%/if%>/<%$value.logo%>.png<%/if%>" alt="<%$value.title%>" data-id="<%$value.id%>" />
	                	</a><%break%>
	                	<%/if%><%/foreach%>
                	</dt>
                	<%$logoIndex = 0%>
                	<%foreach $sBoxTag[0].engine as $value%>
                	<%if empty($body.searchboxEngine[$value.id])%>
	                	<dd class="box-search_logo_hide">
	                		<a href="#" onclick="return false" title="<%$value.title%>" hidefocus="true" data-n="<%$logoIndex%>">
			                	<img id="searchGroupLogo_<%$logoIndex%>" src="/resource/fe/img/blank.gif" data-src="<%if !empty($body.searchBox.logoPath)%><%$body.searchBox.logoPath%><%$value.logo%>.png<%else%><%if !empty($head.cdn)%><%$head.cdn%><%/if%>/resource/fe/<%$sysInfo.country%>/search_logo<%if $body.searchBox.logoSize == 's'%>_s<%elseif $body.searchBox.logoSize == 'm'%>_m<%/if%>/<%$value.logo%>.png<%/if%>" alt="<%$value.title%>" />
		                	</a>
	                	</dd> 
                		<%$logoIndex = $logoIndex + 1%>
                	<%/if%><%/foreach%>
				</dl>
			</div>
			<div class="box-search_form">
				<%foreach $sBoxTag[0].engine as $value%>
            	<%if empty($body.searchboxEngine[$value.id])%>
				<form id="searchGroupForm" action="<%$value.action%>">
					<span class="o input fr box-search_focus">
						<label for="searchGroupInput" id="searchGroupLabel"<%if !empty($body.searchBox.hotWordsColor)%> style="color:<%$body.searchBox.hotWordsColor%>"<%/if%>><%$sBoxTag[0].hotWords%></label>
						<input name="<%$value.q|default:'q'%>" id="searchGroupInput" type="text" placeholder="<%$value.placeholder%>">
						<%widget name="common:widget/keyboard/keyboard.tpl"%>
					</span>
					<div class="ibw btn-search cf">
						<span class="btn-search_l"></span>
						<button class="ib btn-search_c" hidefocus="true" id="searchGroupBtn" type="submit" style="font-size: <%$sBtnWords.fontSize%>px;">
							<%if !empty($sBtnWords.word)%>
							    <%$sBtnWords.word%>
							<%else%>
							    <i class="btn-search_ico"></i>
							<%/if%>
						</button>
						<span class="btn-search_r"></span>
					</div>
					<span id="searchGroupParams" style="display:none">
						<%if isset($value.params)%>
							<%foreach $value.params as $params%>
							    <%if !empty($params.name)%>
								<input type="hidden" name="<%$params.name%>" value="<%$params.value%>">
								<%/if%>
							<%/foreach%>
						<%/if%>
					</span>
				</form>
				<%break%><%/if%><%/foreach%>
			</div>
			<div class="box-search_hsrch" id="hotSearchWords" log-mod="hot-word" style="font-size: <%$hSearchWords.fontSize%>px;">
				
				<%if !empty($hSearchWords.title)%>
				    <span class="hsrch_title"><%$hSearchWords.title%>: </span>
				    <span class="hsrch_word">
				        <%foreach $hSearchWords.words as $val%>
				            <%if !empty($val.url)%>
				            <span><a href="<%$val.url%>" hidefocus="true" data-sort="links" data-val="<%$val.name%>"><%$val.name%></a></span>
				            <%else%>
				            <span><a href="#" onclick="return false" hidefocus="true" data-sort="links" data-val="<%$val.name%>"><%$val.name%></a></span>
				            <%/if%>
				        <%/foreach%>
				    </span>
				<%/if%>
			</div>
		</div>
	</dd>
</dl>
<%script%>
    conf.hSearchWords = <%json_encode($hSearchWords)%> || {};
    conf.emptyQuerySug = <%json_encode($body.emptyQuerySug)%>;
<%/script%>

