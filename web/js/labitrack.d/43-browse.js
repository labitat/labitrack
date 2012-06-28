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
			var stats = this.collection.stats;
			var pages = [];
			var dots = { id: 'dots', label: '…' };
			pages.push({
				id: 'first',
				link: '/browse',
				label: '|&larr;',
				classes: 'prev'
			});
			pages.push({
				id: 'prev',
				link: '/browse',
				label: '&larr;'
			});
			pages.push(dots);
			pgno = 1;
			pages.push({
				id: pgno,
				link: '/browse/'+pgno,
				label: pgno
			});
			pages.push(dots);
			pages.push({
				id: 'next',
				link: '/browse',
				label: '&rarr;'
			});
			pages.push({
				id: 'last',
				link: '/browse',
				label: '&rarr;|',
				classes: 'next'
			});
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
			λ.setcontent('browse', {page: page});
			this.browse.el = $(this.el).find('#objecttable_ph')[0];
			this.browse.render(page);
			this.browse.collection.fetchpage(page);
		}
	});

	view.route('browse');
	view.route('browse/:page');
}());
