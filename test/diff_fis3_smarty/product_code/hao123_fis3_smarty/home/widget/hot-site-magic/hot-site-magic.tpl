<%*   声明对ltr/rtl的css依赖    *%>

<%if $head.dir=='ltr'%> 
	<%* inline 热区首屏样式 *%>
	<%style%>
		@import url('/widget/hot-site-magic/ltr/ltr.css?__inline');
	<%/style%>
	<%require name="home:widget/hot-site-magic/ltr/ltr.more.css"%> 
	<%if !empty($head.splitHotsite) %>
		<%* inline 热区首屏抽样样式 *%>
		<%style%>
			@import url('/widget/hot-site-magic/small-ltr/small-ltr.css?__inline');
		<%/style%>
	<%/if%>
<%else%> 
	<%style%>
		@import url('/widget/hot-site-magic/rtl/rtl.css?__inline');
	<%/style%>
	<%require name="home:widget/hot-site-magic/rtl/rtl.more.css"%>
	<%if !empty($head.splitHotsite) %>
		<%* inline 热区首屏抽样样式 *%>
		<%style%>
			@import url('/widget/hot-site-magic/small-rtl/small-rtl.css?__inline');
		<%/style%>
	<%/if%>
<%/if%>

<%assign var="gameArr" value=array()%>
<%assign var="normalArr" value=array()%>
<%assign var="videoArr" value=array()%>

<%foreach $body.hotSites.links as $item%>
  <%if $item.user == 'game'%>
    <%if array_push($gameArr,$item)%>
    <%/if%>
  <%elseif $item.user == 'video'%>
    <%if array_push($videoArr,$item)%>
    <%/if%>
  <%else%>
    <%if array_push($normalArr,$item)%>
    <%/if%>
  <%/if%>
