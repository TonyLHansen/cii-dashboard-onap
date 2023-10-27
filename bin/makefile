BEST_PRACTICES_BADGE_CODE= ../../best-practices-badge
HTML= ../html
JSCRIPT=$(HTML)/openssf
PY=check-descriptions check-jquery-datatables-versions
PROJECTHTML=$(HTML)/onap.html $(HTML)/oneproject.html

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
	./check-descriptions -i "$(JSCRIPT)/openssf-descriptions.js" -b "$(BEST_PRACTICES_BADGE_CODE)" -o $(JSCRIPT)/nopenssf-descriptions.js
	@if cmp $(JSCRIPT)/openssf-descriptions.js $(JSCRIPT)/nopenssf-descriptions.js > /dev/null; then \
		echo "No changes"; rm -f $(JSCRIPT)/nopenssf-descriptions.js; \
	else \
		echo "Be certain to check the new $(JSCRIPT)/nopenssf-descriptions.js file"; \
	fi

run-black:
	black -l 120 $(PY)

run-pylint:
	python3 -m pylint $(PY)

run-check-jquery-datatables-versions:
	./check-jquery-datatables-versions $(PROJECTHTML)
