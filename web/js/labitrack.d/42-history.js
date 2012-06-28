(function(){
	var view = λ.routableview.extend({
		render: function () {
			λ.setcontent('identify', {'page': 'history'});
		}
	});

	view.route('history');
}());
