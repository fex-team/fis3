module.exports = exports = {
	/**
	 * 全局data
	 */
	data: function() {
		var self = $("body");
		return self.data.apply(self, arguments);
	},

	_mediators: {},

	mediator: {
		on: function(name, callback) {
			var mediators = exports._mediators;

			if (typeof name === 'string') {
				name = [name];
			}

			$.each(name, function(i, item) {
				if(!mediators[item]){
					mediators[item] = $.Callbacks();
				}

				mediators[item].add(callback);
			});

		},

		un: function(name, callback) {
			var mediators = exports._mediators;

			if (typeof name === 'string') {
				name = [name];
			}

			$.each(name, function(i, item) {
				if(mediators[item]){
					mediators[item].remove(callback);
				}
			});
		},
		
		fire: function(name, data) {
			var mediators = exports._mediators;

			if (typeof name === 'string') {
				name = [name];
			}

			$.each(name, function(i, item) {
				if(mediators[item]){
					mediators[item].fire(data);
				}
			});
		}
	}

};
