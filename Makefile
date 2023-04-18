Name := file-picker
HUGO := hugo

node_modules: package.json pnpm-lock.yaml
	pnpm install --frozen-lockfile && touch node_modules

#
# Docs
#
.PHONY: docs-copy
docs-copy:
	mkdir -p $(HUGO); \
	mkdir -p $(HUGO)/content/integration; \
	cd $(HUGO); \
	git init; \
	git remote rm origin; \
	git remote add origin https://github.com/owncloud/owncloud.github.io; \
	git fetch; \
	git checkout origin/main -f; \
	make theme; \
	rsync --delete -ax ../docs/ content/integration/$(NAME)

.PHONY: docs-build
docs-build:
	cd $(HUGO); hugo

.PHONY: docs
docs: docs-copy docs-build

#
# Translation
#

.PHONY: l10n-push
l10n-push:
	cd l10n && tx push -s --skip

.PHONY: l10n-pull
l10n-pull:
	cd l10n && tx pull -a

.PHONY: l10n-clean
l10n-clean:
	cd l10n && make clean

.PHONY: l10n-read
l10n-read: node_modules
	cd l10n && rm -rf template.pot && make extract

.PHONY: l10n-write
l10n-write: node_modules
	cd l10n && rm -rf translations.json && make translations
