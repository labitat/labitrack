DIRS=$(wildcard *.d)
FILEEXT=
SRCTARGETS=$(patsubst %.d,dist/%.src.js,$(DIRS))
MINTARGETS=$(patsubst %.d,dist/%.min.js,$(DIRS))

depend=$(shell sh -c 'ls $$(echo $1 | cut -d/ -f2 | cut -d. -f1).d/*$(FILEEXT)')

.PHONY: all mkdist
all: $(MINTARGETS)
clean:
	rm -f $(SRCTARGETS)
	rm -f $(MINTARGETS)
mkdist:
	@@mkdir -p dist

.SECONDEXPANSION:
$(SRCTARGETS): $$(call depend,$$@) | mkdist
	date
	handlebars --output $@ $^

.SECONDEXPANSION:
$(MINTARGETS): $$(patsubst %.min.js,%.src.js,$$@)
	date
	uglifyjs $^ > $@
