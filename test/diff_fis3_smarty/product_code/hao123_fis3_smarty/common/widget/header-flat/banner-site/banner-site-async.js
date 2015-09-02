var $      = require("common:widget/ui/jquery/jquery.js");
var UT     = require("common:widget/ui/ut/ut.js");
var helper = require("common:widget/ui/helper/helper.js");


var TPL  = '<a class="hd-item #{className}" style="background-image: url(#{bgImg});" href="#{url}" title="#{title}"></a>',
    TPL2 = '<a class="hd-item #{className}" href="#{url}" title="#{title}"></a>';

var DATA = conf.bannerSite["data"] || {};

var fire = function(id) {
	var $wrap = $(id), _frag = "";

	var i = 0, j = DATA.length, t = {};

	if($wrap.length && j) {

		for(; i < j; i++) {
			t = DATA[i];

			if (!t["url"]) {
				return;
			}
			
			(i === 0) && (t["className"] += " item-first");

			_frag += helper.replaceTpl(((t && t["bgImg"]) ? TPL : TPL2), t);
		}

		$wrap.html(_frag);

		$wrap.on("click", "a", function() {
			UT.send({
				"modId": "banner-site",
				"type": "click",
				"position": "site",
				"sort": $(this).attr("href")
			});
		});
	}
};

module.exports = fire;