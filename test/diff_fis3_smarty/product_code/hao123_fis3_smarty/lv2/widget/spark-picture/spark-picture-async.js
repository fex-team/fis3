var app = require("lv2:widget/ui/spark-app/spark-app.js");

var con    = conf.picture,
    _ajxDa = con.ajaxData;
    
conf.picture.ajaxConf = {
	dataType: _ajxDa.type,
	data: _ajxDa.params,
	jsonp: _ajxDa.callback,
	url: _ajxDa.api
};
con.filter = function(data, max, per) {
	var bigImg = [],
	    smaImg = [],
	    tmpObj = {},
	    newData = [],
	    len    = 0,
	    quot   = 0,
	    rema   = 0;
	for(var i = 0, j = data.length; i < j; i++) {
		tmpObj = data[i];
		if(parseInt(tmpObj["height"], 10) > parseInt(tmpObj["width"], 10)) {
			bigImg.push({
				styl: "i-big",
				title: tmpObj["title"] || "",
				url: tmpObj["from_url"] || "",
				src: tmpObj["img_url"] || ""
			});
		} else {
			smaImg.push({
				styl: "i-small",
				title: tmpObj["title"] || "",
				url: tmpObj["from_url"] || "",
				src: tmpObj["img_url"] || ""
			});
		}
	}

	len = Math.min(max, bigImg.length, Math.ceil(smaImg.length / 4));
	for(var m = 0, n = len * per; m < n; m++) {
		quot   = Math.floor(m / per),
	    rema   = m % per;
		if(rema === 0) {
			bigImg[quot] && newData.push(bigImg[quot]);
		} else {
			smaImg[m - 1 - quot] && newData.push(smaImg[m - 1 - quot]);
		}
	}
	return newData;
};
con.format = function(data) {
	return con.filter(data.data, parseInt(con.maxTime, 10), parseInt(con.per, 10));
};
new app(con, "spark-picture");