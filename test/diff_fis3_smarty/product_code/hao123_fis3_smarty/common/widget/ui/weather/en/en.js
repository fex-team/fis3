window.conf || (window.conf = {});
var $ = require('common:widget/ui/jquery/jquery.js');
require('common:widget/ui/jquery/widget/jquery.ui.button/jquery.ui.button.js');  //jquery.UI

conf.weatherArea = {"\u81fa\u5317":["zmw:00000.1.58968"],"\u81fa\u4e2d\u5e02":["zmw:00000.1.46751"],"\u81fa\u5357\u7e23":["zmw:00000.1.59358"],"\u9ad8\u96c4\u7e23":["zmw:00000.1.46740","zmw:00000.1.46745"],"\u57fa\u9686\u5e02":["zmw:00000.2.46694"],"\u65b0\u7af9\u7e23":["zmw:00000.1.46756"],"\u5609\u7fa9\u7e23":["zmw:00000.1.46746"],"\u6843\u5712\u7e23":["zmw:00000.1.58965"],"\u5c4f\u6771\u7e23":["zmw:00000.1.46750","zmw:00000.1.59559"],"\u5b9c\u862d\u7e23":["zmw:00000.1.59162","zmw:00000.1.46706"],"\u82b1\u84ee\u7e23":["zmw:00000.3.59362"],"\u81fa\u6771\u7e23":["zmw:00000.1.59562","zmw:00000.1.46754"]}

;;(function(DOC, areas, cityId, request, cites, tips) {
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