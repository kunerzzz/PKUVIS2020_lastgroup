/* Javascript for page2 */
let page2_tweet_data;
let page2_svg;
let _width = $(window).width();
let _height = $(window).height();
let page2_width = 0.8 * _width;
let page2_height = 0.8 * _height;
let page2_padding = { 'left': 0.1 * page2_width, 'bottom': 0.1 * page2_height, 'top': 0.1 * page2_height, 'right': 0.05 * page2_width };
let parseDate = d3.utcParse('%a %b %d %H:%M:%S %Z %Y');
let x, y, axis_x, axis_y, xGroup, yGroup;
let old_time = [new Date(2020, 4, 12)]
let postpone = [new Date(2020, 3, 18), new Date(2020, 5, 3)]
let important_time = [new Date(2020, 5, 5), new Date(2020, 6, 6), new Date(2020, 7, 13), new Date(2020, 8, 25), new Date(2020, 11, 6), new Date(2020, 11, 13)];
let timetext_gray = [[new Date(2020, 4, 12), 'Original Paper Submission DDL', -20],
                    [new Date(2020, 3, 18), 'First Postpone', 0],
                    [new Date(2020, 5, 3), 'Second Postpone', +20]];
let timetext_red = [[new Date(2020, 5, 5), 'Paper Submission DDL', 0],
                    [new Date(2020, 6, 6), 'Review Period Begins', -20],
                    [new Date(2020, 7, 13), 'Author Response Ends', 0],
                    [new Date(2020, 8, 25), 'Author Notification', 0],
                    [new Date(2020, 11, 6), 'Conference', 0]];
let text_gray, text_red;
let page2_y_attr;

