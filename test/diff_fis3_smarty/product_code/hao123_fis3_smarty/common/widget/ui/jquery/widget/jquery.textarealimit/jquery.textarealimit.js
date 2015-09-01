/*
 * jQuery limit textarea's max length Plugin
 *
 * @Frank Feng
 */

var jQuery = require("common:widget/ui/jquery/jquery.js");

(function($) {
	$.fn.textarealimit = function() {
		var maxLength = $(this).attr("maxlength") || 10000;

		$(this).attr("maxlength", maxLength).bind("keypress.formTextarea paste.formTextarea", function(event) {

			if ($.browser.msie) {
				var $this = $(this);
				var currentLength = $this.val().length;
				var remainLength = maxLength - currentLength;
				var selectionLength = document.selection.createRange().text.length;


				if (event.type == 'keypress') {
					if (event.which > 32 && event.which < 127 && !event.metaKey && (remainLength <= 0) && selectionLength == 0) {
						return false;
					}
				} else if (event.type == 'paste') {
					var pasteText = window.clipboardData.getData('Text');
					if (currentLength - selectionLength + pasteText.length > maxLength) {
						window.clipboardData.setData('Text', pasteText.substring(0, maxLength - (currentLength - selectionLength)))
					}
				}
			}

		});
	}
})(jQuery);