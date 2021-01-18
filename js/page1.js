/* Javascript for page2 */
let page1 = {
    hello() {
        console.log("Are you ok, page1")
    }

    //Your Content Here

}

var page1_dispatch = d3.dispatch('load')

function ranklist() {

}

function wordcloud() {
    d3.select('#wordcloud-container')
        .append('svg')

}

function load_data() {
}


//Function passed to PageMain will be called after DOM and all dependencies init.
PageMain(() => {
    console.log(11111)
    page1.hello()
    console.log(11111)
    console.log(d3.select('#info-container').node().getBoundingClientRect())
    //Your Content Here
    
})