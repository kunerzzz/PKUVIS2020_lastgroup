/* Javascript for page3 */
let page3 = {
    hello() {
        console.log("Hello, page3")
    }

    //Your Content Here

}

//Function passed to PageMain will be called after DOM and all dependencies init.
PageMain(() => {
    page3.hello()

    //Your Content Here
    
})