let page2 = {
    //Your Content Here
    hello() {
        console.log("Hello, page2")
        var objs = document.getElementById("select_page2_y_axis");
        objs.options[0].selected = true;
        var objs = document.getElementById("select_page2_timeline");
        objs.options[0].selected = true;
        d3.tsv('../data/tweet_data_20.csv').then(function (DATA_T) {
            page2_tweet_data = DATA_T;
            //console.log(page2_tweet_data);
            page2.set_ui()
            page2_svg = d3.select('#page2_container')
                .select('svg');
            page2.draw('retweet-cnt');
        })
    },

    set_ui() {
        let ua = navigator.userAgent.toLowerCase();
        fontFamily = "Khand-Regular";
        if (/\(i[^;]+;( U;)? CPU.+Mac OS X/gi.test(ua)) {
            fontFamily = "PingFangSC-Regular";
        }
        d3.select("body")
            .style("font-family", fontFamily);
    },

    zoomed(event) {
        xz = event.transform.rescaleX(x);
        xGroup.call(axis_x, xz);
        page2_svg.selectAll('circle')
            .attr('cx', (d, i) => {
                return xz(parseDate(d['time']));
            })
            .on('mouseover', (e, d) => {
                // show a tooltip
                let content = '<table><tr><td></td><td>' + d['text'] + '</td></tr></table>';

                // tooltip
                let tooltip = d3.select('#page2_tooltip');
                tooltip.select('.TweetAuthor-name')
                    .html(d['user-name']);
                tooltip.select('.TweetAuthor-screenName')
                    .html('@' + d['user-screen-name']);
                tooltip.select('.timeline-Tweet-text')
                    .html(d['text']);
                tooltip.select('.timeline-Tweet-timestamp')
                    .html(function () {
                        return d3.timeFormat('%Y-%m-%d %H:%M:%S')(parseDate(d['time']))
                    });
                tooltip.style('left', (xz(parseDate(d['time'])) + 0.11 * _width) + 'px')
                    .style('top', (y(parseInt(d[page2_y_attr])) - 0.15 * _height) + 'px')
                    .style('width', (Math.min(500, (_width - (xz(parseDate(d['time'])) + 0.11 * _width))) + 'px'))
                    .style('visibility', 'visible');

            })
        page2_svg.selectAll('.timeline')
            .attr('x1', (d, i) => xz(d))
            .attr('x2', (d, i) => xz(d));
        text_gray.remove();
        text_red.remove();
        text_gray = page2_svg.append('g')
            .selectAll('text')
            .data(timetext_gray)
            .enter().append('text')
            .text(d => d[1])
            .attr('x', d => xz(d[0]) - 20)
            .attr('y', d => (page2_padding.top - 2 + d[2]))
            .attr("font-size", 14)
            .attr('fill', 'gray')
            .style('visibility', function () {
                let idx = $("#select_page2_timeline option:selected").val();
                if (idx == 0)
                    return 'visible';
                else
                    return 'hidden';
            });
        text_red = page2_svg.append('g')
            .selectAll('text')
            .data(timetext_red)
            .enter().append('text')
            .text(d => d[1])
            .attr('x', d => xz(d[0]) - 20)
            .attr('y', d => (page2_padding.top - 2 + d[2]))
            .attr("font-size", 14)
            .attr('fill', 'red')
            .style('visibility', function () {
                let idx = $("#select_page2_timeline option:selected").val();
                if (idx == 0)
                    return 'visible';
                else
                    return 'hidden';
            });
    },

    draw(y_attr) {
        page2_svg.selectAll('g').remove();
        page2_y_attr = y_attr;

        zoom = d3.zoom()
            .scaleExtent([1, 32])
            .extent([[page2_padding.left, page2_padding.top], [page2_width - page2_padding.right, page2_height - page2_padding.bottom]])
            .translateExtent([[page2_padding.left, page2_padding.top], [page2_width - page2_padding.right, page2_height - page2_padding.bottom]])
            .on("zoom", page2.zoomed);
        page2_svg.call(zoom);

        x = d3.scaleTime()
            .domain(d3.extent(page2_tweet_data, function (d) {
                //console.log(d['time']);
                return (parseDate(d['time']));
            }))
            .range([page2_padding.left, page2_width - page2_padding.right]);
        axis_x = (g, x) => g
            .attr('transform', `translate(${0}, ${page2_height - page2_padding.bottom})`)
            .call(d3.axisBottom(x));
        y = d3.scaleSqrt()
            .domain(d3.extent(page2_tweet_data, function (d) {
                return (parseInt(d[y_attr]))
            }))
            .range([page2_height - page2_padding.bottom, page2_padding.top]);
        axis_y = d3.axisLeft(y)
            .tickFormat(d => d);
        xGroup = page2_svg.append('g')
            .call(axis_x, x)
            .attr('font-family', fontFamily)
            .attr('font-size', '0.8rem')
        page2_svg.append('g')
            .attr('transform', `translate(${page2_width - page2_padding.right}, ${page2_height - page2_padding.bottom})`)
            .append('text')
            .attr('class', 'axis_label')
            .attr('dy', 0.08 * page2_height)
            .text('Time');
        yGroup = page2_svg.append('g')
            .attr('transform', `translate(${page2_padding.left}, ${0})`)
            .call(axis_y)
            .attr('font-family', fontFamily)
            .attr('font-size', '0.8rem')
        page2_svg.append('g')
            .attr('transform', `
            translate(${page2_padding.left}, ${page2_height / 2})
            rotate(-90)    
        `)
            .append('text')
            .attr('class', 'axis_label')
            .attr('dy', -page2_height * 0.1)
            .text(function () {
                if (y_attr == 'retweet-cnt')
                    return 'Retweet Count';
                else
                    return 'Like Count';
            });
        page2_svg.append('g')
            .selectAll('circle')
            .data(page2_tweet_data)
            .join('circle')
            .attr('cx', (d, i) => {
                return x(parseDate(d['time']));
            })
            .attr('cy', (d, i) => {
                //console.log(parseFloat(d['emotion']));
                return y(parseInt(d[y_attr]));
            })
            .attr('r', 3)
            .attr('opacity', (d, i) => {
                if (d['emotion'] > 0.0)
                    return 0.5;
                else
                    return 0.8;
            })
            .attr('fill', (d, i) => {
                if (d['emotion'] > 0.0)
                    return 'SteelBlue';
                else
                    return 'Gold';
            })
            .on('mouseover', (e, d) => {
                // show a tooltip
                let content = '<table><tr><td></td><td>' + d['text'] + '</td></tr></table>';

                // tooltip
                let tooltip = d3.select('#page2_tooltip');
                tooltip.select('.TweetAuthor-name')
                    .html(d['user-name']);
                tooltip.select('.TweetAuthor-screenName')
                    .html('@' + d['user-screen-name']);
                tooltip.select('.timeline-Tweet-text')
                    .html(() => { console.log(d['text']); return d['text']; });
                tooltip.select('.timeline-Tweet-timestamp')
                    .html(function () {
                        return d3.timeFormat('%Y-%m-%d %H:%M:%S')(parseDate(d['time']))
                    });
                tooltip.style('left', (x(parseDate(d['time'])) + 0.11 * _width)+'px')
                    .style('top', (y(parseInt(d[y_attr])) - 0.15 * _height) + 'px')
                    .style('width', (Math.min(500, (_width - (x(parseDate(d['time'])) + 0.11 * _width))) + 'px'))
                    .style('visibility', 'visible');

            })
            .on('mouseout', (e, d) => {
                // remove tooltip
                let tooltip = d3.select('#page2_tooltip');
                tooltip.style('visibility', 'hidden');
            })
        page2_svg.append('g')
            .selectAll('line')
            .data(old_time)
            .enter().append('line')
            .attr('class', 'timeline')
            .attr('y1', page2_padding.top - 20)
            .attr('y2', page2_height - page2_padding.bottom)
            .attr('x1', (d, i) => { console.log(d); return x(d); })
            .attr('x2', (d, i) => x(d))
            .attr("stroke", "gray")
            .attr("stroke-width", 1.5)
            .attr('opacity', 0.5)
            .attr('stroke-dasharray', '10, 10')
            .style('visibility', function () {
                let idx = $("#select_page2_timeline option:selected").val();
                if (idx == 0)
                    return 'visible';
                else
                    return 'hidden';
            });
        page2_svg.append('g')
            .selectAll('line')
            .data(postpone)
            .enter().append('line')
            .attr('class', 'timeline')
            .attr('y1', page2_padding.top)
            .attr('y2', page2_height - page2_padding.bottom)
            .attr('x1', (d, i) => { console.log(d); return x(d); })
            .attr('x2', (d, i) => x(d))
            .attr("stroke", "gray")
            .attr("stroke-width", 1.5)
            .attr('opacity', 0.5)
            .style('visibility', function () {
                let idx = $("#select_page2_timeline option:selected").val();
                if (idx == 0)
                    return 'visible';
                else
                    return 'hidden';
            });
        page2_svg.append('g')
            .selectAll('line')
            .data(important_time)
            .enter().append('line')
            .attr('class', 'timeline')
            .attr('y1', page2_padding.top)
            .attr('y2', page2_height - page2_padding.bottom)
            .attr('x1', (d, i) => { console.log(d); return x(d); })
            .attr('x2', (d, i) => x(d))
            .attr("stroke", "red")
            .attr("stroke-width", 1.5)
            .attr('opacity', 0.5)
            .style('visibility', function () {
                let idx = $("#select_page2_timeline option:selected").val();
                if (idx == 0)
                    return 'visible';
                else
                    return 'hidden';
            });
        text_gray = page2_svg.append('g')
            .selectAll('text')
            .data(timetext_gray)
            .enter().append('text')
            .text(d => d[1])
            .attr('x', d => x(d[0]) - 20)
            .attr('y', d => (page2_padding.top - 2 + d[2]))
            .attr("font-size", 14)
            .attr('fill', 'gray')
            .style('visibility', function () {
                let idx = $("#select_page2_timeline option:selected").val();
                if (idx == 0)
                    return 'visible';
                else
                    return 'hidden';
            });
        text_red = page2_svg.append('g')
            .selectAll('text')
            .data(timetext_red)
            .enter().append('text')
            .text(d => d[1])
            .attr('x', d => x(d[0]) - 20)
            .attr('y', d => (page2_padding.top - 2 + d[2]))
            .attr("font-size", 14)
            .attr('fill', 'red')
            .style('visibility', function () {
                let idx = $("#select_page2_timeline option:selected").val();
                if (idx == 0)
                    return 'visible';
                else
                    return 'hidden';
            });
        legend_data = [['SteelBlue', 'positive sentiment', 0.0], ['yellow', 'negative sentiment', 0.3]];
        rect_width = page2_padding.left * 0.3;
        rect_height = page2_padding.top * 0.1;
        legend = page2_svg.append('g')
        legend.selectAll('rect')
            .data(legend_data)
            .enter().append('rect')
            .attr('width', rect_width)
            .attr('height', rect_height)
            .attr('fill', d=> d[0])
            .attr('x', page2_padding.left * 0.1)
            .attr('y', d=> (page2_padding.top * (0.2 + d[2])))
        legend.selectAll('text')
            .data(legend_data)
            .enter().append('text')
            .text(d => d[1])
            .attr('x', page2_padding.left * 0.5)
            .attr('y', d => (page2_padding.top * (0.3 + d[2])))
            .attr('font-size', 14);
    },

    change_y_axis() {
        let idx = $("#select_page2_y_axis option:selected").val();
        if (idx == 0)
            page2.draw('retweet-cnt');
        else
            page2.draw('favorite-cnt');
    },

    change_timeline() {
        let idx = $("#select_page2_timeline option:selected").val();
        if (idx == 0) {
            text_gray.style('visibility', 'visible');
            text_red.style('visibility', 'visible');
            page2_svg.selectAll('line').style('visibility', 'visible');
        }
        else {
            text_gray.style('visibility', 'hidden');
            text_red.style('visibility', 'hidden');
            page2_svg.selectAll('line').style('visibility', 'hidden');
        }
            
    }
    
}

//Function passed to PageMain will be called after DOM and all dependencies init.
PageMain(() => {
    page2.hello()    
})