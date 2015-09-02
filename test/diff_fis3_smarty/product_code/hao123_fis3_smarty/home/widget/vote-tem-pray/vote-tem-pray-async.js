var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var hex_md5 = require('common:widget/ui/md5/md5.js');

var voteTelPray = function(){
	this.prayBtnEl();
	this.shareBtnEl();
};

voteTelPray.prototype = {
	
	prayBtnEl:function(){
		var _this = this,
		prayBtn = $("#voteTemPray").find(".vote-agree-pray");

		prayBtn.one("click",this,function(){
			if($(this).hasClass("voted-check")){
				return ;
			}else{
				_this.renderData();
				$(this).addClass("voted-check");
				UT.send({type:"click",ac:"b",position:"pray-handle",modId:"vote-tem-pray"}); 
			}
		});
	},
	renderData:function(){

		var	_this = this,
			voteparams = "?app=vote&country="+conf.country+"&vote_id="+conf.dataTransform.voteItems.vid+"&vnum=1&id=1&act=mCastVote&vk=0";

		$.ajax({
			url:conf.apiUrlPrefix+voteparams,
			dataType: "jsonp",
			jsonp: "jsonp",
			jsonpCallback: "ghao123_" + hex_md5(voteparams,16),
			cache: false,

			success:function(result){
				/*循环插入common数据*/
				var result = result.content.data,
					prayBtn = $("#voteTemPray").find(".vote-agree-pray");

				prayBtn.text(conf.dataTransform.voteItems.resultTxtPre + result[0].n + conf.dataTransform.voteItems.resultTxtLast);

			},
			error:function(){
				
			}
		});
	},
	shareBtnEl:function(){
		var _this = this,
			shareFB = $("#voteTemPray").find(".vote-share-fb"),
			shareTer = $("#voteTemPray").find(".vote-share-ter");

		shareFB.click(function(){
			_this.getIsNot("facebook");
			UT.send({type:"click",ac:"b",position:"facebook-share",modId:"vote-tem-pray"});
		});
		shareTer.click(function(){
			_this.getIsNot("twitter");
			UT.send({type:"click",ac:"b",position:"twitter-share",modId:"vote-tem-pray"});
		})

	},
	/*祈福分享到值*/
	getIsNot:function(item){
		var redirect_url;

		item == "facebook" ? redirect_url = "https://www.facebook.com/dialog/feed?app_id="+conf.fbAppId+"&display=popup&link="+conf.dataTransform.voteItems.redirectURL+"&picture="+conf.dataTransform.voteItems.prayImg+"&name="+ conf.dataTransform.voteItems.shareTitle+ "&description="+conf.dataTransform.voteItems.shareText+"&to=&redirect_uri=https://www.facebook.com/" : redirect_url = "https://twitter.com/intent/tweet?text=" + conf.dataTransform.voteItems.shareText + "&url=" + conf.dataTransform.voteItems.redirectURL
	
		window.open(redirect_url,"newwindow");
	},
}

module.exports = voteTelPray;