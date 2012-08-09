λ.pagination = (->
	link = (pg) -> '/browse' + (if pg > 1 then '/page/' + pg else '')

	class pgs
		constructor: -> @pages = []
		dots: -> @pages.push { id: 'dots', label: '…', classes: 'disabled' }
		page: (pgno) -> @pages.push {
			id: pgno
			link: link pgno
			label: pgno
		}
		first: -> @pages.push {
			id: 'first'
			link: link 1
			label: '|&larr;'
			classes: 'prev'
		}
		prev: (pg) -> @pages.push {
			id: 'prev'
			link: link pg
			label: '&larr;'
		}
		next: (pg) -> @pages.push {
			id: 'next'
			link: link pg
			label: '&rarr;'
		}
		last: (pg) -> @pages.push {
			id: 'last'
			link: link pg
			label: '&rarr;|'
			classes: 'next'
		}

	return (page, cnt) ->
		p = new pgs
		first = page != 1
		prev = page > 2
		next = page + 1 < cnt
		last = page < cnt
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

