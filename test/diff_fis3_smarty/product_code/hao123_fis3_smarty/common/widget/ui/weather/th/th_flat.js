window.conf || (window.conf = {});
var $ = require('common:widget/ui/jquery/jquery.js');
require('common:widget/ui/jquery/widget/jquery.ui.button/jquery.ui.button.js');  //jquery.UI

conf.weatherArea = {
	"\u0e20\u0e32\u0e04\u0e01\u0e25\u0e32\u0e07": ["4-318849_1_AL", "4-318418_1_AL", "1-319052_1_AL", "4-319602_1_AL", "2-320033_1_AL", "4-320049_1_AL", "4-320620_1_AL", "4-320626_1_AL", "1-320984_1_AL"],
	"\u0e20\u0e32\u0e04\u0e40\u0e2b\u0e19\u0e37\u0e2d": ["4-320984_1_AL", "2-318882_1_AL", "2-318901_1_AL", "319106", "3-319108_1_AL", "2-319733_1_AL", "2-319956_1_AL"],
	"\u0e20\u0e32\u0e04\u0e15\u0e30\u0e27\u0e31\u0e19\u0e2d\u0e2d\u0e01\u0e40\u0e09\u0e35\u0e22\u0e07\u0e40\u0e2b\u0e19\u0e37\u0e2d": ["2-317465_1_AL", "4-318585_1_AL", "3-318607_1_AL", "2-319038_1_AL", "4-319122_1_AL", "2-319494_1_AL", "4-319629_1_AL", "5-319817_1_AL", "4-320359_1_AL", "4-321409_1_AL", "7-321441_1_AL"],
	"\u0e20\u0e32\u0e04\u0e15\u0e30\u0e27\u0e31\u0e19\u0e2d\u0e2d\u0e01": ["1-317584_1_AL", "2-317490_1_AL", "1-317582_1_AL", "1-320137_1_AL", "2-320337_1_AL"],
	"\u0e20\u0e32\u0e04\u0e43\u0e15\u0e49": ["4-319691_1_AL", "2-319761_1_AL", "2-320075_1_AL", "2-320938_1_AL", "3-320939_1_AL", "4-320998_1_AL", "4-5470_1_AL"],
	"\u0e20\u0e32\u0e04\u0e15\u0e30\u0e27\u0e31\u0e19\u0e15\u0e01": ["3-320151_1_AL", "2-318443_1_AL", "318455", "2-320001_1_AL", "4-320150_1_AL"]
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

		initAreaIndex,
		initCityIndex,

		_area = area.get(0),
		_areaOp = _area.getElementsByTagName("option"),
		
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

	var areasHash = (function(data, list) {
		var group = {};
		for(var pro in data) {
			if(data.hasOwnProperty(pro)) {
				group[pro] = [];
				for(var i = 0, j = data[pro].length; i < j; i++) {
					group[pro].push({
						"id": data[pro][i],
						"name": list[data[pro][i]]
					});
				}
			}
		}
		return group;
	})(areas, cites);

	//hide when click blank space
	$(DOC).on("click", function(e) {
		var el = e.target;
		wrap.css("display") === "block" && el !== $("#selectWeatherCity")[0] && el !== wrap[0] && !jQuery.contains(wrap[0], el) && hide();
	});
	
	$(btnSave).on("click", function() {
		var val = $("#weatherCity_cityPicker").attr("value") || cityId;
		
		//updata cityId before request
		Gl.weather.cityId = val;
		
		request();
		
		if(navigator.cookieEnabled) {
			hide();
			$.cookie("weatherCity", null);
			$.store("weatherCity", val, {expires: 2000});
			
		} else {
			alert(tips["nocookie"]);
		}
	});
	
	$(btnCancel).on("click", function() {
		hide();
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
				initAreaIndex = n;
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
					initCityIndex = n;
					initCityIdx = city.selectedIndex;
					return false;
				}
			});
			
			require.async("common:widget/ui/dropdownlist/dropdownlist.js", function(dropdown) {
				var cityDrop = new dropdown({
					selector: "weatherCity_city",
					defIndex: initCityIndex || 0,
					supportSubmit: 1,
					lineHeight: 40,
					customScrollbar: 1
				});
				var areaDrop = new dropdown({
					selector: "weatherCity_area",
					defIndex: initAreaIndex || 0,
					supportSubmit: 1,
					lineHeight: 40,
					customScrollbar: 1,
					child: cityDrop,
					onChange: function() {
						var that = this;
						that.child.reset(areasHash[_areaOp[_area.selectedIndex].value]);
					}
				});
			});
		}, 16);
	}, 16);
})(document, conf.weatherArea, Gl.weather.cityId, Gl.weather.requestData, conf.weatherCity, conf.weather.tips);