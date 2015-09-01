var $ = require('common:widget/ui/jquery/jquery.js');

var nav = function(){
	var navOption = {
		$wrap: $('.mod-simple-nav'),
		logoNotice: conf.logoNotice
	};
	$.extend(this, navOption);
	this.init();
};
nav.prototype = {
	init: function(){
		this._bindEvents();
		this._initNotice();
	},
	_bindEvents: function(){
		var self = this;
		var $wrap = self.$wrap;
		var cookieRedirect = conf.cookieRedirect;

		$wrap.on('click', '.nav-href', function() {
			var _this = $(this);
			var cookieName = "";
			for(var key in cookieRedirect){
				cookieName = key;
			}
			if (self._cookie(cookieName)) {
				self._cookie(cookieName,'',{expires: 400});
			}
			if(self._cookie('newUser') == '0'){
				self._cookie('newUser','1',{expires: 400});
			}
			
			window.location.reload();
			UT.send({
				type: "others",
				modId: "index-nav",
				sort: _this.data('ut')
			});

		});
	},
	_initNotice: function(){
		var self = this;
		var $wrap = self.$wrap;
		var logoNotice = self.logoNotice;
		if (logoNotice.text) {
			var key = "simpleBackTips";
			if (self._cookie(key) !== 'off') {
				var tpl = [
					'<div class="logo-notice">',
						'<div class="inner nav-href" data-url="' + logoNotice.url + '" data-ut="' + logoNotice.ut + '">',
							'<i class="arrow-border"></i>',
							'<i class="arrow"></i>',
							'<p class="notice-link">',
								'<span>' + logoNotice.text + '</span>',
								'<i class="notice-close"></i>',
							'</p>',
						'</div>',
					'</div>'
				].join('');
				var $navItem = $wrap.find('.nav-item');
				$navItem.eq(~~logoNotice.index).append(tpl);

				var $logoNotice = $wrap.find('.logo-notice');
				var $logoUl = $wrap.find('ul');
				$logoNotice.show();
				$logoUl.removeClass('nav-wrap');

				$wrap.on('click', '.notice-link', function() {
					self._cookie(key, 'off',{expires: 400});
					$logoUl.addClass('nav-wrap');
					$logoNotice.hide();
				});
				$wrap.on('mousedown', '.notice-close', function(e) {
					e.stopPropagation();
					UT.send({
						type: "others",
						modId: "simple-nav",
						sort: 'close'
					});
					self._cookie(key, 'off',{expires: 400});
					$logoNotice.hide();
					$logoUl.addClass('nav-wrap');

				});
			}
		}
	},
	_cookie: function(key, value, options) {

	    // key and value given, set cookie...
	    if (arguments.length > 1 && (value === null || typeof value !== "object")) {
	        //options = jQuery.extend({}, options);

	        if (value === null) {
	            options.expires = -1;
	        }
	        if (typeof options.expires === 'number') {
	            var days = options.expires,
	                t = options.expires = new Date();
	            t.setDate(t.getDate() + days);
	        }
	        return (document.cookie = [
	            encodeURIComponent(key), '=',
	            options.raw ? String(value) : encodeURIComponent(String(value)),
	            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
	            options.path ? '; path=' + options.path : '',
	            options.domain ? '; domain=' + options.domain : '',
	            options.secure ? '; secure' : ''
	        ].join(''));
	    }
	    // key and possibly options given, get cookie...
	    options = value || {};
	    var result, decode = options.raw ? function(s) {
	            return s;
	        } : decodeURIComponent;
	    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
	}

};

module.exports = new nav();