(function(){

	λ.labelform = function(opts){
		var model = opts.model;
		var canvas = $('#label')[0];
		var label = new λ.label();
		label.set_canvas(canvas);

		var rendertime = $('#rendertime');
		(label.trigger_refresh = function(){
			label.set_data(model.toJSON());
			label.render(function(data, ms){
				rendertime.text(ms);
			});
		})();

		var f = $('#labelform');
		function update_data(){
			var t = this;
			setTimeout(function(){
				var v = t.value;
				var foo = {};
				foo[t.name] = model.get(t.name);
				switch (t.type) {
				case 'text':
				case 'textarea':
					v = v.trim();
					if (v.length === 0) {
						v = $(t).attr('placeholder');
					}
					foo[t.name] = v.trim();
					break;
				case 'checkbox':
					var i = $.inArray(v, foo[t.name]);
					if (t.checked) {
						if (i === -1) {
							foo[t.name].push(t.value);
						}
					} else if (i !== -1) {
						foo[t.name].splice(i, 1);
					}
					break;
				}
				model.set(foo);
				label.trigger_refresh();
			}, 0);
		};
		f.find(':input').each(function (i,e){
			$(e).bind('keypress', update_data);
			$(e).bind('click', update_data);
			$(e).bind('change', update_data);
			update_data.apply(this);
		});

		print = null;

		submit_btn = f.find('button[type="submit"]');

		f.find('a#saveandprint').bind('click', function(){
			print = true;
			submit_btn.click();
		});

		f.find('a#justsave').bind('click', function(){
			print = false;
			submit_btn.click();
		});

		reset_btn = f.find('button[type="reset"]');

		f.find('a#reset').bind('click', function(){
			reset_btn.click();
		});

		f.bind('submit', function(){
			opts.submit(label, model, print);
			return false;
		});
	};
}());
