	/*新闻模块*/
	var $ = require('common:widget/ui/jquery/jquery.js');
	var modNews = require('home:widget/news/mod-news.js');
	var cycletabs = require('common:widget/ui/cycletabs/cycletabs.js');

	var news = function(){
				var newsConfig = modNews.newsConfig = conf.sideNews;
				var newsStateList = [] ;
				var tab = new cycletabs.NavUI();
				// var scrollObj = new modNews.ScrollPanelUI(newsConfig);
				var _sideNews = "#"+conf.sideNews.id;
				var sideNews = $(_sideNews);
				var modId = conf.sideNews.modId;

				var scrollObj = $(".newsScrollPane",sideNews);

				var bottomMask = sideNews.find('.bottom-mask');
				var scrollbar;

				require.async("common:widget/ui/scrollable/scrollable.js", function (dropdownlist) {
					scrollbar = scrollObj.scrollable({
						onWheel: function(){
							// log -> 滚动条使用滚轮滚动统计
							modNews.log(modId,'scroll', 'mousewheel', 2000);   //delay 2000ms
						},
						onScroll: function(){
							var scrollList = sideNews.find(".scroll-list:visible");
							// ever scroll
							// modNews.log('scroll', 'newsScroll', -1);   //never again

							// 触发图片的lazyload
							$(".scroll-container",".mod-news").trigger("load-news-image");
							// scrollToBottom
							if(this.state.y == -this.state._y){
								bottomMask.css('visibility','hidden');
								// log -> 滚动条滚动到底统计
								modNews.log(modId,'scroll', 'scrollToBottom', 2000);   //delay 1000ms
							}else{
								bottomMask.css('visibility','visible');
							}
							// scrollToTop
							if(this.state.y == 0){
							}
						},
						onEndPress: function(){
							// log -> 滚动条拖动和点击统计
							modNews.log(modId,'scroll', 'scrollbarDragClick');
						},
						onEndDrag: function(){
							// log -> 滚动条拖动和点击统计
							modNews.log(modId,'scroll', 'scrollbarDragClick');
						}
					});

				});


				//响应TAB切换事件
				$(tab).on('e_change',function(e, data){
					//console.log(data.itemObj.id);
					var id = data.itemObj.id;
					//内容回到第一屏
					$(".scroll-pane",sideNews).scrollTop(0);
					$('.scroll .news-content-item',sideNews).removeClass('news-content-item-current');
					newsConfig.currentType = id;    //update

					//若tab对应的内容还没有载入，则初始化它 TODO缓存一些DOM结点
					if(!newsStateList[id]){
						var newsState = new modNews.NewsViewUI({$ID: '',type:id, label: data.itemObj.content, total:60, count:-1, pageSize:60, data:[],sideNews:sideNews,
							NavUIConfig:{
								offset: 0,
								navSize: 1,
								itemSize: conf.flowLayout ? 296 : 236,
								autoScroll: true,
								autoScrollDirection: newsConfig.dir == 'ltr'?'forward':'backward', //forward
								autoDuration: 5000,
								scrollDuration: 500,
								containerId: _sideNews+' .newsCoverNav'+id,
								idKey: 'id', //用来指定返回的关键key TODO
								defaultId:1,
								dir: newsConfig.dir  //描述模块的工作方向
							}
						});

						// if(~$.trim(newsConfig.coverType).indexOf(newsState.type)){
						if(~$.inArray(newsState.type,newsConfig.coverType)){
							$(newsState).on('e_append_data',function(){
								newsState.renderCoverNews();
								if(id == newsConfig.currentType){   //以防切换成别的了
									$('.scroll .content-type-'+id,sideNews).addClass('news-content-item-current');
									scrollObj.$panel = $('.scroll .content-type-'+id,sideNews);   //update
									scrollbar && scrollbar.goTo({y:0});
								}
							});
							newsState.fetch();
						} else {
							$(newsState).on('e_append_data',function(){
								newsState.renderNormalNews();
								if(id == newsConfig.currentType){   //以防切换成别的了
									$('.scroll .content-type-'+id,sideNews).addClass('news-content-item-current');
									scrollObj.$panel = $('.scroll .content-type-'+id,sideNews);   //update
									scrollbar && scrollbar.goTo({y:0});
								}
							});
							newsState.fetch();
						}

						newsStateList[id] = newsState;
					} else {
						$('.scroll .content-type-'+id,sideNews).addClass('news-content-item-current');
						scrollObj.$panel = $('.scroll .content-type-'+id,sideNews);   //update
						scrollbar && scrollbar.goTo({y:0});
					}
					newsStateList[id].renderMoreLinks(id);
					//非初始化
					/*if(!data.isInit){
						//console.log("日各类别被选择次数&人均选择分类项数(newsTypeChosen):"+typeString);
						modNews.log('click','newsTypeChosen',100, {newsType:id});
					}*/

				});
				//初始化TAB控件
				tab.init({
					containerId: _sideNews+' .newsTypeNav',
					offset: 1,
					data: newsConfig.newsTypeList,
					defaultId: newsConfig.currentType,  //1
					navSize: conf.flowLayout ? 4 : 3,
					itemSize: conf.flowLayout ? 67 : 69,
					autoScroll: false,
					dir: newsConfig.dir,
					idKey: 'id' //用来指定返回的关键key
				});

				sideNews.on('click','.news-slide .ctrl',function(e){
					modNews.log(modId,'click','newsImgSwitch',null,{"ac":"b"});
				// log ->新闻类别tab点击统计
				}).on('click','.news-tab .nav-item',function(){
					modNews.log(modId,'click','newsTypeChosen',100,{"ac":"b"});
				// log ->新闻类别切换箭头点击统计
				}).on('click','.news-tab .ctrl',function(){
					modNews.log(modId,'click','newsTypeSwitch',100,{"ac":"b"});
				}).on('click','.news-item_imgtxt img',function(){
					modNews.log(modId,'click','newsItemImgTxt-img',null);
				}).on('click','.news-item_imgtxt .title',function(){
					modNews.log(modId,'click','newsItemImgTxt-txt',null);
				}).on('click','.word-item',function(){
					modNews.log(modId,'click',$(this).text(),null,{"position":"newsHotWord"});
				});
	};
	module.exports = news;

