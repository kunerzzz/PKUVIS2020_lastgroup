PYTHON = python3
TITLE = 可视化Project-最后一组

.PHONY: output page clean
all: output
output:
	rm -rf output/
	mkdir -p output/js && \
	mkdir -p output/css && \
	mkdir -p output/data && \
	cp build/css/* output/css/ && \
	cp build/js/* output/js/ && \
	(cp js/* output/js/ 2>/dev/null || echo "\033[33;1m[WARN]\033[0m No js files") && \
	(cp css/* output/css/ 2>/dev/null || echo "\033[33;1m[WARN]\033[0m No css files") && \
	(cp data/* output/data 2>/dev/null || echo "\033[33;1m[WARN]\033[0m No data files") && \
	$(PYTHON) build/gen_output.py ${TITLE} && \
	echo "\033[32m[SUCCESS]\033[0m Generated files in output/"

page:
	$(PYTHON) build/gen_page.py page$(ORDER)

clean:
	rm -rf output/
