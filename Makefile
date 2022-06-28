.DEFAULT_GOAL := help

#help:	@ List available tasks on this project
help:
	@grep -E '[a-zA-Z\.\-]+:.*?@ .*$$' $(MAKEFILE_LIST)| tr -d '#'  | awk 'BEGIN {FS = ":.*?@ "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

#dep.install: @ Install all depencies defined in package.json
dep.install:
	npm install

#test.lint: @ Checks the source code against defined coding standard rules
test.lint:
	npm run prettier
	npm run lint

#release.package: @ bundle and package a release of the application
release.package: r.clean dep.install r.bundle r.package

r.clean:
	rm -f package-lock.json
	rm -rf build
	rm -rf release release.tar.gz

r.bundle:
	npm run build -- --NODE_ENV=production

r.package:
	mkdir -p release/templates
	cp -r build/static lib appinfo LICENSE README.md release
	./build-nextcloud-app.sh release
	tar -czvf release.tar.gz -C release .

#release.push: @ release.package and push a release of the application
release.push: release.package
	./release.sh
