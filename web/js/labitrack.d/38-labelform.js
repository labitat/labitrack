(function(){

	λ.labelform = function(opts){
		var model = opts.model;
		var canvas = $('#label')[0];
		var label = new λ.label();
		label.set_data(model.toJSON());
		label.set_canvas(canvas);

		var rendertime = $('#rendertime');
		function updateimg(data, ms) {
			rendertime.text(ms);
		}

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
				label.set_data(model.toJSON());
				label.render(updateimg);
			}, 0);
		};
		f.find(':input').each(function (i,e){
			$(e).bind('keypress', update_data);
			$(e).bind('click', update_data);
			$(e).bind('change', update_data);
			update_data.apply(this);
		});
		label.render(updateimg);

		f.bind('submit', function(){
			opts.submit(label, model);
			return false;
		});
	};
}());
