SUBDIRS=$(shell find . -mindepth 2 -maxdepth 2 -type f ! -ipath '*deps*' -iname makefile | rev | cut -d/ -f2- | rev)
SUBDIRS_CLEAN=$(SUBDIRS:%=%_clean)
TARGETS=$(SUBDIRS) 
.SILENT: all loop $(TARGETS)
.PHONY: all loop $(TARGETS)
all: $(SUBDIRS)
loop:
	echo Starting build loop
	sh -c 'while sleep 0.05; do $(MAKE) --silent; done'
clean: $(SUBDIRS_CLEAN)
$(SUBDIRS):
	$(MAKE) -C $@
$(SUBDIRS_CLEAN):
	make -C $(subst _clean,,$@) clean
pack:
	tar zcfv pack.tar.gz $(shell cat packlist)
