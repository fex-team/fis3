var $ = require("common:widget/ui/jquery/jquery.js");

/* tn matching fuction for middle page */
var middleInit = function() {
	window.conf || (window.conf = {});

	;;(function() {
		var tn = window.location.search.match(/(^|&|\\?)tn=([^&]*)(&|$)/i),
			downloadBtn = $("#downloadBtn"),
			_conf = conf.tnToUrl;

		tn = tn === null ? "" : tn[2];
		if (_conf) {
			$.each(_conf, function(key, val) {
				if (key === tn) {
					downloadBtn.attr("href", val);
					return;
				}
			});
		}

	})();
};

module.exports = middleInit;