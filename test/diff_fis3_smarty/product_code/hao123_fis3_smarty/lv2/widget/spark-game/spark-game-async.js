var app = require("lv2:widget/ui/spark-app/spark-app.js");
var helper = require('common:widget/ui/helper/helper.js');
var UT = require('common:widget/ui/ut/ut.js');
var $ = require('common:widget/ui/jquery/jquery.js');

var con    = conf.game,
    _ajxDa = con.ajaxData;
    
conf.game.ajaxConf = {
	dataType: _ajxDa.type,
	url: _ajxDa.api
};
if(_ajxDa.callback) {
	conf.game.ajaxConf.jsonp  = _ajxDa.callback;
}
if(_ajxDa.params) {
	conf.game.ajaxConf.data = _ajxDa.params;
}
con.format = function(data) {
	var newData = [],
	    conMax  = parseInt(con.maxTime, 10) * parseInt(con.per, 10),
	    obj,
	    len;
	len = Math.min(data.length, conMax);
	for(var i = 0; i < len; i++) {
		obj = data[i];
		newData.push({
			title: obj["name"] || "",
			url: obj["url"] || "",
			src: obj["imgSrc"] || "",
			name: obj["name"] || ""
		});
	}
	return newData;
};
new app(con, "spark-game");


/*支持手动配置和api组合*/

var moreCon  = con.moreContent,
    str      = '',
    $wra     = null,
    _itemTpl = '<a class="more-list" title="#{title}" href="#{url}" style="background-image: url(#{icon});">#{title}</a>';

if (moreCon && moreCon.length) {
	for (var m = 0, n = moreCon.length; m < n; m++) {
		str += helper.replaceTpl(_itemTpl, moreCon[m]);
	}

	$wra = $("#gameMoreContent");
	$wra.html(str);
	$wra.on("click", "a", function(e) {
		UT.send({
			modId: "spark-game",
			position: "content"
		});
	});
}