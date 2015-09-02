

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/hot-site-news/ltr/ltr.css"%> <%else%> <%require name="home:widget/hot-site-news/rtl/rtl.css"%> <%/if%>



	<%if $head.dir=='ltr'%>
		<%widget name="home:widget/hot-site/game-history/game-history.tpl"%>
	<%/if%>
	<div class="hotsite_b">
		<div class="hotsite_wrap" monkey="hotsites" log-mod="hotsites">
			<%if !empty($body.history.show)%>
				<div class="hotsite-tabs">
					<a href="javascript:void(0)" class="hotsite-tabs_btn cur" id="hotsiteTab" hidefocus="true"><i class="i-hotsite"></i><%$body.history.hotTab%></a>
					<a href="javascript:void(0)" class="hotsite-tabs_btn" id="historyTab" hidefocus="true"><i class="i-history"></i><%$body.history.historyTab%><i class="icon-new_red"></i></a>
				</div>
			<%/if%>
			<div class="hotsite-container" id="hotsiteContainer">
				
				<div id="hotsite" class="hotsite-ele cur">
					<%widget name="home:widget/news/news.tpl" modname="News"%>					
					<div class="hotsite favsite-count">

						<%foreach $body.hotSites.links as $hotSiteCon%>
							<span class="hotsite-item<%if !empty($hotSiteCon.class)%> <%$hotSiteCon.class%><%/if%>"<%if isset($hotSiteCon.tn)%> data-tn="<%$hotSiteCon.tn%>"<%/if%><%if isset($hotSiteCon.position)%> data-pos="<%$hotSiteCon.position%>"<%/if%>>
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

								<a class="hotsite_link" href="<%$hotSiteCon.url%>" target="_blank"<%if !empty($hotSiteCon.style)%> style="<%$hotSiteCon.style%>"<%/if%>  log-index="<%$hotSiteCon@iteration%>" <%if !empty($hotSiteCon.offerid)%> log-oid="<%$hotSiteCon.offerid%>"<%/if%> >
									<i class="i-hot-sprites <%$hotSiteCon.ico|default:''%>"<%if !empty($hotSiteCon.ico_url)%> style="background:url(<%$hotSiteCon.ico_url%>) no-repeat left top"<%/if%>></i>
								        <span class="span-hot-name"><%$hotSiteCon.name%>
									        <%if isset($hotSiteCon.morelinks)%>
										        <i class="triangle more_trigger"></i>
									        <%/if%>
			                            </span>
								</a>
								<%if isset($hotSiteCon.morelinks)%>
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
						<%/foreach%>					

					</div>
									
				</div>
				<%if !empty($body.history.show)%>
					<%widget name="home:widget/history/history.tpl"%>
				<%/if%>
			</div>
		</div>
		<div class="hotsite-custom">
			<div class="hotsite-custom_bar" id="custom_bar" >
				<a href="javascript:void(0)" hidefocus="true" tabindex="-1" onclick="return false;"></a>
			</div>
			<div class="hotsite-custom_list cf" id="custom_list">
                <span class="custom_item add-btn" id="add-btn">
                 	<i class="add-btn-ico"></i>
                 	<span class="add-btn-txt"><%$body.customSite.addbtnTitle%></span>
                </span>
				<form action="" id="customsite-con" class="box-prompt">
					<div class="box-prompt-inner">
						<label for="website-address"><%$body.customSite.webAddress%></label>
						<input type="text" id="website-address"/>
						<label for="website-name"><%$body.customSite.webName%></label>
						<input type="text" id="website-name"/>
						<div class="btn-con">
							<span class="mod-btn_normal" id="del-btn-ok"><%$body.customSite.btnOk%></span>
							<span class="mod-btn_cancel" id="del-btn-cancel"><%$body.customSite.btnCan%></span>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>	
	<%script%>
		<%*自定义网站*%>
		conf.customSite={
			tipContent:"<%$body.customSite.tipContent%>",
			btnOk:"<%$body.customSite.btnOk%>",
			btnCan:"<%$body.customSite.btnCan%>",
			defaultIcon:"<%$body.customSite.defaultIcon%>",
			suggestUrl:"<%$body.customSite.suggestUrl%>"
		};
		
		require.async('home:widget/hot-site-news/hot-site.js');
	<%/script%>
