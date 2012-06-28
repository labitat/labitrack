DIRS=$(wildcard *.d)
FILEEXT=ss # less or css
OUTEXT=.css
SRCTARGETS=$(patsubst %.d,dist/%.src$(OUTEXT),$(DIRS))
MINTARGETS=$(patsubst %.d,dist/%.min$(OUTEXT),$(DIRS))

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
	cat $^ > $@

.SECONDEXPANSION:
$(MINTARGETS): $$(patsubst %.min$(OUTEXT),%.src$(OUTEXT),$$@)
	date
	lessc -x $^ > $@
