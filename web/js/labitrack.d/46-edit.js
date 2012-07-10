(function(){
	function on_submit(label, o, print)
	{
		o.save(undef, {success: function() {
			label.set_data(o.toJSON());
			Backbone.history.navigate('/view/'+o.id, true);
		}});
		if (print) {
			label.print();
		}
	}

	function success(o)
	{
		var data = o.toJSON();
		λ.setcontent('edit', {
			id: o.id,
			save_text: 'Save',
			data: data,
			tags: λ.tags
		});

		λ.labelform({
			model: o,
		    	submit: on_submit
		});
	}

	var view = λ.routableview.extend({
		render: function (id) {
			var o = λ.o.get(id, {
				success: function(){
					success(o);
				},
				error: function(ev){
					λ.setcontent('notfound', {
						action: 'Edit',
						id: id,
						status: ev.status
					});
				}
			});
		}
	});

	view.route('edit/:id', 'edit');
}());
