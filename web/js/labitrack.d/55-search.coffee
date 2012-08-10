hdl_add = ->
	console.log 'add'

hdl_remove = ->
	console.log 'remove'

hdl_reset = ->
	console.log 'reset'
	@render()

$ ->
	form = $('.navbar-search')
	q = form.find('input')[0]
	form.bind 'submit', (e) ->
		e.preventDefault()
		url = '/search/' + encodeURIComponent q.value
		Backbone.history.navigate(url, true)
		return false

collection = Backbone.Collection.extend {
	model: λ.o,
	url: -> '/search.json?offset='+(10*((@nextpage++)-1))+'&q='+encodeURIComponent(@q)
	comparator: (object) -> object.id
	fetchpage: (@q, page) ->
		if page
			@nextpage = page
		@fetch()
	parse: (data) ->
		@meta = {count: data.count, query: data.query}
		console.log data
		return data.objects
}

search = Backbone.View.extend {
	initialize: () ->
		messages = @collection
		messages.bind "reset", hdl_reset, @
		messages.bind "add", hdl_add, @
		messages.bind "remove", hdl_remove, @
	render: (q, page) ->
		if page then @page = page
		if q then @q = q
		page = @page
		q = @q
		meta = @collection.meta
		pages = []
		if meta != undefined
			pgcnt = Math.ceil(meta.count / 10)
			pages = λ.pagination '/search/'+q,  page, pgcnt

			if meta.count is 1
				url = '/view/' + @collection.at(0).id
				return Backbone.history.navigate(url, true)

		data = {
			rows: @collection.toJSON(),
			pages
			meta
		}
		console.log data, meta
		$(@el).html λ.template 'searchtable', data
}

collection = new collection()

view = λ.routableview.extend {
	initialize: () ->
		λ.routableview.prototype.initialize.call(@)
		@search = new search({collection: collection})
	render: (q, page) ->
		console.log 'render', q, page
		q = decodeURIComponent q
		page || (page = 1)
		page = parseInt page, 10
		console.log 'page', page
		λ.setcontent 'search', {page}
		@search.el = $(@el).find('#objecttable_ph')[0]
		console.log @search.render
		@search.render q, page
		@search.collection.fetchpage q, page
}

view.route 'search'
view.route 'search/:q'
view.route 'search/:q/page/:page'
