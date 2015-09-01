var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var hex_md5 = require('common:widget/ui/md5/md5.js');
var message = require('common:widget/ui/message/src/message.js');
var bottomVote = {};

bottomVote.hasRequiredData = false;
bottomVote.init = function(){
	var that = this;

	that._conf = conf.bottomVote;
	that.timer = null;
	that.defaultSelected();
	that.renderResultPage();
	that.bindEvents();
	that.utPosition = that._conf.category;

};
bottomVote.defaultSelected = function(){
	$(".voteRadio").each(function(){
		if( !$(this).hasClass("disabled") ){
			$(this).addClass("voteRadio-check");
			return false;
		}
	});
};
bottomVote.bindEvents = function(){
	var that = this;

	$(".voteRadio").on("mouseenter",function(){
		if( $(this).hasClass("disabled") ){
			return;
		}

		$(this).addClass("voteRadio-hover");
	}).on("mouseleave",function(){
		if( $(this).hasClass("disabled") ){
			return;
		}

		$(this).removeClass("voteRadio-hover");
	}).on("click",function(){
		if( $(this).hasClass("disabled") ){
			return;
		}

		$(".voteRadio").removeClass("voteRadio-check");
		$(this).addClass("voteRadio-check");
		UT.send({
		    type:"click",
		    ac:"b",
		    position:"bottom"+that.utPosition,
		    modId:"bottom",
		    sort:"voteRadio"
		});
	});

	//不投票，查看结果
	$(".voteTitle .voteTitle-check").on("click",function(e){
		e.preventDefault();
		that.switchPage("go");
		that.requireData();
		that.timer && clearTimeout(that.timer);
		UT.send({
		    type:"click",
		    ac:"b",
		    position:"bottom"+that.utPosition,
		    modId:"bottom",
		    sort:"check"
		});
	});
	//投票
	$(".voteBtnContatiner button").on("click",function(){
		var index = parseInt($(".voteRadio-check").attr("index"),10),
		    voteItem = $(".voteItem");

		that.timer && clearTimeout(that.timer);
		that.switchPage("go");

		voteItem.removeClass("seleced");

		UT.send({
		    type:"click",
		    ac:"b",
		    position:"bottom"+that.utPosition,
		    modId:"bottom",
		    sort:"vote"
		});
		that.requireData(index+1);

	});
	//回到投票页
	$(".backToVote").on("click",function(e){
		e.preventDefault();
		that.switchPage("back");
		UT.send({
		    type:"click",
		    ac:"b",
		    position:"bottom"+that.utPosition,
		    modId:"bottom",
		    sort:"back"
		});

	});
	// 在屏幕尺寸变化时做相应的改变
	message.on("module.flow.switch",function(width){
		that.flowRender();
	});
};
bottomVote.votePercentAnimate = function(){
	$(".votePercent").each(function(){
		var thisobj = $(this);
		thisobj.animate({height:thisobj.attr("per")});
	});
};
bottomVote.switchPage = function(d){
	var dir = $("html").attr("dir"),
		dis = conf.curLayout == 1020 ? "-1020px" : "-960px";
	dis = d === "go"?dis:"15px";
	if(dir === "ltr"){
		if( d === "go" ){
			$(".votePage").animate({marginLeft: dis}, "slow",function(){
				$(this).hide();
			});
		} else {
			$(".votePage").show().animate({marginLeft: dis}, "slow");
		}

	}
	else{
		if( d === "go" ){
			$(".votePage").animate({marginRight: dis}, "slow",function(){
				$(this).hide();
			});
		} else {
			$(".votePage").show().animate({marginRight: dis}, "slow");
		}
	}
};
bottomVote.renderResultPage = function(){
	var that = this,
		tpl = '<li class="voteItem" index="">'
			  +	  '<span class="votePercentNum">0%</span>'
			  + 	 '<span class="votePercentImage"><span class="votePercent" per=""></span></span>'
			  + 	 '<span class="votePercentName"><i class="i-hide i-rank-green"></i><span></span></span>'
			  +  '</li>',
		dom = "",
		_conf = this._conf;
		that.len = Math.min(_conf.list.length,Math.min(_conf.resultNum,12));

	for( var i = 0 ;i < that.len ;i++ ){
		dom = dom + tpl;
	}
	$(".resultList","#bottomVote").append( dom );
	that.flowRender();
};
bottomVote.flowRender = function(){
	var that = this,
		width = conf.curLayout == 1020 ? 992 : 935,
		margin = (width-that.len*72) / (that.len-1),
		dir = conf.dir == "ltr" ? "marginRight" : "marginLeft";
	$("#bottomVote").find(".voteItem").slice(0,that.len-1).css(dir,margin+"px");
};
bottomVote.formatResult = function( data ){
	if( this._conf.isSort ){
		for(var i = data.length-1;i > 0;i--){
			for(var j = 0;j < i;j++){
				if(data[j].n < data[j+1].n){
					var temp = data[j+1];
					data[j+1] = data[j];
					data[j] = temp;
				}
			}
		}
	}

	for(var n = 0;n < data.length;n++ ){
		data[n]["name"] = $("#bottomVote").find(".vote-title").eq(data[n].id-1).text();
		data[n]["r"] = this._conf.isSort ?  n + 1 : data[n]["r"] ;
	}
	return data;
};
bottomVote.itemSelected = function(){
	var index = parseInt($(".voteRadio-check").attr("index"),10),
	    voteItem = $(".voteItem"),
	    selectedItem = null,
	    that = this;

	if( that._conf.isSort ) {
		voteItem.each(function(){
			var $this = $(this),
				id = $this.attr("index");

			if( index + 1 == parseInt(id,10) ){
				 $this.addClass("seleced");
				 selectedItem = $this;
				 return false;
			}
		});
	} else {
		selectedItem = voteItem.eq(index);
		selectedItem.addClass("seleced");
	}

	that.timer = setTimeout(function(){
		selectedItem && selectedItem.removeClass("seleced");
	},3000);

};

bottomVote.requireData = function(id){
	var	that = this,
		params = "?app=vote&country="+conf.country+"&vote_id="+conf.bottomVote.vid+"&vnum="+conf.bottomVote.list.length,
		_conf = that._conf,
		rank = _conf.rank ? parseInt(_conf.rank,10) : 3;

	id = id || "";
	params = id ? params+"&id="+id+"&act=castVote":params+"&act=getVote";
	$(".i-rank").addClass("i-hide");

	$.ajax({
		url:conf.apiUrlPrefix+params,
		dataType: "jsonp",
		jsonp: "jsonp",
		jsonpCallback: "ghao123_" + hex_md5(params,16),
		cache: false,

		success:function(result){
			$(".votePercent").height(0);
			result = that.formatResult(result.content.data);
			$(".voteItem").each(function(i){
				var $this = $(this);

				$this.attr("index",result[i].id);
				$this.find(".votePercentNum").text(result[i].n);
				$this.find(".votePercent").attr("per",result[i].p);
				$this.find(".votePercentName").find("span").text(result[i].name);
				$this.find(".i-hide").text(result[i].r);
				if( !_conf.isSort ){
					result[i].r == 1 && $this.find(".i-hide").removeClass("i-hide");
				} else {
					(i < rank ) && $this.find(".i-hide").removeClass("i-hide");
				}

			});
			id && that.itemSelected();
			setTimeout(function(){that.votePercentAnimate();},500);
			that.hasRequiredData = true;
		},
		error:function(){

		}
	});

};

module.exports = bottomVote;
