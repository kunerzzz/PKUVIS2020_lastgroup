/* Javascript for _sample */
let _sample = {
    setGroupName: function (name) {
        $('#sample-group-name').text(name)
    },

    setAuthors: (authors) => {
        d3.select('#sample-author-wrap')
            .selectAll('p')
            .data(authors)
            .enter()
            .append('p')
            .text(d => `- ${d}`)
    }
}

//Function passed to PageMain will be called after DOM and all dependencies init.
PageMain(() => {
    d3.json('../data/_sample.json')
        .then((data) => {
            _sample.setGroupName(data.group_name)
            _sample.setAuthors(data.authors)
        })
})