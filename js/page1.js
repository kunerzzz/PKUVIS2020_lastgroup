/* Javascript for page1 */
let page1 = {
    //Your Content Here
    piechart_year: 2020,
    institution_type: 0,

    hello: function() {
        console.log("Are you ok, page1")
    },

    schedule: function() {

        let schedule_data = [
            {"time":"2020-06-05", "text": "Paper Submission Deadline"},
            {"time":"2020-06-05", "text": "Review Period Begins"},
            {"time":"2020-08-07", "text": "Author Response Begins"},
            {"time":"2020-09-15", "text": "Registration Opens"},
            {"time":"2020-10-22", "text": "Camera Ready Paper Deadline"},
            {"time":"2020-12-07", "text": "Conference Sessions, Tutorials, Workshops"}
        ]
        milestones('#pg1-schedule')
            .mapping({
                'timestamp': 'time',
            })
            .parseTime('%Y-%m-%d')
            .aggregateBy('day')
            .render(schedule_data);
    },

    piechart: function() {
        let svg = d3.select("#pg1-statistic-container>svg");
        let width = svg.attr('width');
        let height = svg.attr('height');
        // console.log(width, height);
        let g = svg.append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2}) scale(0.9)`);
        let data = page1.submission_data[page1.piechart_year - 2009];
        let data_entities = [];
        Object.keys(data).map(d => {data[d] = +data[d]; data_entities.push({'data':d, 'value':data[d]})});
        let colorSpectral = d3.interpolateSpectral;
        let color = d3.scaleOrdinal(Object.keys(data), [colorSpectral(1), colorSpectral(0.666), colorSpectral(0.333), colorSpectral(0)]);
        // console.log(Object.keys(data), color('oral'));
        let pie = d3.pie()
            .value(d => d.value)
        let ready_data = pie(data_entities);
        // console.log(ready_data);
        g.selectAll('whatever')
            .data(ready_data)
            .enter()
            .append('path')
            .attr('d', d3.arc()
                .innerRadius(0)
                .outerRadius(Math.min(width, height) / 2)
            )
            .attr('fill', d => color(d.data.data))
            .attr("stroke", "#ffffff")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)

    },

    ranklist: function() {
        let svg = d3.select("#pg1-ranklist-container>svg");
        let width = svg.attr('width');
        let height = svg.attr('height');
        console.log(width, height);
        data = page1.institution_data[page1.institution_type].slice(0, 20)
        console.log(data);
        let margin = {
            top: 5,
            right: 25,
            bottom: 5,
            left: 120
        };
        width = width - margin.right - margin.left;
        height = height - margin.top - margin.bottom;
        let g = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        let xScale = d3.scaleLinear()
            .range([0, width])
            .domain([0, d3.max(data, d=>d.value)]);
        let yScale = d3.scaleBand()
            .range([0, height])
            .domain(data.map(d => d.name));
        let colorScale = d3.scaleLinear()
            .domain([0, d3.max(data, d=>d.value)])
            .range([0.75, 1]);

        let yAxis = d3.axisLeft()
            .scale(yScale)
            .tickSize(0);

        g.append("g")
            .attr("class", "y-axis")
            .call(yAxis)

        let bars = g.selectAll(".bar")
            .data(data)
            .enter()
            .append("g")

        bars.append("rect")
            .attr("class", "bar")
            .attr("y", d => yScale(d.name))
            .attr("height", yScale.bandwidth())
            .attr("x", 0)
            .attr('fill', d => d3.interpolateSpectral(colorScale(d.value)))
            .attr('opacity', 0.8)
            .attr("width", d => xScale(d.value));

        bars.append("text")
            .attr("class", "label")
            //y position of the label is halfway down the bar
            .attr("y", d => yScale(d.name) + yScale.bandwidth() / 2 + 4)
            .attr("x", d => xScale(d.value) + 3)
            .text(d => d.value);

    },

    wordcloud: function() {
        let svg = d3.select("#pg1-wordcloud-container>svg");
        let width = svg.attr('width');
        let height = svg.attr('height');
        // console.log(width, height);
        let data = page1.keyword_data.slice(0, 50);
        data = data.map(d => {return {'text':d.word, 'size':d.value};});
        // console.log(data);
        let g = svg.append("g")
            .attr('transform', `translate(${width / 2}, ${height / 2}) scale(0.9)`);
        let fontSize_f = d => Math.sqrt(d.size)*5;
        let fontSize_max = d3.max(data, fontSize_f);
        let fontSize_min = d3.min(data, fontSize_f);
        let colorScale = d3.scaleLinear()
            .domain([fontSize_min, fontSize_max])
            .range([1, 0.1]);
        let color = d => d3.interpolateSpectral(colorScale(d));
        let layout = d3.layout.cloud()
            .size([width, height])
            .words(data)
            .padding(1)
            .rotate(0)
            .fontSize(fontSize_f)      // font size of words
            .on("end", draw_wordcloud);
        layout.start();
        function draw_wordcloud(words) {
            console.log(d3.min(words, d => d.size));
            console.log(layout.size());
            console.log(fontSize_max);
            g.selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", d => d.size)
                .attr("text-anchor", "middle")
                .style("font-family", "Impact")
                .style("fill", d => color(d.size))
                .style('opacity', 0.8)
                .attr("transform", d => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`)
                .text(d => d.text);
        }
    },

    load_data: function() {
        Promise.all([
            d3.json("../data/pg1_institution_rank_first.json"),
            d3.json("../data/pg1_institution_rank_all.json"),
            d3.json("../data/pg1_keywords.json"),
            d3.csv("../data/pg1_submission.csv")
        ]).then(function(files) {
            // console.log(files)
            page1.institution_data = [files[0], files[1]];
            page1.submission_data = files[3];
            page1.keyword_data = files[2];
            page1.dispatch.call("start");

        }).catch(function(err) {
            // handle error here
        })
    }


}


//Function passed to PageMain will be called after DOM and all dependencies init.
PageMain(() => {
    "use strict";
    //Your Content Here
    page1.dispatch = d3.dispatch("start");
    page1.dispatch.on("start.piechart", page1.piechart);
    page1.dispatch.on("start.wordcloud", page1.wordcloud);
    page1.dispatch.on("start.ranklist", page1.ranklist);
    page1.dispatch.on("start.schedule", page1.schedule);
    page1.load_data()
})