window.conf || (window.conf = {});
var $ = require('common:widget/ui/jquery/jquery.js');
require('common:widget/ui/jquery/widget/jquery.ui.button/jquery.ui.button.js');  //jquery.UI

conf.weatherArea = {
	"United Arab Emirates": ["4-321626_1_AL", "323091", "8-1280745_1_AL"],
	"Egypt": ["9-127164_1_AL", "6-207321_1_AL", "12-127047_1_AL", "4-130201_1_AL", "6-127335_1_AL", "5-127358_1_AL", "15-126919_1_AL", "126996", "7-127484_1_AL", "5-127330_1_AL", "3-127049_1_AL", "3-126883_1_AL", "129332"],
	"Saudi Arabia": ["4-297030_1_AL", "3-299429_1_AL", "3-299427_1_AL", "5-296807_1_AL"],
	"Morocco": ["2-245072_1_AL", "4-6368_1_AL", "2-243353_1_AL", "3-244231_1_AL"],
	"Tunisia": ["1135733", "320522", "317198"],
	"Algeria": ["1888491", "2115"],
	"Lebanon": ["3-227342_1_AL", "3-230555_1_AL"],
	"Syria": ["3-314446_1_AL", "3-313468_1_AL", "3-313556_1_AL"],
	"Kuwait": ["13-222056_1_AL"],
	"Qatar": ["4-271669_1_AL"],
	"Bahrain": ["6-29687_1_AL"],
	"Oman": ["3-258638_1_AL", "4-258843_1_AL"],
	"Jordan": ["2-221790_1_AL", "14-221898_1_AL"]
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