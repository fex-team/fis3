var $ = require("common:widget/ui/jquery/jquery.js");

var CON        = conf.headerTest,
    isScrolled = false,
    fixedClass = "header-fixed" + (CON.ceilingMore === "1" ? " header-fixed-up" : " header-fixed-st"),
    $head      = $("#top"),
    $win       = $(window),
    $doc       = $(document),
    $body      = $(document.body),
    initHeight = $head.parent().outerHeight(),
    curHeight  = 0;

setTimeout(function() {
	//吸顶
	if (CON.isCeiling === "1") {
		$win.on("scroll", function() {
			isScrolled = true;
		});

		window.setTimeout(function() {
			if (isScrolled) {
				isScrolled = false;
				curHeight = initHeight;

				if ($doc.scrollTop() > curHeight) {
					if (!$body.hasClass(fixedClass)) {
						$head.css("position", "fixed");
						$body.addClass(fixedClass);
						if (CON.ceilingMore === "1") {
							$win.trigger("headerFixed.transTo");
							$win.trigger("headerFixed.changed");
						}
					}
				} else {
					if ($body.hasClass(fixedClass)) {
						$head.css("position", "relative");
						$body.removeClass(fixedClass);
						if (CON.ceilingMore === "1") {
							$win.trigger("headerFixed.restore");
							$win.trigger("headerFixed.changed");
						}
					}
				}
			}
			window.setTimeout(arguments.callee, 250);
		}, 250);
	}
}, 1000);