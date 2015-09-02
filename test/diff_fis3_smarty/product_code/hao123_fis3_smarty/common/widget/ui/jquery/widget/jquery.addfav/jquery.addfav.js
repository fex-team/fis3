/*
* jQuery Add Favorite Plugin
*
* @Frank Feng
*/


var jQuery = require("common:widget/ui/jquery/jquery.js");

jQuery.fn.extend({
	addfav: function (addFavText, url, title) {
		if (!url) {
			if (this.length === 0) {
				url = window.location.href;
			} else {
				url = this.attr("href") || this.parent().attr("href");
				if(/^\//.test(url)) {
					url = window.location.protocol + "//" + window.location.host + url;
				}
			}
		}
		title = title || document.title;
		addFavText = addFavText || "An error has occurred, please use keyboard shortcuts: Ctrl+D to bookmark this page.";
		try {
            window.external.AddFavorite(url, title);
        } catch(e) {
			try{
				el.setAttribute("rel", "sidebar"); obj.title = title; obj.href = url;
			} catch(e) {
				alert(addFavText);
			}
        }
        return this;
	}
});