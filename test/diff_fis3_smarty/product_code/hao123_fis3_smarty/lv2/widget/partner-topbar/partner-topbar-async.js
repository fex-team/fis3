var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var helper = require('common:widget/ui/helper/helper.js');

var wrap = $("#topBarPar"),
    form = wrap.find(".form"),
    $searchInput = $("#searchInput");
var config = $.extend({
	"id": "google"
}, conf.partnerSearch);

var tns = helper.getQuery()["tn"],
    addTn = function($obj, url, tns) {
    	if (url.indexOf("tn=") > -1) {
    		return;
    	}
    	$obj.attr("href", url + (url.indexOf("?") > -1 ? "&" : "?") + "tn=" + tns); 
    };
    
if(tns) {
	wrap.on("mousedown", "a", function(e) {
		var $that = $(this);
		addTn($that, $that.attr("href"), tns);
	});
}

wrap.on("mousedown", "a", function(e) {
	var that = $(this);
	if(that.closest('.logo').length) {
		UT.send({
			modId: 'partner-topbar',
			position: 'logo',
			sort: that.attr('href'),
			type: 'others'
		});
	} else if (that.closest('.list').length) {
		UT.send({
			modId: 'partner-topbar',
			position: 'content',
			sort: that.attr('href'),
			type: 'others'
		});
	}
	e.stopPropagation();
});
form.on("submit", function() {
	UT.send({
		modId: 'partner-topbar',
		position: 'search',
		engine: config.id,
		tab: 'web',
		element: 'input',
		value: encodeURIComponent($.trim($searchInput.val())),
		type: 'others'
	});
});
wrap.find(".in").on("focus", function() {
	form.addClass("form-focus");
}).on("blur", function() {
	form.removeClass("form-focus");
});