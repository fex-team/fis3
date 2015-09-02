var $ = require('common:widget/ui/jquery/jquery.js'),
	UT = require('common:widget/ui/ut/ut.js'),
	helper = require("common:widget/ui/helper/helper.js"),
	hex_md5 = require('common:widget/ui/md5/md5.js');

!function() {
	//api数据介入
	if(!conf.sortArea.apiIntervention.length){
		return;
	} else {
		getApiParam();
	}

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
}();