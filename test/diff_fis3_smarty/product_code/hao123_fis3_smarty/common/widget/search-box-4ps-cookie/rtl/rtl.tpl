
<dl class="box-search<%if $body.searchBox.logoSize == 's'%> box-search-s<%elseif $body.searchBox.logoSize == 'm'%> box-search-m<%/if%>" monkey="search" log-mod="search">
	<dt id="searchGroupTabs" class="box-search_tab cf">			
		<%foreach $sBoxTag as $value%>
			<%if $value.catagory != 'more'%>
				<%if empty($value.hide)%>
				<%if $value@first%>
				<a data-t="<%$value.catagory%>" class="cur" href="#" onClick="return false"><%$value.title%></a>
				<%else%>
				<s class="box-search_sep"></s>
				<a data-t="<%$value.catagory%>" href="#" onClick="return false"><%$value.title%></a>
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
				<%if !empty($smarty.cookies['searchEngine']) && $smarty.cookies['searchEngine'] < $sBoxTag[0].engine|@count%>
					<%$engineNum = $smarty.cookies['searchEngine']%>
				<%else%>
					<%$engineNum = 0%>
				<%/if%>
				<%foreach $sBoxTag[0].engine as $value%><%if !empty($value.hide)%><%$sBoxCount = $sBoxCount + 1%><%/if%><%/foreach%>
				<dl class="box-search_logo fr <%if count($sBoxTag[0].engine) - $sBoxCount == 1%>box-search_logo_disabled<%/if%>" id="searchGroupLogos">
					<dt>
	                	<%foreach $sBoxTag[0].engine as $value%>
	                	<%if !empty($value.tn[0].param)%><%foreach $value.tn as $tn%><%if $tn.param == $root.urlparam.tn%><%$value.hide = 'true'%><%/if%><%/foreach%><%/if%><%if $value@index != $engineNum%><%$value.hide = 'true'%><%/if%><%if empty($value.hide)%>
	                	<img id="searchGroupLogo" src="<%if !empty($body.searchBox.logoPath)%><%$body.searchBox.logoPath%><%$value.logo%>.png<%else%><%if !empty($head.cdn)%><%$head.cdn%><%/if%>/resource/fe/<%$sysInfo.country%>/search_logo<%if $body.searchBox.logoSize == 's'%>_s<%elseif $body.searchBox.logoSize == 'm'%>_m<%/if%>/<%$value.logo%>.png<%/if%>" alt="<%$value.title%>" data-id="<%$value.id%>" />
	                	<%break%>
	                	<%/if%><%/foreach%>
                	</dt>
				</dl>
			</div>
			<div class="box-search_form">
				<%foreach $sBoxTag[0].engine as $value%>
            	<%if !empty($value.tn[0].param)%><%foreach $value.tn as $tn%><%if $tn.param == $root.urlparam.tn%><%$value.hide = 'true'%><%/if%><%/foreach%><%/if%><%if $value@index != $engineNum%><%$value.hide = 'true'%><%/if%><%if empty($value.hide)%>
				<form id="searchGroupForm" action="<%$value.action%>">
					<span class="o input fr">
						<label for="searchGroupInput" id="searchGroupLabel"<%if !empty($body.searchBox.hotWordsColor)%> style="color:<%$body.searchBox.hotWordsColor%>"<%/if%>><%$sBoxTag[0].hotWords%></label>
						<input name="<%$value.q|default:'q'%>" id="searchGroupInput" type="text">
						<%widget name="common:widget/keyboard/keyboard.tpl"%>
					</span>
					<div class="ibw btn-search cf">
						<span class="btn-search_l"></span>
						<button class="ib btn-search_c" hidefocus="true" id="searchGroupBtn" type="submit"><i class="btn-search_ico"></i></button>
						<span class="btn-search_r"></span>
					</div>
					<span id="searchGroupParams" style="display:none">
						<%if isset($value.params)%>
							<%foreach $value.params as $params%>
								<input type="hidden" name="<%$params.name%>" value="<%$params.value%>">
							<%/foreach%>
						<%/if%>
					</span>
				</form>
				<%break%><%/if%><%/foreach%>
				<div id="searchGroupRadios" class="radios">
                	<%$logoIndex = 0%>
					<%foreach $sBoxTag[0].engine as $value%>
                	<%if !empty($value.tn[0].param)%><%foreach $value.tn as $tn%><%if $tn.param == $root.urlparam.tn%><%$value.hide = 'true'%><%/if%><%/foreach%><%/if%><%if empty($value.hide)%>
					<label for="searchGroupRadio_<%$logoIndex%>"><input id="searchGroupRadio_<%$logoIndex%>" name="searchGroupRadio" value="<%$logoIndex%>" type="radio" <%if $logoIndex == $engineNum%>checked<%/if%>><%$value.title%></label>
					<%$logoIndex = $logoIndex + 1%>
                	<%/if%><%/foreach%>
				</div>
			</div>
		</div>
	</dd>
</dl>

