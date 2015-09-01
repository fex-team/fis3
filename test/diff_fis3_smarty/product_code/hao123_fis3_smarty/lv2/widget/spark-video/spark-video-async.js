var app = require("lv2:widget/ui/spark-app/spark-app.js");

var con    = conf.video,
    _ajxDa = con.ajaxData;
    
conf.video.ajaxConf = {
	dataType: _ajxDa.type,
	url: _ajxDa.api
};
con.format = function(data) {
	var newData = [],
	    conMax  = parseInt(con.maxTime, 10) * parseInt(con.per, 10),
	    obj,
	    len;
	len = Math.min(data.length, conMax);
	for(var i = 0; i < len; i++) {
		obj = data[i];
		newData.push({
			title: obj["title"] || "",
			url: obj["href"] || "",
			src: obj["imgsrc"] || "",
			name: obj["title"] || ""
		});
	}
	return newData;
};
new app(con, "spark-video");