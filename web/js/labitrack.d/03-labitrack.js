(function(){
	λ.label = function(){
		var mindata = {
			id: "???",
			name: "Name",
			desc: "Description",
			tags: []
		};

		var render;

		function label()
		{
			this.canvas = null;
			this.bitmap = null;
			this.data = null;
			this.busy = false;
			this.set_template('standard');
			this.renderpreview = new λ.ratelimiter(50, render, this);
		}
		var labelpt = label.prototype;

		labelpt.set_template = function(tmpl){
			this.template = λ.templates.get(tmpl);
			this.update_canvas();
		};

		labelpt.set_canvas = function(canvas){
			this.canvas = canvas;
			this.update_canvas();
		};

		labelpt.set_data = function(data){
			this.data = data;
			this.render();
		};

		render = function(callback, preview){
			if (preview === undef) preview = true;
			var t = this;
			var data = null;
			var params = $.extend({}, mindata, t.data);
			var time = labitrack.utils.time(function(){
				t.busy = true;
				data = t.template.draw(params, preview);
				if (!preview) {
					labitrack.utils.convert_to_monochrome(data);
				} else {
					t.bitmap = data;
					t.update_canvas();
				}
				t.busy = false;
			});
			if (callback) {
				callback.apply(t, [data, time]);
			}
		};

		labelpt.render = function(callback, preview){
			if (preview === false) {
				return render.apply(this, [callback, preview]);
			}
			return this.renderpreview(callback);
		};

		labelpt.update_canvas = function(){
			var bitmap = this.bitmap;
			var canvas = this.canvas;
			if (bitmap !== null && canvas !== null) {
				canvas.width = bitmap.width;
				canvas.height = bitmap.height;
				var ctx = canvas.getContext('2d');
				ctx.putImageData(bitmap, 0, 0);
			}
		};

		labelpt.print = function(){
			console.log("Print label on server");
			this.render(function(data){
				var ctx = labitrack.utils.new_context(data.width, data.height);
				ctx.putImageData(data, 0, 0);
				$.post('/print.json',
					{
						image: ctx.canvas.toDataURL('image/png')
					}, function(data) { console.log('uploaded');}, 'json');
			}, false);
		};

		return label;
	}();

	λ.templates = function(){
		var templates = {};

		return {
			'register': function(key, value){
				templates[key] = value;
			},
			'get': function(key){
				return templates[key];
			}
		};
	}();
}());
