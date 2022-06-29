.DEFAULT_GOAL := help

#help:	@ List available tasks on this project
help:
	@grep -E '[a-zA-Z\.\-]+:.*?@ .*$$' $(MAKEFILE_LIST)| tr -d '#'  | awk 'BEGIN {FS = ":.*?@ "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

#test: @ Run all tests
test: t.lint

#t.lint: @ Checks the source code against defined coding standard rules
t.lint:
	npm run prettier
	npm run lint

#build: @ Builds the project
build: b.install b.clean b.bundle b.package

#b.clean: @ Removes all build artifacts
b.clean:
	rm -rf build release release.tar.gz

#b.install: @ Install all depencies defined in package.json
b.install:
	npm install

#b.bundle: @ Builds the application as a JavaScript bundle
b.bundle:
	npm run build -- --NODE_ENV=production

#b.package: @ Packages the application for NextCloud as a tarball
b.package:
	mkdir -p release/templates
	cp -r build/static lib appinfo LICENSE README.md release
	./build-nextcloud-app.sh release
	tar -czvf release.tar.gz -C release .

#release: @ Release on GitHub, tag the application with appinfo/info.xml 
release: build
	./release.sh	
