window.conf || (window.conf = {});
var $ = require('common:widget/ui/jquery/jquery.js');
require('common:widget/ui/jquery/widget/jquery.ui.button/jquery.ui.button.js');  //jquery.UI

conf.weatherArea = {
	"\u5317\u6d77\u9053": ["4-223985_1_AL", "8-217875_1_AL", "2-217787_1_AL", "6-223986_1_AL", "5-217907_1_AL", "4-217942_1_AL", "10-217792_1_AL", "5-218128_1_AL", "4-217892_1_AL", "5-217794_1_AL", "6-217784_1_AL", "1-217876_1_AL", "4-217793_1_AL", "1-2334234_1_AL", "6-223987_1_AL", "217843"],
	"\u6771\u5317": ["4-224683_1_AL", "4-222341_1_AL", "6-216904_1_AL", "8-216886_1_AL", "4-224170_1_AL", "4-218332_1_AL", "4-218342_1_AL", "4-221897_1_AL", "5-216836_1_AL", "4-221567_1_AL", "4-221569_1_AL", "4-221570_1_AL", "6-221591_1_AL", "4-223551_1_AL", "217436","224683","218964","217415","218990"],
	"\u95a2\u6771\u30fb\u4fe1\u8d8a": ["2-226396_1_AL", "4-224374_1_AL", "4-724_1_AL", "221048", "1510182", "1652504", "4-220908_1_AL", "1-220889_1_AL", "4-223069_1_AL", "6-309_1_AL", "6-216952_1_AL", "4-218223_1_AL", "4-226389_1_AL", "221137", "1-223622_1_AL", "1-221693_1_AL", "4-224701_1_AL", "8-219098_1_AL", "4-219097_1_AL","2012157","218236","1-2334040_1_AL", "2423804"],
	"\u5317\u9678": ["4-224807_1_AL", "4-224165_1_AL", "4-219302_1_AL", "4-219303_1_AL", "4-226415_1_AL", "221279", "1-218305_1_AL", "4-223540_1_AL", "5-217288_1_AL", "2014153"],
	"\u6771\u6d77": ["4-221855_1_AL", "1-221859_1_AL", "1-223600_1_AL", "4-217488_1_AL", "1-226089_1_AL", "1523", "221060", "5-226090_1_AL", "218908", "2-944_1_AL"],
	"\u8fd1\u757f": ["10-225007_1_AL", "4-224023_1_AL", "218187", "725150", "4-218698_1_AL", "5-220939_1_AL", "1-220944_1_AL", "4-224769_1_AL", "4-226509_1_AL", "219281", "1505444"],
	"\u4e2d\u56fd": ["4-223955_1_AL", "4-221238_1_AL", "4-221241_1_AL", "4-220975_1_AL", "4-220976_1_AL", "2333845", "4-224935_1_AL", "1-219446_1_AL", "1-217744_1_AL", "1-226560_1_AL", "221623", "4-221659_1_AL", "4-221624_1_AL"],
	"\u56db\u56fd": ["1-224395_1_AL", "4-224352_1_AL", "4-223539_1_AL", "217238", "1-217236_1_AL", "4-226392_1_AL", "218601", "218617", "1-221183_1_AL"],
	"\u4e5d\u5dde": ["4-223544_1_AL", "1-224369_1_AL", "223545", "4-217320_1_AL", "4-217333_1_AL", "4-219768_1_AL", "1-219769_1_AL", "4-224706_1_AL", "1-219187_1_AL", "2333734", "10-219200_1_AL", "4-224428_1_AL", "1-218666_1_AL", "1-218650_1_AL", "5-224930_1_AL", "5-219398_1_AL", "4-219394_1_AL", "5-219395_1_AL", "4-224686_1_AL", "1-219035_1_AL", "2-219034_1_AL", "2333684", "1-218434_1_AL", "2-3492_1_POI_AL", "2333690", "218649"],
	"\u6c96\u7e04": ["1-224944_1_AL", "1-2012155_1_AL", "5-219499_1_AL", "1779977", "2333670", "219525", "219564"]
};

