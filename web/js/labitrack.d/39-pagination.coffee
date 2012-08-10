λ.pagination = (->

	class pgs
		constructor: (@prefix, @pg, @cnt) -> @pages = []
		link: (pg) -> @prefix + (if pg > 1 then '/page/' + pg else '')
		dots: -> @pages.push { id: 'dots', label: '…', classes: 'disabled' }
		page: (pgno) -> @pages.push {
			id: pgno
			link: @link pgno
			label: pgno
		}
		first: -> @pages.push {
			id: 'first'
			link: @link 1
			label: '|&larr;'
			classes: 'prev'
		}
		prev: (pg) ->
			i =
				id: 'prev'
				link: @link pg
				label: '&larr;'
			if @pg is 1
				i.link = undefined
				i.classes = 'disabled'
			@pages.push i
		next: (pg) ->
			i =
				id: 'next'
				link: @link pg
				label: '&rarr;'
			if @pg is @cnt
				i.link = undefined
				i.classes = 'disabled'
			@pages.push i
		last: (pg) -> @pages.push {
			id: 'last'
			link: @link pg
			label: '&rarr;|'
			classes: 'next'
		}

	return (prefix, page, cnt) ->
		p = new pgs prefix, page, cnt
		first = page != 1 and cnt >= 10
		prev = page > 2 or cnt < 10
		next = page + 1 < cnt or cnt < 10
		last = page < cnt and cnt >= 10
		slots = 11

		left = right = Math.floor(slots / 2)

		left -= first + prev
		right -= next + last

		if page - left < 1
			right += left - page + 1
			left = page - 1

		if page + right > cnt
			oldright = right
			right = cnt - page
			left += oldright - right

		if page - left < 1
			left = page - 1

		if page - left isnt 1
			ldots = true
			left--

		if page + right isnt cnt
			rdots = true
			right--

		p.first() if first
		p.prev page-1 if prev
		p.dots() if ldots
		while left > 0
			p.page page - left--
		p.pages[(p.page page)-1].classes += ' active'
		while right-- > 0
			p.page page + ++left
		p.dots() if rdots
		p.next page+1 if next
		p.last cnt if last
		return p.pages
)()

###cnt = parseInt process.argv[2], 10

str_repeat = (str, fac) -> new Array(fac + 1).join(str)

for i in [1..cnt]
	paging = pagination i, cnt
	pgs = []
	k = 0
	for page, j in paging
		if page.id is 'dots'
			pgs.push '…'
		else if typeof page.id is 'string'
			pgs.push page.id[0]
		else
			str = page.id+''
			pgs.push str[str.length-1]
		if page.id is i
			k = j
	console.log pgs.join ' '
	console.log str_repeat('  ', k)+'^'
	###

