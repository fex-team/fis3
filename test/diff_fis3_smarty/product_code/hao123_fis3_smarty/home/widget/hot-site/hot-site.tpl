<%*   声明对ltr/rtl的css依赖    *%>

<%if $head.dir=='ltr'%>
	<%* inline 热区首屏样式 *%>
	<%style%>
		@import url('/widget/hot-site/ltr/ltr.css?__inline');
	<%/style%>
	<%require name="home:widget/hot-site/ltr/ltr.more.css"%>
	<%if !empty($head.splitHotsite) %>
		<%* inline 热区首屏抽样样式 *%>
		<%style%>
			@import url('/widget/hot-site/small-ltr/small-ltr.css?__inline');
		<%/style%>
	<%/if%>
	<%if !empty($head.flowLayout) %>
		<%* inline 热区首屏两种布局样式 *%>
		<%style%>
			@import url('/widget/hot-site/flow/ltr/ltr.flow.css?__inline');
		<%/style%>
	<%/if%>
<%else%>
	<%style%>
		@import url('/widget/hot-site/rtl/rtl.css?__inline');
	<%/style%>
	<%require name="home:widget/hot-site/rtl/rtl.more.css"%>
	<%if !empty($head.splitHotsite) %>
		<%* inline 热区首屏抽样样式 *%>
		<%style%>
			@import url('/widget/hot-site/small-rtl/small-rtl.css?__inline');
		<%/style%>
	<%/if%>
	<%if !empty($head.flowLayout) %>
		<%* inline 热区首屏两种布局样式 *%>
		<%style%>
			@import url('/widget/hot-site/flow/rtl/rtl.flow.css?__inline');
		<%/style%>
	<%/if%>
<%/if%>


	<%if $head.dir=='ltr'%>
		<%widget name="home:widget/hot-site/game-history/game-history.tpl"%>
	<%/if%>
	<div class="hotsite_b<%if !empty($head.sideBeLeft) && !empty($head.splitHotsite)%> s-mlm<%/if%>">
		<div class="hotsite_wrap<%if !empty($head.splitHotsite)%> hotsite_wrap__s<%/if%>" monkey="hotsites">
			<%if !empty($body.history.show)%>
				<div class="hotsite-tabs">
					<a href="javascript:void(0)" onclick="return false;" class="hotsite-tabs_btn cur" id="hotsiteTab" hidefocus="true"  log-mod="hotsites"><i class="i-hotsite"></i><%$body.history.hotTab%></a>
					<%if !empty($body.hotSitesNewtab)%>
						<a href="javascript:void(0)" onclick="return false;" class="hotsite-tabs_btn" id="hotsiteNewTab" hidefocus="true"  log-mod="hotsite-newtab"><i class="i-hotsite-newtab"></i><%$body.hotSitesNewtab.name%>
							<%if empty($body.hotSitesNewtab.bubbleHidden)%>
								<i class="icon-new_red"></i>
							<%/if%>
						</a>
					<%/if%>
					<a href="javascript:void(0)" onclick="return false;" class="hotsite-tabs_btn" id="historyTab" hidefocus="true"  log-mod="historysites"><i class="i-history"></i><%$body.history.historyTab%>
						<%if empty($body.history.bubbleHidden)%>
							<i class="icon-new_red"></i>
						<%/if%>
					</a>

					<%if !empty($body.notepad) && empty($body.notepad.isHidden)%><%widget name="home:widget/notepad/notepad.tpl"%><%/if%>
				</div>
			<%/if%>
			<div class="hotsite-container favsite-count" id="hotsiteContainer">
				<div class="hotsite hotsite-ele cur" id="hotsite" log-mod="hotsites">
					<%foreach $body.hotSites.links as $hotSiteCon%>
						<span<%if !empty($hotSiteCon.class)%> class="<%$hotSiteCon.class%>"<%/if%><%if isset($hotSiteCon.tn)%> data-tn="<%$hotSiteCon.tn%>"<%/if%><%if isset($hotSiteCon.position)%> data-pos="<%$hotSiteCon.position%>"<%/if%>>
		                    	<%if isset($hotSiteCon.search_url)%>
				                    <span class="search-form">
		                     		<form action="<%$hotSiteCon.search_url%>" <%if isset($hotSiteCon.customParam)%>customparam="<%$hotSiteCon.customParam%>"<%/if%>  method="get">
				                        <input type="text" name="<%$hotSiteCon.keyword%>" class="search-form-input-text" autocomplete="off" />
				                        <%if isset($hotSiteCon.tips)%>
					                        <span class="tips"><%$hotSiteCon.tips%></span>
				                        <%/if%>
				                        <%if isset($hotSiteCon.otherKeys)%>
					                        <%foreach  $hotSiteCon.otherKeys as $key => $otherKeys%>
						                        <input type="hidden" name="<%$key%>" value="<%$otherKeys%>" />
					                        <%/foreach%>
				                        <%/if%>
				                        <input type="submit" value="" class="search-form-input-submit" />
			                        </form>
		                     	</span>
			                    <%/if%>

							<a class="hotsite_link" href="<%$hotSiteCon.url%>"<%if !empty($hotSiteCon.style)%> style="<%$hotSiteCon.style%>"<%/if%>  log-index="<%$hotSiteCon@iteration%>" <%if !empty($hotSiteCon.offerid)%> log-oid="<%$hotSiteCon.offerid%>"<%/if%><%if $hotSiteCon.isad=="1"%> log-isad="1"<%/if%>  >
								<i class="i-hot-sprites <%$hotSiteCon.ico|default:''%>"<%if !empty($hotSiteCon.ico_url)%> style="background:url(<%$hotSiteCon.ico_url%>) no-repeat left top"<%/if%>></i>
							        <span class="span-hot-name"><%$hotSiteCon.name%>
								        <%if !empty($hotSiteCon.morelinks)%>
									        <i class="triangle more_trigger"></i>
								        <%/if%>
		                            </span>
							</a>
							<%if !empty($hotSiteCon.morelinks)%>
								<ul class="more_links">
									<%foreach $hotSiteCon.morelinks as $link%>
										<li>
											<a href="<%$link.url%>" data-sort="hotsitemore" data-val="<%$link.url%>" <%if !empty($link.offerid)%> log-oid="<%$link.offerid%>"<%/if%><%if $link.isad=="1"%> log-isad="1"<%/if%> >
												<img class="site-icon" src="/static/web/common/img/gut.gif" <%if !empty($link.iconUrl)%>customsrc="<%$link.iconUrl%>"<%/if%> onerror="this.src='<%$body.customSite.defaultIcon%>';this.onerror=null;"/>
												<%$link.name%>
											</a>
										</li>
									<%/foreach%>
								</ul>
							<%/if%>
		                    </span>
					<%/foreach%>
				</div>
				<%if !empty($body.history.show)%>
					<%widget name="home:widget/history/history.tpl"%>
				<%/if%>
			</div>
			<%if !empty($body.hotSitesNewtab)%>
				<%widget name="home:widget/hotsite-newtab/hotsite-newtab.tpl"%>
			<%/if%>
		</div>

	</div>
	<%script%>
		<%if !empty($body.foolDay)%>conf.foolDay = <%json_encode($body.foolDay)%>;<%/if%>
		require.async('home:widget/hot-site/hot-site-async.js');
	<%/script%>
