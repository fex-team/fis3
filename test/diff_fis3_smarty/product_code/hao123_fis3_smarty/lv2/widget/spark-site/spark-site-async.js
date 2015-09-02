var app = require("lv2:widget/ui/spark-app/spark-app.js");

var con    = conf.site;
con.format = function(data) {
	var newData = [],
	    conMax  = parseInt(con.maxTime, 10) * parseInt(con.per, 10),
	    obj,
	    len;
	data = data;
	len = Math.min(data.length, conMax);
	for(var i = 0; i < len; i++) {
		obj = data[i];
		newData.push({
			title: obj["title"] || "",
			url: obj["url"] || "",
			src: obj["imgSrc"] || ""
		});
	}
	return newData;
};
new app(con, "spark-site");