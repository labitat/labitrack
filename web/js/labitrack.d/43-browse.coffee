hdl_add = ->
	console.log 'add'

hdl_remove = ->
	console.log 'remove'

hdl_reset = ->
	console.log 'reset'
	@render()

collection = Backbone.Collection.extend {
	model: λ.o,
	url: -> '/browse/'+(@nextpage++)+'.json'
	comparator: (object) -> object.id
	fetchpage: (page) ->
		if page
			@nextpage = page
		@fetch()
	parse: (data) ->
		@stats = {count: data.count}
		console.log data
		return data.objects
}

browse = Backbone.View.extend {
	initialize: () ->
		messages = @collection
		messages.bind "reset", hdl_reset, @
		messages.bind "add", hdl_add, @
		messages.bind "remove", hdl_remove, @
	render: (page) ->
		if page then @page = page
		page = @page
		stats = @collection.stats
		pages = []
		if stats != undefined
			pgcnt = Math.ceil(stats.count / 10)
			pages = λ.pagination '/browse', page, pgcnt

		data = {
			rows: @collection.toJSON(),
			pages: pages
		}
		console.log data
		$(@el).html λ.template 'objecttable', data
}

collection = new collection()

view = λ.routableview.extend {
	initialize: () ->
		λ.routableview.prototype.initialize.call(@)
		@browse = new browse({collection: collection})
	render: (page) ->
		page || (page = 1)
		page = parseInt page, 10
		console.log 'page', page
		λ.setcontent 'browse', {page}
		@browse.el = $(@el).find('#objecttable_ph')[0]
		console.log @browse.render
		@browse.render page
		@browse.collection.fetchpage page
}

view.route 'browse'
view.route 'browse/page/:page'
