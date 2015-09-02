var $ = require('common:widget/ui/jquery/jquery.js');
var hex_md5 = require('common:widget/ui/md5/md5.js');
var cycletabs = require("common:widget/ui/cycletabs/cycletabs.js");
var helper = require( 'common:widget/ui/helper/helper.js' );
var sideCharts = function(item){
	var menu = $(".charts_menu"),
		menuItem = menu.find('a'),
		menuLength = menuItem.length,
		defaultMenuItem = menuItem.eq(0),
		contentItem = $(".charts_content"),
		ListWrapper = $(".mod-charts .chartslist"),
		/*topArrow = $(".mod-charts .top-arrow"),
		bottomArrow = $(".mod-charts .bottom-arrow"),*/
		config = conf.charts,
		scrollbar = [],
		getAjaxCharts = function(obj){
			var menutype = obj.attr("menutype"),
				subtype = obj.attr("subtype"),
				numPerRequest = obj.attr("rqnum"),
				index = menuItem.index(obj),
				curContent = contentItem.eq(index),
				curListWrapper = ListWrapper.eq(index),
				ajaxSucceed = false;

			menuItem.removeClass("cur");
			obj.addClass("cur");
			contentItem.hide();
			curContent.show();
			if(!curContent.find("li").length){
				var params = "?app="+menutype+"&act=contents&country="+conf.country+(subtype?"&type="+subtype:"")+"&num="+numPerRequest;
				$.ajax({
					/*url: "/static/web/base/js/charts.json",*/
				    //url: conf.apiUrlPrefix+"?app=video&act=contents&country="+conf.country+"&num="+numPerRequest,
				    url: conf.apiUrlPrefix + params,
				    dataType: "jsonp",
				    jsonp: "jsonp",
				    jsonpCallback: "ghao123_" + hex_md5(params,16),
	    			cache: false,
				    error: function(XMLHttpRequest, textStatus, errorThrown){
				   		//console.log(textStatus+"-"+errorThrown);
				   		// curContent.find(".charts_error").show();
				    },
				    success: function(data) {//此处会用到start参数
						if(data.content && data.content.data){
							curContent.find(".charts_error").hide();
							var type = parseInt(data.message.showType),
								data = data.content.data,
								length = data.length,
								html = "",
								curList = curListWrapper.find("ul"),
								dataSort = "side"+menutype+(subtype?"["+subtype+"]":""),
								offerid="";
							for(var i=0;i<length;i++){
							//for(var i in data){
								offerid = data[i].offerid?data[i].offerid:offerid;
								if(menutype == "music"){
									var rev_music,
										rev_artist;
									/*
									if($('html').attr("dir") == "rtl"){
										if(/^[\w\s()]*$/g.test(data[i].music))
											rev_music = 1;
										if(/^[\w\s()]*$/g.test(data[i].artist))
											rev_artist = 1;
									}
									*/

									if(type == 1){
										html += "<li class='charts-item'><i class='charts-order"+(i+1>3?" charts-order_grey":"")+"'>"+(i+1)+"</i><a log-oid='"+offerid+"' class='charts-pic' href='"+(data[i].album_link?data[i].album_link:data[i].music_link)+"' data-sort='"+dataSort+"'><img original-src='"+data[i].artist_pic+"' src='/static/web/common/img/news_default.png'></a><a log-oid='"+offerid+"'  class='charts-song' href='"+data[i].music_link+"' title='"+data[i].music+"' data-sort='"+dataSort+"'"+(rev_music?"dir='ltr'":"")+">"+data[i].music+"</a><br/><a log-oid='"+offerid+"' class='charts-singer' href='"+(data[i].artist_link?data[i].artist_link:data[i].music_link)+"' data-sort='"+dataSort+"'"+(rev_artist?"dir='ltr'":"")+">"+data[i].artist+"</a></li>";

									}else{
										html += "<li class='charts-item'><i class='charts-order"+(i+1>3?" charts-order_grey":"")+"'>"+(i+1)+"</i><a log-oid='"+offerid+"'  class='charts-song charts-song_l' href='"+data[i].music_link+"' title='"+data[i].music+"' data-sort='"+dataSort+"'"+(rev_music?"dir='ltr'":"")+">"+data[i].music+"</a><br/><a log-oid='"+offerid+"' class='charts-singer charts-singer_l' href='"+(data[i].artist_link?data[i].artist_link:data[i].music_link)+"' data-sort='"+dataSort+"'"+(rev_artist?"dir='ltr'":"")+">"+data[i].artist+"</a></li>";
									}

								}else{
									var rev_title;
									if(conf.dir == "rtl"){
										if(/^[\w\s()]*$/g.test(data[i].title))
											rev_title = 1;
									}
									if(i%2)
										html += "<li class='charts-imgitem s-mhn'>";
									else
										html += "<li class='charts-imgitem'>";
									html += "<a href='"+data[i].link+"' data-sort='"+dataSort+"' title='"+data[i].title+"' log-oid='"+offerid+"'><img original-src='"+data[i].img+"' src='/static/web/common/img/news_default.png'><span class='charts-mask'><i class='ellipsis'>...</i><i class='icon'></i></span><span class='charts-name'"+(rev_title?"dir='ltr'":"")+">"+data[i].title+"</span></a></li>";
								}
								offerid = "";
							}
							/*if(data.moreLink){
								curList.next('.charts_more').attr("href") = data.moreLink;
							}*/
							curList.append(html);
							require.async("common:widget/ui/scrollable/scrollable.js", function(){
								scrollbar[index] = curList.scrollable({
									autoHide: false,
									onScroll: function(){ // lazyload images
										var listItem = curListWrapper.find("img");
										listItem.each(function(){
											var $this = $(this);
											if($this.position().top - 30 <= curListWrapper.outerHeight()){
												$this.attr("src",$this.attr("original-src"));
											}
										});
									}
								});
							});
							//load the first 6 images
							curList.find("img:lt(6)").each(function(){
								var $this = $(this);
								$this.attr("src",$this.attr("original-src"));
							});
							/*if(curList.height() > curListWrapper.height()){
								curListWrapper.css("overflow-y","auto");
								topArrow.eq(index).show();
								bottomArrow.eq(index).show();
								//curContent.find(".scroll-arrow").show();
							}*/
						}
				    }
				});
				if(!ajaxSucceed) curContent.find(".charts_error").show();
			}else{
				scrollToTop(index);
			}

		},
		scrollToTop = function(index){
			scrollbar[index].goTo({y:0});
			/*obj.scrollTop(0);
			topArrow.addClass("disabled");
			bottomArrow.removeClass("disabled");*/
		},
		getItemObj = function(type){
			type = type + '-charts';
			// return menuItem.filter("[menutype='" + type + "']").parent();
			//var a = menuItem.parent().filter("[log-mod='" + type+ "']").find('a');
			return menuItem.parent().filter("[log-mod='" + type+ "']").find('a');
		};

    //当锚点定位初始化时要传出item值
	if(item){
		defaultMenuItem = getItemObj(item);
	}
	//init
	function initContent( elem ){
		var type = elem.attr( "type" );
		if( conf.charts[type+"Data"] ){
			getConfigedCharts( elem, conf.charts[type+"Data"] );
		}else{
			getAjaxCharts(elem);
		}
	}
	function getConfigedCharts( elem ){
		var slider = new cycletabs.NavUI();
		var type = elem.attr( "type" );
		var data = conf.charts[type+"Data"];
		var config = conf.charts[type+"Config"];
		var index = menuItem.index(elem);
		var curContent = contentItem.eq(index);
		var curListWrapper = ListWrapper.eq(index);
		var containerHtml = '<div class="container"></div>';
		var listHtml = '<a href="#{link}">'
							+ '<img src="#{imgSrc}" title="#{tips}" alt="#{tips}" />'
							+ '#{tipsHtml}'
							+ '</a>';
		var htmlData = [];
		menuItem.removeClass("cur");
		elem.addClass("cur");
		contentItem.hide();
		curContent.show();
		curContent.find(".charts_error").hide();
		curListWrapper.html( containerHtml );
		for( var i=0; i<data.length; i++ ){
			data[i].tipsHtml = data[i].tips ? '<span class="layer"></span><p>' + data[i].tips + '</p>' : "";

			htmlData.push({
				'content': helper.replaceTpl(listHtml, data[i]),
				'id': i+1
			});
		}
		// console.log(htmlData);
		// console.log(htmlData);
		var options = {
			offset: 0,
			navSize: 1,
			itemSize: 220,
			autoScroll: config.autoScroll,
			autoScrollDirection: config.slideDir,
			autoDuration: config.autoDuration,
			scrollDuration: config.scrollDuration,
			quickSwitch: false,
			containerId: curContent.find(".container"),
			data: htmlData,
			dir: conf.dir,
			defaultId: 1
		};
		slider.init( options );
		if( data.length < 2 ){
			curContent.find( ".ui-nav .ctrl" ).hide();
		}
	}
	initContent( defaultMenuItem );
	if(config.isLoop){
		/*loop switch tab*/
		var tabIndex = 0,
			loop = setInterval(function(){
				initContent(menuItem.eq(tabIndex));
				tabIndex= ++tabIndex>=menuLength ? 0 : tabIndex;
			},config.loopSpeed);
		contentItem.hover(
			function(){
				clearInterval(loop);
			},
			function(){
				loop = setInterval(function(){
					initContent(menuItem.eq(tabIndex));
					tabIndex= ++tabIndex>=menuLength ? 0 : tabIndex;
				},config.loopSpeed);
			}
		);
	}/*else{
		getAjaxCharts(defaultMenuItem);
	}*/
	/*bottomArrow.click(function(){
		var list = $(".mod-charts .chartslist:visible");
		list.scrollTop(list.scrollTop()+30);
	});
	topArrow.click(function(){
		var list = $(".mod-charts .chartslist:visible");
		list.scrollTop(list.scrollTop()-30);
	});

	ListWrapper.scroll(function(){
		var list = $(".mod-charts .chartslist:visible"),
			listItem = list.find("img");
		list.scrollTop() == 0 ?
			topArrow.addClass("disabled"):
			topArrow.removeClass("disabled");
		(list.scrollTop() + list.height() >= list.children().height()) ?
			bottomArrow.addClass("disabled"):
			bottomArrow.removeClass("disabled");
		listItem.each(function(){
			var $this = $(this);
				//thisImg = $this.find("img");
			if($this.position().top - 30 <= list.outerHeight()){
				//console.log($this.index()+":"+$this.position().top+":"+list.outerHeight());
				$this.attr("src",$this.attr("original-src"));
			}
		});

	});*/

	//bind events
	menuItem.click(function(e){
		initContent($(this));
		e.preventDefault();
	});

	//锚点
	$(window).on("locate.charts" , function(e , item){
		var obj = getItemObj(item);
		initContent(obj);
	});

	$(".charts_error").click(function(e){
		initContent(menuItem.eq(contentItem.index($(e.target).parent())));
		e.preventDefault();
	});
	$(".charts-mode2 .charts-imgitem a").live("mouseenter",function(){
		var thisObj = $(this),
			name = thisObj.children(".charts-name"),
			ellipsis = thisObj.find(".ellipsis"),
			outerHeight = thisObj.height(),
			innerHeight = name.height();
			//lineHeight = parseInt(name.css("line-height"));

		if(innerHeight > outerHeight){
			ellipsis.show();
			//name.height(lineHeight*Math.floor(outerHeight/lineHeight));
		}
	}).live("mouseleave",function(){
		var thisObj = $(this),
			//name = thisObj.children(".charts-name"),
			ellipsis = thisObj.find(".ellipsis");

		if(ellipsis.is(":visible")){
			ellipsis.hide();
			//name.height('auto');
		}
	});

};
module.exports = sideCharts;
