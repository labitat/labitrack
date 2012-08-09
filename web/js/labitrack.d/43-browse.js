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
		url: function(){
			return '/browse/'+(this.nextpage++)+'.json';
		},
		fetchpage: function(page){
			if (page) {
				this.nextpage = page;
			}
			this.fetch();;
		},
		comparator: function(object){
			return object.id;
		},
		parse: function(data){
			this.stats = {count: data.count};
			console.log(data);
			return data.objects;
		}
	});

	var browse = Backbone.View.extend({
		initialize: function() {
			var messages = this.collection;
			messages.bind("reset", hdl_reset, this);
			messages.bind("add", hdl_add, this);
			messages.bind("remove", hdl_remove, this);
		},
		render: function(page){
			if (page) this.page = page;
			page = this.page;
			var stats = this.collection.stats;
			var pages = [];
			if (stats !== undefined) {
				var pgcnt = Math.ceil(stats.count / 10);
				pages = λ.pagination(page, pgcnt);
			}
			var data = {
				rows: this.collection.toJSON(),
				pages: pages
			};
			console.log(data);
			$(this.el).html(λ.template('objecttable', data));
		}
	});

	var collection = new collection();

	var view = λ.routableview.extend({
		initialize: function() {
			λ.routableview.prototype.initialize.call(this);
			this.browse = new browse({collection: collection});
		},
		render: function (page) {
			page || (page = 1);
			page = parseInt(page, 10);
			console.log('page', page);
			λ.setcontent('browse', {page: page});
			this.browse.el = $(this.el).find('#objecttable_ph')[0];
			console.log(this.browse.render);
			this.browse.render(page);
			this.browse.collection.fetchpage(page);
		}
	});

	view.route('browse');
	view.route('browse/page/:page');
}());
