(function(){
	var view = λ.routableview.extend({
		render: function () {
			λ.setcontent('about');
		}
	});

	view.route('about');
}());
