var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var hex_md5 = require('common:widget/ui/md5/md5.js');
var helper = require("common:widget/ui/helper/helper.js");
Gl.bottomImage = {};


Gl.bottomImage.init = function( item ){
	var that = this;
	that.divItem = $("#"+item);
	that.requireData();

};
Gl.bottomImage.switchImage = function(){
	var container = this.divItem;
	var dir = $("html").attr("dir");
	var index = 0,
		nums = parseInt(container.attr("nums"),10),
		length = parseInt(nums/6),
		pre = container.find(".bottomImagePre"),
		next = container.find(".bottomImageNext"),
		ul = container.find(".ul-list"),
		isAnimated = true;

	length = nums%6 === 0?length-1:length;
	ul.append( ul.find(".ul-list-li:first").clone() );
	container.find(".imageSwitch").on("click",function(){
		if( index == length+1 ) return;
		var distance;
		if( $(this).hasClass("bottomImagePre")){
			if( index == 0){
				ul.css({marginLeft:-926 * (length+1)+"px"});
				index = length + 1;
			}
			index--;
		} else {
			index++;
		}
		distance = -index * 926;
		ul.stop().animate({marginLeft:distance+"px"},700,function(){
			isAnimated = false;
			if( index == length+1 ){
				ul.css({marginLeft:0});
				index = 0;
			}
			isAnimated = true;
		});
		UT.send({
		    type:"click",
		    ac:"b",
		    position:"bottomImage",
		    modId:"bottom",
		    sort:"switchImage"
		});

	});

};
Gl.bottomImage.requireData = function(){
	var that = this,
		container = that.divItem,
		data = container.attr("imageData"),
		nums = container.attr("nums"),
		type = container.attr("image-type"),
		li = "";


	data.length && $.ajax({
		dataType:"jsonp",
		url:data,
		jsonp: "jsonp",
		cache: false,
		success:function(result){
			var ulNums = nums/6,
				ultpl = '<ul class="bottom-image-ul" ul-index="#{index}"></ul>',
				litpl = "",
				ulList = container.find(".ul-list"),
				imgUrl = "",
				link = "",
				title = "",
				resultData = [],
				i = 0;

			//图片二级页
			if( type == "image" ){
				for( i;i < result.data.length;i++ ){
					resultData.push({ link:"",src:"",title:""});
					resultData[i].link = result.data[i].from_url;
					resultData[i].src = result.data[i].img_url;
				}
				litpl = '<li class=bottomImageItem>'
						+'	<a href="#{link}">'
						+'		<img src="#{src}" />'
						+'	</a>'
						+'</li>';
			//视频二级页
			} else if( type == "movie" ){
				for( i;i < result.list.length;i++ ){
					resultData.push({ link:"",src:"",title:""});
					resultData[i].link = "/movie/play?id="+result.list[i].id+"&from=hao123_undertab_video_"+conf.country;
					resultData[i].src = result.list[i].internal_picture;
					resultData[i].title = result.list[i].title;
				}
				litpl = '<li class=bottomImageItem>'
						+'	<a href="#{link}" title="#{title}">'
						+'		<img src="#{src}" />'
						+'		<i class=i-play></i>'
						+'		<span class=image-title>#{title}'
						+'		</span>'
						+'	</a>'
						+'</li>';
			//游戏二级页			
			} else if( type == "game" ){
				for( i;i < result.data.length;i++ ){
					resultData.push({ link:"",src:""});
					resultData[i].link = result.data[i].url+"&from=hao123_bottom1_content_"+conf.country;
					resultData[i].src = result.data[i].picture;
				}
				litpl = '<li class=bottomImageItem>'
						+'	<a href="#{link}">'
						+'		<img src="#{src}" />'
						+'	</a>'
						+'</li>';
			}


			ulNums = nums%6 === 0 ? ulNums: ulNums+1;
			ulList.width( 926*(ulNums+1) );
			container.find(".loadMessage").hide();
			for(var j=0;j<ulNums;j++){
				ulList.append('<li class="ul-list-li">'+helper.replaceTpl(ultpl,{"index":j})+'</li>');
			}
			container.find(".bottom-image-ul").each(function(){
				var $this = $(this),
					index = $this.attr("ul-index");
				for(var i=0;i<nums;i++){
					(parseInt(i/6,10) == index) &&
					$this.append(helper.replaceTpl(litpl,{"link":resultData[i].link,"src":resultData[i].src,"title":resultData[i].title}));
				}
			});
			container.attr("imageData","");
			that.switchImage();
			that.bindEvents();
		}
	});


};
Gl.bottomImage.bindEvents = function(){
	$(".bottomImageItem").hover(
		function(){
			var $this = $(this),
				playIcon = $this.find(".i-play");
			playIcon.length && playIcon.addClass("i-play_hover");
		},
		function(){
			var $this = $(this),
				playIcon = $this.find(".i-play");
			playIcon.length && playIcon.removeClass("i-play_hover");
		}
	);
}
