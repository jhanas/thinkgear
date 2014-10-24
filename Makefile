BIN := ./node_modules/.bin
TEST_FILES := $(shell find test -type f -name "*.js")
VERSION := $(shell node -e "console.log(require('./package.json').version)")

.PHONY: test cover lint release

# Run tests
test:
	node $(TEST_FILES)  | node_modules/.bin/tap-spec

# Run code coverage
cover:
	$(BIN)/istanbul cover $(BIN)/tape $(TEST_FILES) --report lcovonly -- -R spec

# Run JSHint
lint:
	@$(BIN)/jshint ./lib ./example ./test

# Publish a new release
release:
	@git tag -m "$(VERSION)" v$(VERSION)
	@git push --tags
	@npm publish ./
