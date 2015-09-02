<%*只有新首页用*%>
<%assign var="sBoxTag" value=$body.searchBox.sBoxTag%>
<%assign var="hSearchWords" value=$body.searchBox.hotSearchWords%>
<%assign var="sBtnWords" value=$body.searchBox.searchBtnWords%>

<%style%>
	<%if $head.dir=='ltr'%>
		@import url('/widget/search-box-new/ltr/ltr.css?__inline');
	<%else%>
		@import url('/widget/search-box-new/rtl/rtl.css?__inline');
	<%/if%>
<%/style%>

<%if $head.dir=='ltr'%> 
<%require name="common:widget/search-box-new/ltr/ltr.more.css"%>
<%else%>
<%require name="common:widget/search-box-new/rtl/rtl.more.css"%> 
<%/if%>
<%strip%>
<dl class="box-search" monkey="search" log-mod="search">
	<dt id="searchGroupTabs" class="box-search_tab cf">			
		<%foreach $sBoxTag as $value%>
			<%if $value.catagory != 'more'%>
				<%if empty($body.searchboxTab[$value.catagory])%>
					<%if $value@first%>
						<a data-t="<%$value.catagory%>" class="cur" href="#" onClick="return false"><%$value.title%></a>
					<%else%> 
					    <%if $value.isNewAdd == 'true'%>
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
			<%/if%>
		<%/foreach%>
	</dt>
	<dd class="box-search_wrap">
		<div class="box-search_inner cf">
			<div class="box-search_logo_wrap">
				<%$sBoxCount = 0%>
				<%foreach $sBoxTag[0].engine as $value%>
				    <%if !empty($body.searchboxEngine[$value.id])%>
				        <%$sBoxCount = $sBoxCount + 1%>
				    <%/if%>
				<%/foreach%>
				<dl class="box-search_logo <%if $head.dir=='ltr'%>fl<%else%>fr<%/if%> <%if count($sBoxTag[0].engine) - $sBoxCount == 1%>box-search_logo_disabled<%/if%>" id="searchGroupLogos">
					<dt>
	                	<%foreach $sBoxTag[0].engine as $value%>
		                	<%if empty($body.searchboxEngine[$value.id])%>
								<a href="#" id="searchGroupWebEngine" onclick="return false" title="<%$value.title%>" hidefocus="true" data-n="0" data-num="0">
				                	<img id="searchGroupLogo" src="<%if !empty($body.searchBox.logoPath)%><%$body.searchBox.logoPath%><%$value.logo%>.png<%else%>/resource/fe/<%$sysInfo.country%>/search_logo/<%$value.logo%>.png<%/if%>" alt="<%$value.title%>" data-id="<%$value.id%>" />
			                	</a><%break%>
		                	<%/if%>
	                	<%/foreach%>
                	</dt>
                	<%$logoIndex = 0%>
                	<%foreach $sBoxTag[0].engine as $value%>
	                	<%if empty($body.searchboxEngine[$value.id])%>
		                	<dd class="box-search_logo_hide">
		                		<a href="#" onclick="return false" title="<%$value.title%>" hidefocus="true" data-n="<%$logoIndex%>">
				                	<img id="searchGroupLogo_<%$logoIndex%>" src="/resource/fe/img/blank.gif" data-src="<%if !empty($body.searchBox.logoPath)%><%$body.searchBox.logoPath%><%$value.logo%>.png<%else%><%if !empty($head.cdn)%><%$head.cdn%><%/if%>/resource/fe/<%$sysInfo.country%>/search_logo/<%$value.logo%>.png<%/if%>" alt="<%$value.title%>" />
			                	</a>
		                	</dd> 
	                		<%$logoIndex = $logoIndex + 1%>
	                	<%/if%>
                	<%/foreach%>
				</dl>
			</div>
			<div class="box-search_form">
				<%foreach $sBoxTag[0].engine as $value%>
	            	<%if empty($body.searchboxEngine[$value.id])%>
						<form id="searchGroupForm" action="<%$value.action%>">
							<span class="o input <%if $head.dir=='ltr'%>fl<%else%>fr<%/if%>">
								<input name="<%$value.q|default:'q'%>" id="searchGroupInput" type="text">
								<%if $head.dir=='rtl'%>
								    <%widget name="common:widget/keyboard/keyboard.tpl"%>
								<%/if%>
							</span>
							<div class="ibw btn-search cf">
								<button class="ib btn-search_c" hidefocus="true" id="searchGroupBtn" type="submit" style="font-size: <%$sBtnWords.fontSize%>px;">
									<%if !empty($sBtnWords.word)%>
									    <%$sBtnWords.word%>
									<%else%>
									    <i class="btn-search_ico"></i>
									<%/if%>
								</button>
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
						<%break%>
					<%/if%>
				<%/foreach%>
			</div>
			<div class="box-search_hsrch" id="hotSearchWords" log-mod="hot-word" style="font-size: <%$hSearchWords.fontSize%>px;">
				<%if !empty($hSearchWords.title)%>
				    <span class="hsrch_title"><%$hSearchWords.title%>: </span>
				    <span class="hsrch_word">
				        <%foreach $hSearchWords.words as $val%>
				        	<%if !empty($hSearchWords.length) && $val@iteration > $hSearchWords.length%>
				        		<%break%>
				        	<%/if%>
				            <%if !empty($val.url)%>
				                <span>
				                    <a href="<%$val.url%>" hidefocus="true" data-sort="links" data-val="<%$val.name%>"><%$val.name%></a>
				                </span>
				            <%else%>
				                <span>
				                    <a href="#" onclick="return false" hidefocus="true" data-sort="links" data-val="<%$val.name%>"><%$val.name%></a>
				                </span>
				            <%/if%>
				        <%/foreach%>
				    </span>
				<%/if%>
			</div>
		</div>
	</dd>
