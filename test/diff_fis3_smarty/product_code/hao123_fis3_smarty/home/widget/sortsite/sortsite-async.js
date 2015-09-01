// for the title's effects of sort sites area
var $ = require('common:widget/ui/jquery/jquery.js'),
	UT = require('common:widget/ui/ut/ut.js'),
	helper = require("common:widget/ui/helper/helper.js"),
	hex_md5 = require('common:widget/ui/md5/md5.js');

$(".box-sort").on( "mouseenter", "dt", function(){
        $(this).addClass("hover");
    })
    .on( "mouseleave", "dt", function(){
        $(this).removeClass("hover click");
    })
    .on( "mousedown mouseup", "dt", function(){
        $(this).toggleClass("click");
    });

!function(){
	//api数据介入
	conf.sortsite.apiIntervention.length && getApiParam();

	function getApiParam(){

		var	category = [],
			params = "?act=contents&app=gensimple&country="+conf.country+"&category=#{category}&num=#{num}";

		$("dl.sortsite dt").each(function(i){
			var $this = $(this);
			$this.attr("apiCategory") && category.push({"apiCategory":$this.attr("apiCategory"),"num":$this.attr("apiNum"),"index":i});
			
		});	
		
		for (var i = 0; i < category.length; i++) {
			var param = ""; 
		
			param = helper.replaceTpl(params,{"category":category[i].apiCategory,"num":category[i].num || "5"});
			getApiData(param,category[i].apiCategory,category[i].index);				
			
		}			
	}

	function getApiData( param,category,index ){
		$.ajax({
			url:conf.apiUrlPrefix+param,
			dataType: "jsonp",
			async:false,
			jsonp: "jsonp",
			jsonpCallback: "ghao123_" + hex_md5(param,16),
			cache: false,

			success:function(result){
				renderSortsiteApiData({apiData:result.content.data.contents[category],index:index});
			},
			 error:function(){
				
			 }
		});
	}

	function renderSortsiteApiData( result ){
		var el = $("dl.sortsite").eq(result.index);
		
		el.find("dd").each(function(i){
			if( i >= result.apiData.length){
				return false;
			}
			var $this = $(this);
			$this.find("a").attr("href",result.apiData[i].url);
			$this.find(".link-name").text(result.apiData[i].name);
		});
	}

	//($(".tab-lists").css("height")=="120px") && $(".tab-lists li").css("width","33%");
	if(!$(".sortsites-tabs-container").length){ return;}
	conf.sortsite.show && !$.cookie("sortsiteBubble") && $(".bubble-like").show();

	//tab换组，循环关系
	$(".sortsites-tabs-refresh").click(function(e){
		e.preventDefault();
		var tabList = $(this).parent().find(".tab-lists"),
			listLength = -parseInt(tabList.css("height"),10),
			top = parseInt(tabList.css("top"),10)-30;
		UT.send({
			position: "sortsitesTabRefresh",
			modId: "sortsites",
			type: "click"
		});		
		top = (top == listLength)?0:top;	
		top == 0 && tabList.css("top","30px");
		!tabList.is(":animated") && tabList.animate({"top":top+"px"});
	});
	//根据itemIndex来确定需要跳转的分类区
	$(".tab-item").click(function(e){
		e.preventDefault();
		var itemIndex = $(this).attr("item-index"),
			itemOffSet = 0,
			body = $( "body" ),
			win = $( window ),
			// isHeadCeiled = body.hasClass( "header-fixed" ),
			isSearchboxCeiled = body.hasClass( "header-fixed-up" );
			//itemOffSet = (parseInt((index+1)/2,10)-1)*260+420;
		UT.send({
			position: "sortsitesTabItem",
			modId: "sortsites",
			type: "click",
			modIndex: itemIndex
		});		
		$(".sortsite").removeClass("select");
		$("dl.sortsite").each(function(){
			var $this = $(this);
			if(itemIndex == $this.attr("log-index")){
				itemOffSet = $this.offset().top;
				$this.addClass("select");
				return false;
			}
		});	
		if( that.navOpt.newHeader && that.navOpt.isCeiling === "1" ){
			if( that.navOpt.ceilingMore == "1" && !isSearchboxCeiled ){
				win.scrollTop( itemOffSet - ( parseInt( that.navOpt.paddingTop1 ) || 140 ) );
			}else{
				win.scrollTop( itemOffSet - ( parseInt( that.navOpt.paddingTop ) || 45 ) );
			}
		}else{
			win.scrollTop( itemOffSet - 50 );
		}
		// $(window).scrollTop(itemOffSet-50);
		
	});
	$(".bubble-like i").on({
	mouseenter: function () {
    	$(this).addClass("i-hover");
	},
	mouseleave: function () {
	    $(this).removeClass("i-hover");
	},
	click:function(){
		$(this).parent().hide();
		$.cookie("sortsiteBubble",1, {expires: 2000});
	}
	});  
	$(document.body).on("mousedown",function(){$(".sortsite").removeClass("select");});
	
}();
  
