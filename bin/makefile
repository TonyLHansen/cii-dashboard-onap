BEST_PRACTICES_BADGE_CODE= ../../best-practices-badge
HTML= ../html/openssf

none:
	@echo make run-check-descriptions -- check the descriptions
	@echo make run-black -- run "black -l120" on python code
	@echo make run-pylint -- run "pylint" on python code

run-cii-modify:
	. set_proxies; ./cii-modify

run-check-descriptions: update-best-practices-badge-code do-check-descriptions

update-best-practices-badge-code:
	cd $(BEST_PRACTICES_BADGE_CODE) && git pull origin

do-check-descriptions:
	./check-descriptions -i "$(HTML)/openssf-descriptions.js" -b "$(BEST_PRACTICES_BADGE_CODE)" -o $(HTML)/nopenssf-descriptions.js
	@if cmp $(HTML)/openssf-descriptions.js $(HTML)/nopenssf-descriptions.js > /dev/null; then \
		echo "No changes"; rm -f $(HTML)/nopenssf-descriptions.js; \
	else \
		echo "Be certain to check the new $(HTML)/nopenssf-descriptions.js file"; \
	fi

run-black:
	black -l 120 check-descriptions

run-pylint:
	python3 -m pylint check-descriptions
