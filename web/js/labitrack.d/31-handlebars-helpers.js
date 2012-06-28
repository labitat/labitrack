(function(){
	Handlebars.registerHelper('labelform', function(){
		return new Handlebars.SafeString(λ.template('labelform', this));
	});
	Handlebars.registerHelper('pagination', function(){
		return new Handlebars.SafeString(λ.template('pagination', this));
	});
	Handlebars.registerHelper('dump_ctx', function(){
		console.log({'ctx': this});
	});
	Handlebars.registerHelper('checked_tag', function(tags){
		if (!$.isArray(tags)) return;
		if (tags.indexOf(this.name) !== -1) {
			return new Handlebars.SafeString(' checked="checked"');
		}
	});
}());
