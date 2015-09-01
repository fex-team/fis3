var sideLottery = function(type){
	var lottery;
	if(conf.lottery.displayType === "vn"){
		if(type === 'index'){
			require.async('home:widget/ui/lottery/vnLotteryIndex.js' , function(VnLotteryIndex){
				lottery = new VnLotteryIndex(conf);
			});
		}else{
			require.async('lv2:widget/site-list-v/lottery/vnLotteryLv2.js' , function(VnLotteryLv2){
				lottery = new VnLotteryLv2(conf);
			});
		}
	}else if(conf.lottery.displayType === "th"){
		require.async('home:widget/ui/lottery/thLottery.js' , function(init){
			init();
		});
	}else if(conf.lottery.displayType === "br"){
		require.async('home:widget/ui/lottery/brLottery.js' , function(BrLottery){
			new BrLottery();
		});
	}
};
module.exports = sideLottery;
