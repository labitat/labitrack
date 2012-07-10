(function(){
	function on_submit(label, o, print) {
		o.save(undef, {
			success: function(){
				label.set_data(o.toJSON());
				if (print) {
					label.print();
				}
				var id = o.get('id');

				console.log('Saved with id: ' + o.get('id'));
				λ.alert('newlabel', {id: o.get('id')});

				o.set('id', undefined);
				label.trigger_refresh();
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
