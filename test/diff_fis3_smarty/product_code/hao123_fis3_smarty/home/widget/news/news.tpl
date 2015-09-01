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
<%if $head.dir=='ltr'%> <%require name="home:widget/news/ltr/ltr.css"%> <%else%> <%require name="home:widget/news/rtl/rtl.css"%> <%/if%>
		<div class="mod-news box-border" id="<%$mid|default:'sideNews'%>" monkey="sidenews" log-mod="<%$mod_id|default:'news'%>">
			<dl class="mod-side cf">
				<dt class="news-tab unselect newsTypeNav" <%if !empty($body.News.hideTab)%>style="display:none"<%/if%>></dt>
				<dd class="scroll">
					<div class="scroll-container"<%if !empty($head.splitHotsite) && !$sortIndex%> style="height:353px;"<%/if%>>
						<div class="scroll-pane newsScrollPane">
							<%$VAR_cover_group = explode(",",$body.News.coverType)%>
							<%foreach $VAR_cover_group as $value%>
								<div class="news-content-item content-type-<%$value%>">
									<div class="news-slide unselect newsCoverNav<%$value%>"></div>
								</div>
							<%/foreach%>
						</div>
					</div>
					<div class="bottom-mask"></div>
				</dd>
			</dl>
			<a class="charts_more newsMoreLink" data-sort="more" href="<%$body.<%$modname%>.moreUrl%>"><%$head.moreText|default:"MORE"%><i class="arrow_r">›</i></a>

		</div>

		<%script%>
			conf.sideNews = {
				wide: "<%$body.News.wide%>",
				id:"<%$mid|default:'sideNews'%>",
				modId:"<%$mod_id|default:'news'%>",
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
				hotWords: <%json_encode($body.News.hotWords|default:[])%>,
				requestUrlPrefix: window.conf.apiUrlPrefix.length ? conf.apiUrlPrefix : "http://api.ghk.hao123.com/api.php",
				country: window.conf.country,
				defaultType: '<%$body.News.currentType|default:1%>',   //TODO cms配置
				currentType: '<%$body.News.currentType|default:1%>',
				coverType: <%json_encode($VAR_cover_group)%>,
				coverTipWord:'<%$body.News.coverTipWord|default:-1%>',
				coverTipColor:'<%$body.News.coverTipColor|default:-1%>',
				showDesc: <%$body.News.showDesc|default:0%>,
				labelSeeLater: '<%$body.News.newsLabelToEnd|default:'30 minutes later'%>'<%* 文案：30分钟之后再来  *%>
			};
			require.async("home:widget/news/news-async.js",function(news){
				news();
			});

		<%/script%>
