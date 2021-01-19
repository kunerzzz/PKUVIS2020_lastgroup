/* Javascript for {{ pageName }} */
let {{ pageName }} = {
    hello() {
        console.log("Hello, {{ pageName }}")
    }

    //Your Content Here

}

//Function passed to PageMain will be called after DOM and all dependencies init.
PageMain(() => {
    {{ pageName }}.hello()

    //Your Content Here
    
})