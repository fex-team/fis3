<%extends file='common/page/layout/base.tpl'%>
<%block name="layout"%>

	<div alog-alias="p-1">
		<%block name="user-bar"%><%/block%>
		<%block name="skin-background"%><%/block%>
	</div>
	<div alog-alias="p-2" class="l-wrap">
		<%block name="search-group"%><%/block%>
		<%block name="userbar-btn-test"%><%/block%>
	</div>
	<%********** hotsite 3/4 start **********%>
	<%if !empty($head.splitHotsite)%>
		<div alog-alias="p-3" class="l-wrap s-mbm">
			<div class="l-g cf">
				<%********** ltr-sideBeLeft layout **********%>
				<%if !empty($head.sideBeLeft)%>
					<div alog-alias="p-3-1" class="<%if !empty($head.flowLayout)%>l-flow-side<%else%>l-g1-4<%/if%>">
						<%block name="side-mod"%><%/block%>
					</div>
					<div alog-alias="p-3-2" class="<%if !empty($head.flowLayout)%>l-flow-main<%else%>l-g3-4<%/if%>">
						<div class="l-g cf">
							<%block name="hot-site"%><%/block%>
							<%block name="trigger-flow-css"%><%/block%>
						</div>
						<div class="l-g cf">
							<%block name="sort-area"%><%/block%>
						</div>
					</div>
				<%********** normal  **********%>
				<%else%>
					<div alog-alias="p-3-1" class="<%if !empty($head.flowLayout)%>l-flow-main<%else%>l-g3-4<%/if%>">
						<div class="l-g cf">
							<%block name="hot-site"%><%/block%>
							<%block name="trigger-flow-css"%><%/block%>
						</div>
						<div class="l-g cf">
							<%block name="sort-area"%><%/block%>
						</div>
					</div>
					<div alog-alias="p-3-2" class="<%if !empty($head.flowLayout)%>l-flow-side<%else%>l-g0<%/if%>">
						<%block name="side-mod"%><%/block%>
					</div>
				<%/if%>
			</div>
		</div>
		<div alog-alias="p-4" class="l-wrap s-mbm">
			<%block name="banner-frame"%><%/block%>
			<%block name="bottom-bar"%><%/block%>
		</div>
		<div alog-alias="p-6">
			<%block name="footer"%><%/block%>
			<%block name="facebook"%><%/block%>
		</div>
	<%**********[to be deleted] hotsite all start **********%>
	<%else%>
		<div alog-alias="p-3" class="l-wrap">
			<%block name="hot-site"%><%/block%>
		</div>
		<div alog-alias="p-4" class="l-wrap s-mbm">
			<div class="l-g cf">
				<%********** ltr-sideBeLeft layout **********%>
				<%if !empty($head.sideBeLeft)%>
					<div alog-alias="p-4-1" class="l-g1-4 s-mtm">
						<%block name="side-mod"%><%/block%>
					</div>
					<div alog-alias="p-4-2" class="l-g3-4">
						<%block name="sort-area"%><%/block%>
					</div>
				<%********** normal  **********%>
				<%else%>
					<div alog-alias="p-4-1" class="l-g3-4">
						<%block name="sort-area"%><%/block%>
					</div>
					<div alog-alias="p-4-2" class="l-g0 s-mtm">
						<%block name="side-mod"%><%/block%>
					</div>
				<%/if%>
			</div>
		</div>
		<div alog-alias="p-5" class="l-wrap s-mbm">
			<%block name="banner-frame"%><%/block%>
			<%block name="bottom-bar"%><%/block%>
		</div>
		<div alog-alias="p-7">
			<%block name="footer"%><%/block%>
			<%block name="facebook"%><%/block%>
		</div>
	<%/if%>
	<script>
	!function(D,src,t){var img=new Image,
		s=function(id){var div=D.createElement("div"),v=D.getElementById("g_fis_css"),b=D.body;if(v){div.style.display="none";div.appendChild(v);
		div.innerHTML="&nbsp;"+v.value;b.insertBefore(div,b.firstChild)}},c=function(){img=img||{};img=img.onload=img.onerror=null};f=setTimeout(function(){c();s()},t);img.onerror=c;img.onload=function(){c(),clearTimeout(f),s()};setTimeout(function(){img.src=src},0)}(document,"<%$body.hotSites.hotsite_bg%>",1e3);
	</script>
	<%block name="popupsite"%><%/block%>
		<%* prepend *%>
	<div alog-alias="p-0">
		<%block name="newer-guide"%><%/block%>
		<%block name="login-popup"%><%/block%>
	</div>
<%/block%>


