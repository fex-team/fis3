var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var helper = require('common:widget/ui/helper/helper.js');

!function () {
	var countryTpl =  '<li class="lv2-sites">'
					+	'<a href="http://#{country}.hao123.com/statement" target="_self" class="#{class}">#{name}</a>'
					+ '</li>',
		el = $(".mod-statement");

	function init(){
		renderSites();
		bindEvents();
	}	

	function renderSites(){
		var countrys = {ar:"Egypt",sa:"Saudi Arabia",br:"Brasil",id:"Indonesia",th:"Thailand",
						vn:"Vietnam",tw:"Taiwan"},
			dom = "";
		
		for ( c in countrys ) {
		 	dom = dom + helper.replaceTpl( countryTpl,{ "country":c,"name":countrys[c],"class":conf.country == c ? "cur" : "" });
		}
		$(".country",el).text(countrys[conf.country]+" ");
		$(".lv2-settings-site").append(dom);
	}	

	function bindEvents(){
		//当前国家
		$(".cur",el).click(function(e){
			e.preventDefault();
		});
		//国家下拉菜单
		$(".lv2-settings").hover(
			function(){
				$(this).height(136);
				$(".lv2-settings-dropdown").show();
				$(".arrow",el).addClass("arrow_up");
			},
			function(e){
				$(this).height(19);				
				$(".lv2-settings-dropdown").hide();
				$(".arrow",el).removeClass("arrow_up");
			}

		);
	}

	init();			
}();