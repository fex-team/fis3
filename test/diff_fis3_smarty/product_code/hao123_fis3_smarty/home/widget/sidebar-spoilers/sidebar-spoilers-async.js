var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var hex_md5 = require('common:widget/ui/md5/md5.js');
var helper = require("common:widget/ui/helper/helper.js");
var scroll = require("common:widget/ui/scrollable/scrollable.js");

var sidebarSpoilers = function() {
	var spoilerTriangle = '<b class="ui-arrow ui-bubble-spoilers_out" style="display:block"></b><b style="display:block" class="ui-arrow ui-bubble-spoilers_in"></b>';
	var spoilersBubble = '<div class="ui-bubble-spoilers ui-bubble-spoilers-l sidebar-spoilers-bubble"><span class="sidebar-spoilers-bubble-del-info"></span></div>';
	var spoielersTpl = '<li class="sidebar-spoilers-block">'
							+'<div class="sidebar-spoilers-period">'
								+'<a href="#{series_link}" title="#{series_title}"><span class="spoilers-title">#{series_title}</span></a>'
							+'</div>'
							+'<div class="sidebar-spoilers-period01">'
							+'</div>'
						+'</li>';
	var spoilersDetail = '<div class="sidebar-spoilers-del">'
								+'<div class="sidebar-spoilers-info">'
									+'<a href="#{link}">'
										+'<img src="#{image}" width="75px" height="65px" class="sidebar-spoilers-feed-img fl"/>'
										+'<span class="sidebar-spoilers-intro">#{title}</span>'
									+'</a>'
								+'</div>'
								+'<span class="sidebar-spoilers-hidden">#{description}</span>'
							+'</div>';
	function getData(){
		var preParams = "http://api.gus.hao123.com/api.php";
		var params = "?app=series&act=contents&vk=1&country=br&num="+ conf.spoilersNum +"&type=&jsonp=";
		$.ajax({
		/*url: preParams + params,*/
        url: conf.apiUrlPrefix + params,
       	/*url:"http://fenfen.com:8080/static/a.js",*/
        dataType: "jsonp",
        jsonp: "jsonp",
        jsonpCallback: "ghao123_" + hex_md5(params,16),
        /*jsonpCallback : "ghao123_309e56efe6ffc4c1",*/
        cache: false,
        success: function(result) {
	           render(result.content.data);
	        }
	    });	
	};

	function render(data){
		var dom = "";
		var dom2 = "";
		var ul = $(".spoilers");
		var bubble = "";
		var arr = [];
		for(var i=0;i<data.length;i++){
			dom2 = "";
			dom = dom + helper.replaceTpl(spoielersTpl,{
				"series_title": data[i].series_title,
				"series_link": data[i].series_link,
			});
			for(var j=0;j<data[i].items.length;j++){
				dom2 += helper.replaceTpl(spoilersDetail,{
					"title": data[i].items[j].title,
					"description": data[i].items[j].description,
					"image": data[i].items[j].image,
					"link": data[i].items[j].link
				});
			}
			arr.push(dom2);
		};

		bubble = bubble + helper.replaceTpl(spoilersBubble);
		ul.append(dom);
		for(var i=0;i<data.length;i++){
			ul.find(".sidebar-spoilers-period01").eq(i).append(arr[i]);
		}
		ul.scrollable({
			autoHide:false,
			dir:conf.dir
		});
		$("body").append(bubble);
		handerData();
	}

	function handerData(){
		var triangle = "";
		triangle = triangle + helper.replaceTpl(spoilerTriangle);
		$(".sidebar-spoilers-info").hover(function(){
			//如果ltr页面的sidebar在右侧，就把提示隐藏掉
			if( window.hao123 && window.hao123.atRightSide ){
				return;
			} 
			$(".sidebar-spoilers-bubble-del-info").text($(this).next().text());
			if($(this).offset().top - $(window).scrollTop()+ 190 > $(window).height()){
				var triangleEl = 240-$(window).height()+$(this).offset().top-$(window).scrollTop();
				triangleEl > 199 ? 199 : triangleEl;
				$(".ui-bubble-spoilers").find('b').remove();
				$(".sidebar-spoilers-bubble").css({
					"top": $(window).scrollTop() + $(window).height() - "160" +"px",
					"left": $(this).offset().left-"-70"+"px"
				}) ;
				$(".ui-bubble-spoilers").append(triangle);
				$(".ui-bubble-spoilers_out").css({"top": triangleEl + "px"});
				$(".ui-bubble-spoilers_in").css({"top": triangleEl + 1 + "px"});
			}else{
				$(".ui-bubble-spoilers").find('b').remove();
				$(".sidebar-spoilers-bubble").css({
					"top": $(this).offset().top-"-50"+"px",
					"left": $(this).offset().left-"-70"+"px"
				}) ;
				$(".ui-bubble-spoilers").append(triangle);	
			};
			$(".sidebar-spoilers-bubble").show();
		},function(){
			$(".sidebar-spoilers-bubble").hide();
		});

		$(".sidebar-spoilers-intro").each(function(){
			if($(this).text().length>50){
				$(this).text($(this).text().substring(0,50)+"...");
			};
		});
		$(".sidebar-spoilers-hidden").each(function(){
			if($(this).text().length>300){
				$(this).text($(this).text().substring(0,300)+"...");
			};
		});
	}
	getData();
}

module.exports = sidebarSpoilers;