</dl>
<%/strip%>

<%widget name="common:widget/search-box-new/`$sysInfo.country`/`$sysInfo.country`.tpl"%>

<%script%>
<%strip%>
require.async(["common:widget/search-box-new/search-box-new-async.js"], function ($) {
	var autoFocusSearch = true;
<%if $body.extAppMod%>
	autoFocusSearch = false;
<%/if%>
<%if !empty($body.searchBox.sugUrl)%>
    var head = document.getElementsByTagName("head")[0];
	var requestScript = function(url, onsuccess, onerror, timeout) {

		var script = document.createElement('script');
		if (onerror) {
			var tid = setTimeout(function() {
				script.onload = script.onreadystatechange = script.onerror = null;
				timeout();
			}, 5000);

			script.onerror = function() {
				clearTimeout(tid);
				onerror();
			};

			script.onload = script.onreadystatechange = function() {
				if ( !script.readyState || /loaded|complete/.test( script.readyState ) ) {
					script.onload = script.onreadystatechange = null;
					script = undefined;
					clearTimeout(tid);
					onsuccess();
				}
			}
		}
		script.type = 'text/javascript';
		script.src = url;
		head.appendChild(script);
	};

	requestScript("<%$body.searchBox.sugUrl%>", function() {
	    if(typeof baidu_sug !== 'undefined') {
	    	baidu_sug.setMode('baidu');
	    	baidu_sug.toggle(false);
	    }
		Gl.searchGroup({
			type: conf.pageType,
			autoFocus: autoFocusSearch
		});
	}, function() {
		baidu_sug = false;
		Gl.searchGroup({
			type: conf.pageType,
			autoFocus: autoFocusSearch
		});
	}, function() {
	    baidu_sug = false;
		Gl.searchGroup({
			type: conf.pageType,
			autoFocus: autoFocusSearch
		});
	});
<%else%>
	baidu_sug = false;
	Gl.searchGroup({type: conf.pageType, autoFocus: autoFocusSearch});
<%/if%>

<%if !empty($body.searchBox.sugMoreUrl)%>
    setTimeout(function() {
        window["require"] && require.async("<%$body.searchBox.sugMoreUrl%>");
	}, 1e3);
<%/if%>
});
<%/strip%>
<%/script%>
