var Backbone, TodoView, todos, common, AppView;

var $ = require('jquery');
var _ = require('underscore');

Backbone = require('backbone');
common = require('common');
TodoView = require('../views/todos.js');
todos = require('../collections/todos.js');

AppView = Backbone.View.extend({

	el: '#todoapp',

	statsTemplate: __inline('/template/stats.tmpl'),

	events: {
		'keypress #new-todo': 'createOnEnter',
		'click #clear-completed': 'clearCompleted',
		'click #toggle-all': 'toggleAllComplete'
	},

	initialize: function () {
		this.allCheckbox = this.$('#toggle-all')[0];
		this.$input = this.$('#new-todo');
		this.$footer = this.$('#footer');
		this.$main = this.$('#main');

		this.listenTo(todos, 'add', this.addOne);
		this.listenTo(todos, 'reset', this.addAll);
		this.listenTo(todos, 'change:completed', this.filterOne);
		this.listenTo(todos, 'filter', this.filterAll);
		this.listenTo(todos, 'all', this.render);

		todos.fetch();
	},

	render: function () {
		var completed = todos.completed().length;
		var remaining = todos.remaining().length;

		if (todos.length) {
			this.$main.show();
			this.$footer.show();

			this.$footer.html(this.statsTemplate({
				completed: completed,
				remaining: remaining
			}));

			this.$('#filters li a')
				.removeClass('selected')
				.filter('[href="#/' + (common.TodoFilter || '') + '"]')
				.addClass('selected');
		} else {
			this.$main.hide();
			this.$footer.hide();
		}

		this.allCheckbox.checked = !remaining;
	},

	addOne: function (todo) {
		var view = new TodoView({ model: todo });
		$('#todo-list').append(view.render().el);
	},

	addAll: function () {
		this.$('#todo-list').html('');
		todos.each(this.addOne, this);
	},

	filterOne: function (todo) {
		todo.trigger('visible');
	},

	filterAll: function () {
		todos.each(this.filterOne, this);
	},

	newAttributes: function () {
		return {
			title: this.$input.val().trim(),
			order: todos.nextOrder(),
			completed: false
		};
	},

	createOnEnter: function (e) {
		if (e.which !== common.ENTER_KEY || !this.$input.val().trim()) {
			return;
		}

		todos.create(this.newAttributes());
		this.$input.val('');
	},

	clearCompleted: function () {
		_.invoke(todos.completed(), 'destroy');
		return false;
	},

	toggleAllComplete: function () {
		var completed = this.allCheckbox.checked;

		todos.each(function (todo) {
			todo.save({
				'completed': completed
			});
		});
	}
});

module.exports = AppView;