<%/foreach%>

	<%if $head.dir=='ltr'%>
		<%widget name="home:widget/hot-site-magic/game-history/game-history.tpl"%>
	<%/if%>
	<div class="hotsite_b<%if !empty($head.sideBeLeft) && !empty($head.splitHotsite)%> s-mlm<%/if%>">
		<div class="hotsite_wrap<%if !empty($head.splitHotsite)%> hotsite_wrap__s<%/if%>" monkey="hotsites">
			<%if !empty($body.history.show)%>
				<div class="hotsite-tabs">
					<a href="javascript:void(0)" onclick="return false;" class="hotsite-tabs_btn cur" id="hotsiteTab" hidefocus="true"  log-mod="hotsites"><i class="i-hotsite"></i><%$body.history.hotTab%></a>
					<a href="javascript:void(0)" onclick="return false;" class="hotsite-tabs_btn" id="historyTab" hidefocus="true"  log-mod="historysites"><i class="i-history"></i><%$body.history.historyTab%>
						<%if empty($body.history.bubbleHidden)%>
							<i class="icon-new_red"></i>
						<%/if%>
					</a>
					<%if !empty($body.notepad) && empty($body.notepad.isHidden)%><%widget name="home:widget/notepad/notepad.tpl"%><%/if%>
				</div>
			<%/if%>
			<div class="hotsite-container favsite-count" id="hotsiteContainer">
				<div class="hs-show-normal hotsite hotsite-ele cur" id="hotsite" log-mod="hotsites">
					<div class="hs-game hs-each">
						<h3><%$body.hotSites.gameName%></h3>
						<%foreach $gameArr as $hotSiteCon%>
						  <%if $hotSiteCon@first%>
						      <ul class="hs-list cf">
						  <%elseif $hotSiteCon@iteration == 5%>
						      </ul><ul class="hs-list hs-hidden cf">
						  <%/if%>
						  <li>
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

							<a class="hotsite_link" href="<%$hotSiteCon.url%>"<%if !empty($hotSiteCon.style)%> style="<%$hotSiteCon.style%>"<%/if%>  log-index="<%if !empty($hotSiteCon.logIndex)%><%$hotSiteCon.logIndex%><%else%><%$hotSiteCon@iteration%><%/if%>" <%if !empty($hotSiteCon.offerid)%> log-oid="<%$hotSiteCon.offerid%>"<%/if%> >
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
											<a href="<%$link.url%>" data-sort="hotsitemore" data-val="<%$link.url%>" <%if !empty($link.offerid)%> log-oid="<%$link.offerid%>"<%/if%> >
												<img class="site-icon" src="/static/web/common/img/gut.gif" <%if !empty($link.iconUrl)%>customsrc="<%$link.iconUrl%>"<%/if%> onerror="this.src='<%$body.customSite.defaultIcon%>';this.onerror=null;"/>
												<%$link.name%>
											</a>
										</li>
									<%/foreach%>
								</ul>
							<%/if%>
		                    </span>
						  </li>
						  <%if $hotSiteCon@last%></ul><%/if%>
						<%/foreach%>
					</div>
					<div class="hs-normal hs-each">
						<h3><%$body.hotSites.normalName%></h3>
						<%foreach $normalArr as $hotSiteCon%>
						  <%if $hotSiteCon@first%>
						      <ul class="hs-list cf hs-hidden-left">
						    <%elseif $hotSiteCon@index is div by 4%>
						      <%if $hotSiteCon@index == 12%>
						        </ul><ul class="hs-list cf hs-hidden-right">
						      <%else%>
						        </ul><ul class="hs-list cf">
						      <%/if%>
						  <%/if%>
						  <li>
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

							<a class="hotsite_link" href="<%$hotSiteCon.url%>"<%if !empty($hotSiteCon.style)%> style="<%$hotSiteCon.style%>"<%/if%>  log-index="<%if !empty($hotSiteCon.logIndex)%><%$hotSiteCon.logIndex%><%else%><%$hotSiteCon@iteration + 8%><%/if%>" <%if !empty($hotSiteCon.offerid)%> log-oid="<%$hotSiteCon.offerid%>"<%/if%> >
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
											<a href="<%$link.url%>" data-sort="hotsitemore" data-val="<%$link.url%>" <%if !empty($link.offerid)%> log-oid="<%$link.offerid%>"<%/if%> >
												<img class="site-icon" src="/static/web/common/img/gut.gif" <%if !empty($link.iconUrl)%>customsrc="<%$link.iconUrl%>"<%/if%> onerror="this.src='<%$body.customSite.defaultIcon%>';this.onerror=null;"/>
												<%$link.name%>
											</a>
										</li>
									<%/foreach%>
								</ul>
							<%/if%>
		                    </span>
						  </li>
						  <%if $hotSiteCon@last%></ul><%/if%>
						<%/foreach%>
					</div>
					<div class="hs-video hs-each">
						<h3><%$body.hotSites.videoName%></h3>
						<%foreach $videoArr as $hotSiteCon%>
						  <%if $hotSiteCon@first%>
						      <ul class="hs-list cf hs-hidden">
						  <%elseif $hotSiteCon@iteration == 5%>
						      </ul><ul class="hs-list cf">
						  <%/if%>
						  <li>
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

							<a class="hotsite_link" href="<%$hotSiteCon.url%>"<%if !empty($hotSiteCon.style)%> style="<%$hotSiteCon.style%>"<%/if%>  log-index="<%if !empty($hotSiteCon.logIndex)%><%$hotSiteCon.logIndex%><%else%><%$hotSiteCon@iteration + 24%><%/if%>" <%if !empty($hotSiteCon.offerid)%> log-oid="<%$hotSiteCon.offerid%>"<%/if%> >
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
											<a href="<%$link.url%>" data-sort="hotsitemore" data-val="<%$link.url%>" <%if !empty($link.offerid)%> log-oid="<%$link.offerid%>"<%/if%> >
												<img class="site-icon" src="/static/web/common/img/gut.gif" <%if !empty($link.iconUrl)%>customsrc="<%$link.iconUrl%>"<%/if%> onerror="this.src='<%$body.customSite.defaultIcon%>';this.onerror=null;"/>
												<%$link.name%>
											</a>
										</li>
									<%/foreach%>
								</ul>
							<%/if%>
		                    </span>
						  </li>
						  <%if $hotSiteCon@last%></ul><%/if%>
						<%/foreach%>
					</div>
					<div class="hs-win">
						<h3 class="hs-game-tle"><%if !empty($body.hotSites.gameIcon)%><img src="<%$body.hotSites.gameIcon%>" /><%/if%><%$body.hotSites.gameName%></h3>
						<h3 class="hs-normal-tle"><%if !empty($body.hotSites.normalIcon)%><img src="<%$body.hotSites.normalIcon%>" /><%/if%><%$body.hotSites.normalName%></h3>
						<h3 class="hs-video-tle"><%if !empty($body.hotSites.videoIcon)%><img src="<%$body.hotSites.videoIcon%>" /><%/if%><%$body.hotSites.videoName%></h3>
					</div>
				</div>
				<%if !empty($body.history.show)%>
					<%widget name="home:widget/history/history.tpl"%>
				<%/if%>
			</div>
		</div>

	</div>
	<%script%>		
		require.async('home:widget/hot-site-magic/hot-site-magic-async.js');		
	<%/script%>
