(function(){
	λ.topbar = topbar = {};
	topbar.update = function(){
		console.log('topbar update');
		$('ul.nav li a').each(function(){
			if (this.href === window.location.href) {
				$(this).parent().addClass('active');
			} else {
				$(this).parent().removeClass('active');
			}
		});
	};
}());
