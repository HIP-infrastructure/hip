.DEFAULT_GOAL := help

include ../.env
export

.PHONY: require
require:
	@echo "Checking the programs required for the build are installed..."
	@node --version >/dev/null 2>&1 || (echo "ERROR: node is required."; exit 1)
	@husky --version >/dev/null 2>&1 || (echo "ERROR: husky is required."; exit 1)

.PHONY: dep
#dep: @ Install all depencies defined in package.json
dep:
	npm install
	npm run prepare

.PHONY: test
#test: @ Run all tests
test: t.prettier t.lint

.PHONY: t.prettier
#t.prettier: @ Prettify the source code
t.prettier:
	npm run prettier

.PHONY: t.lint
#t.lint: @ Checks the source code against defined coding standard rules
t.lint:
	npm run lint

.PHONY: build
#build: @ Builds the project
build: dep b.clean t.lint b.bundle b.package

.PHONY: b.clean
#b.clean: @ Removes all build artifacts
b.clean:
	rm -rf build release release.tar.gz

.PHONY: b.bundle
#b.bundle: @ Builds the application as a JavaScript bundle
b.bundle:
	npm run build -- --NODE_ENV=production

.PHONY: b.package
#b.package: @ Packages the application for NextCloud as a tarball
b.package:
	mkdir -p release/templates
	cp -r build/static lib appinfo LICENSE README.md img release
	./build-nextcloud-app.sh release
	tar -czvf release.tar.gz -C release .

.PHONY: release
#release: @ Release on GitHub, tag the application with appinfo/info.xml 
release: build
	./release.sh

.PHONY: help
#help:	@ List available tasks on this project
help:
	@grep -E '[a-zA-Z\.\-]+:.*?@ .*$$' $(MAKEFILE_LIST)| tr -d '#'  | awk 'BEGIN {FS = ":.*?@ "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
