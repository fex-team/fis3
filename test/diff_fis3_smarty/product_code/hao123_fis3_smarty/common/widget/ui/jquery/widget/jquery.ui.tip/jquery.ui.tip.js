/*!
 *  moliniao@baidy.com
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *  jquery.ui.button.js
 *	jquery.ui.position.js
 */

var jQuery = require("common:widget/ui/jquery/jquery.js");
require("common:widget/ui/jquery/widget/jquery.ui.position/jquery.ui.position.js");
require("common:widget/ui/jquery/widget/jquery.ui.button/jquery.ui.button.js");

(function( $, undefined ) {

var uiTipClasses =
		'ui-tip ' +
		'ui-widget ' +
		'ui-widget-content ' +
		'ui-corner-all ';

$.widget("ui.tip", {
	options: {
		autoOpen: false,
		ativeObj: null,
		buttons: {},
		closeOnEscape: true,
		fireEnter: false,
		tipClass: '',
		hide: null,
		height: 'auto',
		content:false,
		maxHeight: false,
		maxWidth: false,
		minHeight: 150,
		minWidth: 150,
		edgeOffset: 5,
		arrow:'arrow',
		arrowBg:'arrow_bg',
		autoPosition: 'true',
		defaultPosition: "top",
		position: {
			my: 'center',
			at: 'center',
			collision: 'fit',
			// ensure that the titlebar is never outside the document
			using: function(pos) {
				var topOffset = $(this).css(pos).offset().top;
				if (topOffset < 0) {
					$(this).css('top', pos.top - topOffset);
				}
			}
		},
		show: null,
		stack: true,
		title: '',
		width: 300,
		zIndex: 1000
	},

	_create: function() {
		var self = this,
			options = self.options,
			uiTip = (self.uiTip = $('<div></div>'))
				.appendTo(document.body)
				.hide()
				.addClass(uiTipClasses + options.tipClass)
				.css({
					zIndex: options.zIndex
				})
				// setting tabIndex makes the div focusable
				// setting outline to 0 prevents a border on focus in Mozilla
				.attr('tabIndex', -1).css('outline', 0).keydown(function(event) {
					if (options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode &&
						event.keyCode === $.ui.keyCode.ESCAPE) {
						
						self.close(event);
						event.preventDefault();
					}
					//按回车触发的事件 
					if (options.fireEnter && !event.isDefaultPrevented() && event.keyCode &&
						event.keyCode === $.ui.keyCode.ENTER) {
						$("button", uiTip).get(0).focus();
					}
				})
				.attr({
					role: 'tip',
					id : options.id || null
				}),
				//提示箭头
			uiTipArrow = ( self.arrow = $("<div class=" + options.arrow + ">" +"<div class=" + options.arrowBg +"></div>"+"</div>") )
						.appendTo(uiTip),
			uiTipContent = self.element
				.show()
				.addClass(
					'ui-tip-content ' +
					'ui-widget-content')
				.appendTo(uiTip);
		self.parent = options.id ? $("#"+options.id): $(document);
		self._createButtons(options.buttons);
		self._isOpen = false;
	},

	_init: function() {
		if ( this.options.autoOpen ) {
			this.open();
		}
	},

	destroy: function() {
		var self = this;
		self.uiTip.hide();
		self.element
			.unbind('.tip')
			.removeData('tip')
			.removeClass('ui-tip-content ui-widget-content')
			.hide().appendTo('body');
		self.uiTip.remove();

		if (self.originalTitle) {
			self.element.attr('title', self.originalTitle);
		}

		return self;
	},

	widget: function() {
		return this.uiTip;
	},

	close: function(event) {
		var self = this,
			maxZ, thisZ;
		
		if (false === self._trigger('beforeClose', event)) {
			return;
		}

		self.uiTip.unbind('keypress.ui-tip');

		self._isOpen = false;

		if (self.options.hide) {
			self.uiTip.hide(self.options.hide, function() {
				self._trigger('close', event);
			});
		} else {
			self.uiTip.hide();
			self._trigger('close', event);
		}


		// adjust the maxZ to allow other modal tips to continue to work (see #4309)
		if (self.options.modal) {
			maxZ = 0;
			$('.ui-tip').each(function() {
				if (this !== self.uiTip[0]) {
					thisZ = $(this).css('z-index');
					if(!isNaN(thisZ)) {
						maxZ = Math.max(maxZ, thisZ);
					}
				}
			});
			$.ui.tip.maxZ = maxZ;
		}

		return self;
	},

	isOpen: function() {
		return this._isOpen;
	},

	// the force parameter allows us to move modal tips to their correct
	// position on open
	moveToTop: function(force, event) {
		var self = this,
			options = self.options,
			saveScroll;

		if ((options.modal && !force) ||
			(!options.stack && !options.modal)) {
			return self._trigger('focus', event);
		}

		if (options.zIndex > $.ui.tip.maxZ) {
			$.ui.tip.maxZ = options.zIndex;
		}
	
		//Save and then restore scroll since Opera 9.5+ resets when parent z-Index is changed.
		//  http://ui.jquery.com/bugs/ticket/3193
		saveScroll = { scrollTop: self.element.scrollTop(), scrollLeft: self.element.scrollLeft() };
		$.ui.tip.maxZ += 1;
		self.uiTip.css('z-index', $.ui.tip.maxZ);
		self.element.attr(saveScroll);
		self._trigger('focus', event);

		return self;
	},

	open: function() {
		if (this._isOpen) { return; }

		var self = this,
			options = self.options,
			uiTip = self.uiTip;
	
		
		uiTip.show(options.show);
			//是否自动定位
		if ( options.autoPosition && options.ativeObj) {
			self._autoPosition( options.ativeObj );
		} else {
			self._position(options.position);
		}
		self.moveToTop(true);


		// set focus to the first tabbable element in the content area or the first button
		// if there are no tabbable elements, set focus on the tip itself

		uiTip.eq(0).focus();
		self._isOpen = true;
		self._trigger('open');

		return self;
	},

	_createButtons: function(buttons) {
		var self = this,
			hasButtons = false,
			uiTipButtonPane = $('<div></div>')
				.addClass(
					'ui-tip-buttonpane ' +
					'ui-widget-content ' +
					'ui-helper-clearfix'
				),
			uiButtonSet = $( "<div></div>" )
				.addClass( "ui-tip-buttonset" )
				.appendTo( uiTipButtonPane );

		// if we already have a button pane, remove it
		self.uiTip.find('.ui-tip-buttonpane').remove();

		if (typeof buttons === 'object' && buttons !== null) {
			$.each(buttons, function() {
				return !(hasButtons = true);
			});
		}
		if (hasButtons) {
			$.each(buttons, function(name, props) {
				props = $.isFunction( props ) ?
					{ click: props, text: name } :
					props;
				var button = $('<span></span>')
					.click(function() {
						props.click.apply(self.element[0], arguments);
					})
					.appendTo(uiButtonSet);
				// can't use .attr( props, true ) with jQuery 1.3.2.
				$.each( props, function( key, value ) {
					if ( key === "click" ) {
						return;
					}
					if ( key in button ) {
						button[ key ]( value );
					} else {
						button.attr( key, value );
					}
				});
				if ($.fn.button) {
					button.button();
				}
			});
			uiTipButtonPane.appendTo(self.uiTip);
		}
	},
	_minHeight: function() {
		var options = this.options;

		if (options.height === 'auto') {
			return options.minHeight;
		} else {
			return Math.min(options.minHeight, options.height);
		}
	},

	_position: function(position) {
		var myAt = [],
			offset = [0, 0],
			isVisible;

		if (position) {
			// deep extending converts arrays to objects in jQuery <= 1.3.2 :-(
	//		if (typeof position == 'string' || $.isArray(position)) {
	//			myAt = $.isArray(position) ? position : position.split(' ');

			if (typeof position === 'string' || (typeof position === 'object' && '0' in position)) {
				myAt = position.split ? position.split(' ') : [position[0], position[1]];
				if (myAt.length === 1) {
					myAt[1] = myAt[0];
				}

				$.each(['left', 'top'], function(i, offsetPosition) {
					if (+myAt[i] === myAt[i]) {
						offset[i] = myAt[i];
						myAt[i] = offsetPosition;
					}
				});

				position = {
					my: myAt.join(" "),
					at: myAt.join(" "),
					offset: offset.join(" ")
				};
			} 

			position = $.extend({}, $.ui.tip.prototype.options.position, position);
		} else {
			position = $.ui.tip.prototype.options.position;
		}

		// need to show the tip to get the actual offset in the position plugin
		isVisible = this.uiTip.is(':visible');
		if (!isVisible) {
			this.uiTip.show();	
		}
		this.uiTip
			// workaround for jQuery bug #5781 http://dev.jquery.com/ticket/5781
			.css({ top: 0, left: 0 })
			.position($.extend({ of: window }, position));
		if (!isVisible) {
			this.uiTip.hide();
		}
	},
	_autoPosition: function( ativeObj ){
		var tiptip_holder = this.uiTip,
			tiptip_arrow = this.arrow,
			opts = this.options,
			defaultPosition = opts.defaultPosition,
		 	top = parseInt(ativeObj.offset()['top']),
		 	left = parseInt(ativeObj.offset()['left']),
		 	org_width = parseInt(ativeObj.outerWidth()),
		 	org_height = parseInt(ativeObj.outerHeight()),
		 	tip_w = tiptip_holder.outerWidth(),
		 	tip_h = tiptip_holder.outerHeight(),
			tip_pos = {
				bottom:{
	  				my: "center top",
	  				at: "center bottom",
	  				of: ativeObj,
	  				collision:"fit",
	  				offset:"0 +" + org_height,
	  				arrow:{
	  					my: "center bottom",
		  				at: "center top",
		  				offset: "0 +" + org_height/2,
		  				of: tiptip_holder
	  				}
				},
				top:{
	  				my: "center bottom",
	  				at: "center top",
	  				of: ativeObj,
	  				collision:"fit",
	  				offset: "0 -" + org_height,
	  				arrow:{
	  					my: "center bottom",
	  					at: "center top",
	  					offset: "0 " + org_height/2,
	  					of: ativeObj
	  				}
				},
				left:{
	  				my: "right center",
	  				at: "left center",
	  				of: ativeObj,
	  				arrow:{
	  					my: "left  center",
	  					at: "right center",
	  					of: tiptip_holder
	  				}
				},
				right:{
					my: "left top",
	  				at: "right top",
	  				of: ativeObj,
	  				arrow:{
		  					my: "right  bottom",
			  				at: "left top",
			  				of: tiptip_holder
	  				}
				}
			};
					//判断是否出现滚动条
		tiptip_holder.position(tip_pos[defaultPosition]);
		$(".arrow",this.parent).position(tip_pos[defaultPosition]["arrow"]);
		isVisible = this.uiTip.is(':visible');
		if (!isVisible) {
			this.uiTip.show();
		}
		if (!isVisible) {
			this.uiTip.hide();
		}
				
	},
	_setOption: function(key, value){
		var self = this,
			uiTip = self.uiTip;

		switch (key) {
			//handling of deprecated beforeclose (vs beforeClose) option
			//Ticket #4669 http://dev.jqueryui.com/ticket/4669
			//TODO: remove in 1.9pre
			case "beforeclose":
				key = "beforeClose";
				break;
			case "buttons":
				self._createButtons(value);
				break;
			case "closeText":
				// ensure that we always pass a string
				self.uiTipTitlebarCloseText.text("" + value);
				break;
			case "tipClass":
				uiTip
					.removeClass(self.options.tipClass)
					.addClass(uiTipClasses + value);
				break;
			case "disabled":
				if (value) {
					uiTip.addClass('ui-tip-disabled');
				} else {
					uiTip.removeClass('ui-tip-disabled');
				}
				break;
			case "position":
				self._position(value);
				break;
			case "title":
				// convert whatever was passed in o a string, for html() to not throw up
				$(".ui-tip-title", self.uiTipTitlebar).html("" + (value || '&#160;'));
				break;
		}

		$.Widget.prototype._setOption.apply(self, arguments);
	}
});


}(jQuery));
