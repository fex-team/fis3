var $ = require('common:widget/ui/jquery/jquery.js');
var helper = require("common:widget/ui/helper/helper.js");
var hex_md5 = require('common:widget/ui/md5/md5.js');
var UT = require('common:widget/ui/ut/ut.js');

var ecommercePrompt = function (){
	var goodsItemTpl = '<li class="goods-list-item items">'
							+'<a class="item-link" data-href="#{url}">'
							+	'<img src="#{img}" class="item-img"/>'
							+	'<span class="item-title">#{title}</span>'
							+	'<span class="item-price">#{price}</span>'
							+'</a>'
						+'</li>',
		sellerTpl = '<li class="goods-list-item item-selleer">#{title}</li>',
		jumpToBottomTpl = '<li class="goods-list-item item-jump"><i class="i-jump-bottom"></i><span class="jump-des">#{guiderDescription}</span></li>',
		_conf = conf.ecommercePrompt,
		scollHandle = null,
		timer = null,
		isScrolled = true,
		win = $(window),
		target = $(".mod-bottom-ecommerce"),
		$this = $(".mod-ecommerce-prompt");

	function init(){
		getData();
		_conf.time && initTimer();
	}

	function render( result ){
		var goodsList = [],
			els = "";

		els = els + helper.replaceTpl(sellerTpl,{"title":_conf.title+":"});
		for(var i=0;i<3;i++){
			var data = _conf.list,
				results = result[_conf.seller];
			els = els + helper.replaceTpl(goodsItemTpl,{
				"img":data[i].img || results[i].img,
				"url":data[i].url || results[i].link,
				"title":data[i].title || results[i].title,
				"price": data[i].price || $.trim(results[i].price.replace(/a partir de/, ""))
			});
		}	
		els = els + helper.replaceTpl(jumpToBottomTpl,{"guiderDescription":_conf.guiderDescription});
		$(".ep-goods-list").append(els);
		$this.animate({"bottom":"0px"},700);
	}	

	function getData(){
		if(_conf.apiParams){
			$.ajax({
				url:conf.apiUrlPrefix+_conf.apiParams,
				dataType: "jsonp",
				jsonp: "jsonp",
				async:false,
				jsonpCallback: "ghao123_" + hex_md5(_conf.apiParams,16),
				cache: false,
				success:function(result){
					render(result.content.data.contents);					
				},
				error:function(){
					
				}
			});
		} else {
			render();
		}	
	}
	function initTimer(){
		timer = setTimeout(function(){
			$this.remove();
			scollHandle && clearInterval(scollHandle);
		},_conf.time);
	}
	$(".mod-ecommerce-prompt").on("click",".item-jump",function(){
		$(".g-area-lazyload").lazyload({triggerAll:true});
		win.scrollTop(target.offset().top-100);
		timer && clearTimeout(timer);
		$.cookie("eco-prompt", _conf.version, {expires:2000});
		UT.send({
			modId:"ecommerce-prompt",
			ac:"b",
			type:"click",
			position:"bottom"
		});
	}).
	on("click",".ep-i-close",function(){
		$this.remove();
		$.cookie("eco-prompt", _conf.version, {expires:2000});
		timer && clearTimeout(timer);
		UT.send({
			modId:"ecommerce-prompt",
			ac:"b",
			type:"click",
			position:"close"
		});
	}).
	on("click",".item-link",function(e){
		e.preventDefault();
		//这里用window方法是为了避免hover上去以后浏览器的提示遮挡这个浮层
		window.open($(this).attr("data-href"));
		UT.send({
			modId:"ecommerce-prompt",
			type:"click",
			position:"items"
		});
	});
	win.one("scroll", function() {
		(!$.cookie("eco-prompt") || $.cookie("eco-prompt") != _conf.version) && init();
	});
	win.on("scroll", function() {
		isScrolled = true;
	});
	scollHandle = setInterval(function(){
		if(isScrolled){
			isScrolled = false;
			if($this.offset().top >= target.offset().top){
				 $this.remove();
				 clearInterval(scollHandle);
			}
		}
	},250);
	
}
module.exports = ecommercePrompt;