var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var hex_md5 = require('common:widget/ui/md5/md5.js');

!function () {
	var el = $(".mod-side-like"),
		numEl = el.find(".like-num"),
		likeWrap = el.find(".like-wrap"),
		add = el.find(".like-add");
	function init(){
		getNum();
		bindEvents();
	}

	//获取票数
	function getNum(){
		//投票参数，vid统一为999,vum统一为1，只变国家即可
		var params = "?app=vote&country=" + conf.country + "&vote_id=999&act=mGetVote&vnum=1";
		$.ajax({
			url: conf.apiUrlPrefix + params,
			dataType: "jsonp",
			jsonp: "jsonp",
			jsonpCallback: "ghao123_" + hex_md5(params,16),
			success:function(result){
				numEl.text(result.content.data[0].n);
			},
			error:function(){

			}
		});
	}

	//票数加一
	//前端无论请求成功与否都加一
	function addNum(){
		//投票参数，vid统一为999,vum统一为1，只变国家即可
		var params = "?app=vote&country=" + conf.country + "&vote_id=999&act=mCastVote&vnum=1&id=1";
		$.ajax({
			url: conf.apiUrlPrefix + params,
			dataType: "jsonp",
			jsonp: "jsonp",
			jsonpCallback: "ghao123_" + hex_md5(params,16),
			cache: false
		});
	}

	function bindEvents(){
		likeWrap.on("mousedown",function(){
			var $this = $(this),
				n = parseInt(numEl.text());
			//当前页面只能点一次，刷新以后可以继续点
			if( $this.hasClass("selected") ){
				return;
			} else {
				$this.addClass("selected");
				add.fadeIn();
				numEl.text( n + 1 );
				setTimeout(function(){
					add.fadeOut();
				},1500);
				UT.send({
					modId: "side-like",
					position: "like",
					ac: "b"
				});
				addNum();
			}			
		})
		.on("mouseover",function(){
			var $this = $(this);
			!$this.hasClass("selected") && $this.addClass("hover");
		})
		.on("mouseleave",function(){
			$(this).removeClass("hover");
		});
	}

	init();
}();