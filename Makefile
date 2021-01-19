PYTHON = python3
TITLE = 可视化Project-最后一组

.PHONY: output page clean
all: output
output:
	rm -rf output/
	mkdir -p output/js && \
	mkdir -p output/css && \
	mkdir -p output/data && \
	mkdir -p output/img && \
	cp vendor/css/* output/css/ && \
	cp vendor/js/* output/js/ && \
	(cp js/[^_]*.js output/js/ 2>/dev/null || echo "\033[33;1m[WARN]\033[0m No js files") && \
	(cp css/[^_]*.* output/css/ 2>/dev/null || echo "\033[33;1m[WARN]\033[0m No css files") && \
	(cp data/[^_]* output/data 2>/dev/null || echo "\033[33;1m[WARN]\033[0m No data files") && \
	(cp img/[^_]* output/img 2>/dev/null || echo "" > /dev/null) && \
	$(PYTHON) build/gen_output.py ${TITLE} && \
	echo "\033[32m[SUCCESS]\033[0m Generated files in output/"

page:
	$(PYTHON) build/gen_page.py page$(ORDER)

clean:
	rm -rf output/
