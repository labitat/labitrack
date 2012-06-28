$(function(){
	function supportsToDataURL()
	{
		var c = document.createElement("canvas");
		var data = c.toDataURL("image/png");
		return (data.indexOf("data:image/png") == 0);
	}

	if (Modernizr.canvas
	    && Modernizr.canvastext
	    && Modernizr.fontface
	    && supportsToDataURL) {
		Backbone.history.start({
			pushState: true
		});
	} else {
		λ.setcontent('ancientbrowser');
	}
});
