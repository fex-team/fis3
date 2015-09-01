var app = require("lv2:widget/ui/spark-app/spark-app.js");

var con    = conf.shopping,
    _ajxDa = con.ajaxData;

_ajxDa && (conf.shopping.ajaxConf = {
	dataType: _ajxDa.type,
	data: _ajxDa.params,
	jsonp: _ajxDa.callback,
	url: _ajxDa.api || conf.apiUrlPrefix
});

con.format = _ajxDa ? function(data) {
	if(data && data["content"]) {
		data = data["content"]["data"];
	} else {
		return [];
	}

	var newData = [],
	    maxTime = parseInt(con.maxTime, 10),
	    obj, len, product;

	len = Math.min(data.length, parseInt(con.per, 10));

	for (var i = 0; i < len; i++) {
		product = data[i].products;
		if (!product) continue;
		for (var j = 0, l = Math.min(maxTime, product.length); j < l; j++) {
			obj = product[j];
			newData.push({
				title: obj["prodtitle"] || "",
				name: obj["prodtitle"] || "",
				price: obj["prodprice"] || "",
				url: obj["produrl"] || "",
				src: obj["prodimg"] || ""
			});
		}
	}
	return newData;
}: function(data) {
	var newData = [],
	    conMax  = parseInt(con.maxTime, 10) * parseInt(con.per, 10),
	    obj,
	    len;
	data = data;
	len = Math.min(data.length, conMax);
	for(var i = 0; i < len; i++) {
		obj = data[i];
		newData.push({
			title: obj["name"] || "",
			name: obj["name"] || "",
			price: obj["price"] || "",
			url: obj["url"] || "",
			src: obj["imgSrc"] || ""
		});
	}
	return newData;
};
new app(con, "spark-shopping");