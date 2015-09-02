<%*新闻模块*%>
<style>
    .side-mod-preload-news{
        border:1px solid #e3e5e6;
        border-bottom:1px solid #d7d8d9;
        background: #f5f7f7;
        min-height: 331px;
    }
    .side-mod-preload-news > *{
        visibility: hidden;
    }
</style>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="lv2:widget/news/ltr/ltr.css"%> <%else%> <%require name="lv2:widget/news/rtl/rtl.css"%> <%/if%>
		<div class="mod-news box-border" id="<%$mid|default:'partnerNews'%>" monkey="partnernews" log-mod="<%$mod_id|default:'partner-news'%>">
		    <%if $body.News.self.isHidden === "0"%>
		        <%if !empty($body.News.self.url)%>
		            <a class="news-self" href="<%$body.News.self.url%>"><%if !empty($body.News.self.img)%><img src="<%$body.News.self.img%>" /><%/if%><%$body.News.self.content%></a>
		        <%else%>
		            <div class="news-self"><%if !empty($body.News.self.img)%><img src="<%$body.News.self.img%>" /><%/if%><%$body.News.self.content%></div>
		        <%/if%>
		    <%/if%>
		    <%if $body.News.partner.isHidden === "0"%>
		        <%if !empty($body.News.partner.url)%>
		            <a class="news-partner"  href="<%$body.News.partner.url%>"><%if !empty($body.News.partner.img)%><img src="<%$body.News.partner.img%>" /><%/if%><%$body.News.partner.content%></a>
		        <%else%>
		            <div class="news-partner"><%if !empty($body.News.partner.img)%><img src="<%$body.News.partner.img%>" /><%/if%><%$body.News.partner.content%></div>
		        <%/if%>
		    <%/if%>
			<dl class="mod-side cf">
				<dt class="news-tab unselect newsTypeNav"></dt>
				<dd class="scroll">
					<div class="scroll-container"<%if !empty($head.splitHotsite) && !$sortIndex%> style="height:353px;"<%/if%>>
						<div class="scroll-pane newsScrollPane">
							<%$VAR_cover_group = explode(",",$body.News.coverType)%>
							<%foreach $VAR_cover_group as $value%>
								<div class="news-content-item content-type-<%$value%>">
									<div class="news-slide unselect newsCoverNav<%$value%>"></div>
								</div>
							<%/foreach%>
							<!-- <a class="scroll-arrow top-arrow disabled" id="topArrow" href="#"></a>
							<a class="scroll-arrow bottom-arrow" id="bottomArrow" href="#"></a> -->
						</div>
					</div>
					<!-- <a class="scroll-arrow bottom-arrow" style="display:block" href="#"></a> -->
					<div class="bottom-mask"></div>
				</dd>
			</dl>
			<a class="charts_more newsMoreLink" data-sort="more" style="display: none;" href="<%$body.<%$modname%>.moreUrl%>"><%$head.moreText|default:"MORE"%><i class="arrow_r">›</i></a>

		</div>

		<%script%>
			conf.sideNews = {
				id:"<%$mid|default:'partnerNews'%>",
				modId:"<%$mod_id|default:'partner-news'%>",
				dir: "<%$head.dir%>",
				newsModlines: "<%$body.News.newsModlines%>",
				newsRequest: "<%$body.News.newsRequest%>",
				newsTotal: "<%$body.News.newsTotal%>",
				moreText: "<%$head.moreText%>",
				moreUrl: "<%$body.News.moreUrl%>",
				newsTypeList:[
					<%foreach $body.News.news_sort as $value%>
					{
						className: '<%$value.class%>',
						id: '<%$value.type|default:$value@iteration%>',
						content: '<%$value.sort%>',
						powerby: '<%$value.powerby%>',
						moreText: '<%$value.moreText%>',
						moreUrl: '<%$value.moreUrl%>'
					}<%if !$value@last%>,<%/if%>
					<%/foreach%>
				],
				requestUrlPrefix: "http://api.gus.hao123.com/api.php",
				country: window.conf.country,
				defaultType: '1',   //TODO cms配置
				currentType: '1',
				coverType: '<%$body.News.coverType|default:""%>',
				coverTipWord:'<%$body.News.coverTipWord|default:-1%>',
				coverTipColor:'<%$body.News.coverTipColor|default:-1%>',
				showDesc: <%$body.News.showDesc|default:0%>,
				labelSeeLater: '<%$body.News.newsLabelToEnd|default:'30 minutes later'%>'<%* 文案：30分钟之后再来  *%>
			};
			require.async("lv2:widget/news/news-async.js",function(news){
				news();
			});

		<%/script%>
