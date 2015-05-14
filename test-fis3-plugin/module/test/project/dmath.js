define('math.js', function(require, exports, module) {
	var Math = function() {
		return {
			sum: function(a, b) {
				return (+a||0) + (+b||0);
			}
		}
	}
});