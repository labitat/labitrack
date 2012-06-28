(function(){
	function hdl_add(){
		console.log('add');
	}

	function hdl_remove(){
		console.log('remove');
	}

	function hdl_reset(){
		console.log('reset');
		this.render();
	}

	var collection = Backbone.Collection.extend({
		model: λ.o,
		url: 'recent.json',
		comparator: function(object){
			return -object.get('updated');
		}
	});

	var recent = Backbone.View.extend({
		initialize: function() {
			var messages = this.collection;
			messages.bind("reset", hdl_reset, this);
			messages.bind("add", hdl_add, this);
			messages.bind("remove", hdl_remove, this);
		},
		render: function(){
			var data = {
				rows: this.collection.toJSON()
			};
			console.log(data);
			$(this.el).html(λ.template('objecttable', data));
		}
	});

	var view = λ.routableview.extend({
		initialize: function() {
			λ.routableview.prototype.initialize.call(this);
			this.browse = new recent({collection: new collection()});
		},
		render: function (page) {
			page || (page = 1);
			λ.setcontent('recent');
			this.browse.el = $(this.el).find('#objecttable_ph')[0];
			this.browse.render();
			this.browse.collection.fetch();
		}
	});

	view.route('recent');
}());
