(function(){
	var object = λ.o = Backbone.Model.extend({
		defaults: {
			name: 'Name',
			desc: 'Description',
			tags: []
		},
		url: function(){
			var base = '/o';
			if (this.isNew()) return base;
			return base + '/' + this.id + '.json';
		}
	});

	object.get = function(id, opts){
		var o = new object({id: id});
		o.fetch(opts);
		return o;
	};
}());