(function(DOC, areas, cityId, request, cites, tips) {
	var wrap = $("#weatherCityLayer"),
		area = $("#weatherCity_area"),
		city = $("#weatherCity_city"),
		btnSave = $("#weatherCity_save"),
		btnCancel = $("#weatherCity_cancel"),
		parent = $("#selectWeatherCity").parent(),
		
		//record the init seleted
		initAreaSelect,
		initCityIdx,
		
		hide = function() {
			parent.removeClass("city-click");
			wrap.hide();
		},
		render = function(data, el, value, innerHTML) {
			var temp = document.createDocumentFragment(),
				node = document.createElement("OPTION");
				
			$.each(data, function(key, val) {
				node = node.cloneNode(false);
				node.value = value ? value(val, key) : key;
				node.innerHTML = innerHTML ? innerHTML(val, key) : key;
				temp.appendChild(node);
			});
			el.html("");
			el.css("zoom", "1");
			el[0].appendChild(temp);
		};
	//hide when click blank space
	$(DOC).on("click", function(e) {
		var el = e.target;
		wrap.css("display") === "block" && el !== $("#selectWeatherCity")[0] && el !== wrap[0] && !jQuery.contains(wrap[0], el) && hide();
	});
	
	$(btnSave).on("click", function() {
		var val = city.val() || cityId;
		
		//updata cityId before request
		Gl.weather.cityId = val;
		
		request();
		
		if(navigator.cookieEnabled) {
			hide();
			$.cookie("weatherCity", null);
			$.store("weatherCity", val, {expires: 2000});
			
			initAreaSelect = area[0].options[area[0].selectedIndex];
			initCityIdx = city[0].selectedIndex;
		} else {
			alert(tips["nocookie"]);
		}
	});
	
	$(btnCancel).on("click", function() {
		hide();
		
		//reset select
		initAreaSelect && (initAreaSelect.selected = true);
		render(areas[initAreaSelect.value], city, function(val, key) {
			return val;
		}, function(val, key) {
			return cites[val];
		});
		
		initCityIdx && city[initCityIdx] && (city[initCityIdx].selected = true);
	});
	
	btnSave.on("mousedown", function() {
		btnSave.addClass("mod-btn_normal_click");
	});
	
	btnSave.on("mouseup", function() {
		btnSave.removeClass("mod-btn_normal_click");
	});
	
	btnSave.on("mouseout", function() {
		btnSave.removeClass("mod-btn_normal_click");
	});
	
	btnCancel.on("mousedown", function() {
		btnCancel.addClass("mod-btn_cancel_click");
	});
	
	btnCancel.on("mouseup", function() {
		btnCancel.removeClass("mod-btn_cancel_click");
	});
	
	btnCancel.on("mouseout", function() {
		btnCancel.removeClass("mod-btn_cancel_click");
	});
	
	btnSave.button();
	btnCancel.button();
	//render area.select
	render(areas, area);
	
	//there used double "setTimeout" to fixed IE6 render thread bug, fuck!!
	setTimeout(function() {
		//reset the area.select's selected by cityId
		cityId && $.each(area.children("option"), function(n, val) {
			if(areas[val.value].join().indexOf(cityId) > -1) {
				val.selected = true;
				initAreaSelect = val;
				return false;
			}
		});
		//render city.select
		render(areas[area.val()], city, function(val, key) {
			return val;
		}, function(val, key) {
			return cites[val];
		});
		setTimeout(function() {
			//reset the city.select's selected by cityId
			cityId && $.each(city[0].options, function(n, val) {
				if(val.value === cityId) {
					val.selected = true;
					initCityIdx = city.selectedIndex;
					return false;
				}
			});
			area.on("change", function() {
				render(areas[area.val()], city, function(val, key) {
					return val;
				}, function(val, key) {
					return cites[val];
				});
			});
		}, 16);
	}, 16);
})(document, conf.weatherArea, Gl.weather.cityId, Gl.weather.requestData, conf.weatherCity, conf.weather.tips);