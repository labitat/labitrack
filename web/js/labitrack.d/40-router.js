(function(){
	var r = λ.r = new Backbone.Router();

	function handle_click(event) {
		if (!Modernizr.history) return true;
		event.preventDefault();
		var href = $(event.target).attr('href');
		var curpath = window.location.pathname;
		if (href !== undef && href[0] === '/') {
			if (curpath === href) {
				console.log('ignoring click event for', href);
				return;
			}
			Backbone.history.navigate(href, true);
		}
	}

	var mainview = Backbone.View.extend({
		events: {
			'click a': 'handleClick'
		},
		handleClick: handle_click,
		initialize: function(){
			_(this).bindAll('handleClick', 'render');
		}
	});
	$(function(){
		new mainview({el: document.body});
	});

	var view = Backbone.View.extend({
		el: '#tmplcontent',
		events: {
			'click a': 'handleClick'
		},
		handleClick: handle_click,
		initialize: function(){
			_(this).bindAll('handleClick', 'render');
		}
	});

	function route_handler()
	{
		var t = this;
		if (t.instance === undef) {
			t.instance = new t();
		}
		t.instance.render.apply(t.instance, arguments);
	};

	view.route = function(route, name)
	{
		name || (name = route);
		var t = this;
		λ.r.route(route, name, function(){
			λ.topbar.update();
			route_handler.apply(t, arguments);
		});
	};

	λ.routableview = view;
}());
