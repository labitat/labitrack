(function(){
	var view = λ.routableview.extend({
		render: function (id) {
			var o = λ.o.get(id, {
				success: function(){
					λ.setcontent('view', {'id': id});
					var canvas = $('#label')[0];
					var label = new λ.label();
					label.set_canvas(canvas);
					label.set_data(o.toJSON());
					$('.btn_print').click(function(){
						label.print();
						return false;
					});
				},
				error: function(ev){
					λ.setcontent('notfound', {
						action: 'View',
						id: id,
						status: ev.status
					});
				}
			});
		}
	});

	view.route('view/:id', 'view');
}());
