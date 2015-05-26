TEST = *.js
REPORTER = spec
TIMEOUT = 5000
MOCHA_PATH = ./node_modules/mocha/
MOCHA_OPTS =

install:
	@npm install

report:
	@open coverage/lcov-report/index.html

test-cov:
	@istanbul cover $(MOCHA_PATH)/bin/_mocha test/$(TEST)

test-all: 
	@istanbul cover $(MOCHA_PATH)/bin/_mocha test/*.js

.PHONY: install report test-cov test-all