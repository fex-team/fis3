var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var hex_md5 = require('common:widget/ui/md5/md5.js');

var brBottomVote = {};

brBottomVote.hasRequiredData = false;
brBottomVote.init = function(){
	var that = this;
	that.timer = null;
	that.defaultSelected();
	that.renderResult();
	that.bindEvents();

	
};
brBottomVote.defaultSelected = function(){
	$(".voteRadio").each(function(){
		if( !$(this).parent().hasClass("playerdead") ){
			$(this).addClass("voteRadio-check");
			return false;
		} 
	});
};
brBottomVote.bindEvents = function(){
	var that = this;

	$(".votes").on("mouseenter",function(){
		if( $(this).hasClass("playerdead") ){
			return;
		}

		$(this).find(".voteRadio").addClass("voteRadio-hover");
	});
	$(".votes").on("mouseleave",function(){
		if( $(this).hasClass("playerdead") ){
			return;
		}

		$(this).find(".voteRadio").removeClass("voteRadio-hover");
	});
	$(".votes").on("click",function(){
		if( $(this).hasClass("playerdead") ){
			return;
		}

		$(".voteRadio").removeClass("voteRadio-check");
		$(this).find(".voteRadio").addClass("voteRadio-check");
		UT.send({
		    type:"click",
		    ac:"b",
		    position:"voteRadio",
		    modId:"bottom-vote"
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
		    position:"check",
		    modId:"bottom-vote"
		}); 
	});
	//投票
	$(".voteBtnContatiner button").on("click",function(){	
		var index = parseInt($(".voteRadio-check").attr("index"),10);
		that.timer && clearTimeout(that.timer);	
		that.switchPage("go");			
		$(".voteItem").removeClass("seleced");
		UT.send({
		    type:"click",
		    ac:"b",
		    position:"vote",
		    modId:"bottom-vote"
		}); 
		that.requireData(index);
		
	});
	//回到投票页
	$(".backToVote").on("click",function(e){
		e.preventDefault();
		that.switchPage("back");
		UT.send({
		    type:"click",
		    ac:"b",
		    position:"back",
		    modId:"bottom-vote"
		}); 
		
	});

};
brBottomVote.votePercentAnimate = function(){
	$(".votePercent").each(function(){
		var thisobj = $(this);
		thisobj.animate({height:thisobj.attr("per")});
	});
};
brBottomVote.switchPage = function(d){
	var dir = $("html").attr("dir"),
		dis = conf.layout1020 ? "-1020px" : "-960px"; 

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
brBottomVote.itemSelected = function(){
	var index = parseInt($(".voteRadio-check").attr("index"),10),
	    voteItem = $(".voteItem"),
	    selectedItem = null,
	    that = this;	

	voteItem.each(function(){
		var $this = $(this),
			id = $this.attr("playerid");

		if( index == parseInt(id,10) ){
			 $this.addClass("seleced");
			 selectedItem = $this;	
			 return false;
		}
	});
	that.timer = setTimeout(function(){
		selectedItem && selectedItem.removeClass("seleced");
	},3000);		

};
brBottomVote.requireData = function(id){	
	var	that = this,
		params = "?app=vote&country="+conf.country+"&vote_id="+conf.brBottomVote.vid+"&vnum="+conf.brBottomVote.list.length;
	id = id || "";
	params = id ? params+"&id="+id+"&act=castVote":params+"&act=getVote";
	//$(".i-rank").addClass("i-hide");	
		
	$.ajax({
		url:conf.apiUrlPrefix+params,
		dataType: "jsonp",
		jsonp: "jsonp",
		jsonpCallback: "ghao123_" + hex_md5(params,16),
		cache: false,

		success:function(result){
			$(".votePercent").height(0);
			result = that.sortResult(result.content.data);
			$(".voteItem").each(function(i){
				var $this = $(this);
				$this.attr("playerid",result[i].id);
				$this.find(".votePercentNum").text(result[i].n);
				$this.find(".votePercent").attr("per",result[i].p);
				$this.find(".votePercentName").find("span").text(result[i].name);
				$this.find(".i-hide").text(i+1);
				( i < 3 ) && $this.find(".i-hide").addClass("i-rank"); 
			});
			id && that.itemSelected();
			setTimeout(function(){that.votePercentAnimate();},500);
			that.hasRequiredData = true;
		},
		error:function(){
			
		}
	});
	
};

brBottomVote.renderResult = function(){
	var tpl = '<li class="voteItem" playerid="">'
			  +	  '<span class="votePercentNum">0%</span>'
			  + 	 '<span class="votePercentImage"><span class="votePercent" per=""></span></span>'
			  + 	 '<span class="votePercentName"><i class="i-hide i-rank-green"></i><span></span></span>'
			  +  '</li>',
		dom = "";

	for( var i = 0 ;i < 10 ;i++ ){
		dom = dom + tpl;
	}	
	$(".resultList",".mod-br-bottom-vote").append( dom );  
};

brBottomVote.sortResult = function( data ){
	for(var i = data.length-1;i > 0;i--){
		for(var j = 0;j < i;j++){
			if(data[j].n < data[j+1].n){
				var temp = data[j+1];
				data[j+1] = data[j];
				data[j] = temp;
			}
		}
	}
	for(var n = 0;n < data.length;n++ ){
		data[n]["name"] = $(".votes").eq(data[n].id-1).find("span").text();
	}
	return data;
};
		
module.exports = brBottomVote;