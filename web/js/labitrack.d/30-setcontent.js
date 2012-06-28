$(function(){
	var template = λ.template = function (tmpl, context){
		return Handlebars.templates[tmpl](context);
	};

	var tmplcontent = $('#tmplcontent');
	var h1 = $('h1');
	λ.setcontent = function(tmpl, context) {
		tmplcontent.html(template(tmpl, context));
		h1.html(tmplcontent.find('.tmplheader').html());
	};
});
