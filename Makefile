setup:
	npm install

install:
	npm install

start:
	npx webpack serve

lint:
	npx eslint --no-eslintrc --config .eslintrc.yml ./src

lint-fix:
	npx eslint --no-eslintrc --config .eslintrc.yml --fix ./src

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

publish:
	npm publish --dry-run
