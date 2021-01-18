/* Javascript for page2 */
let page2 = {
    hello() {
        console.log("Hello, page2")
    }

    //Your Content Here

}

//Function passed to PageMain will be called after DOM and all dependencies init.
PageMain(() => {
    page2.hello()

    //Your Content Here
    
})