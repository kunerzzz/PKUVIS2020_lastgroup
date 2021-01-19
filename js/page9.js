/* Javascript for page9 */
let page9 = {
    hello() {
        console.log("Hello, page9")
    }

    //Your Content Here

}

//Function passed to PageMain will be called after DOM and all dependencies init.
PageMain(() => {
    page9.hello()

    //Your Content Here
    
})