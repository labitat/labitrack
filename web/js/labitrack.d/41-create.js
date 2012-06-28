(function(){
	function on_submit(label, o) {
		o.save(undef, {
			success: function(){
				label.set_data(o.toJSON());
				label.print();

				console.log('Saved with id: ' + o.get('id'));
			}
		});
	}

	var view = λ.routableview.extend({
		render: function () {
			λ.setcontent('create', {
				save_text: 'Save and queue for printing',
				data: {},
				tags: λ.tags
			});
			var o = new λ.o();
			λ.labelform({
				model: o,
				submit: on_submit
			});
		}
	});

	view.route('', 'create');
}());
