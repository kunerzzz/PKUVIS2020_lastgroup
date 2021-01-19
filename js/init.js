let _pageMainList = []

let _finishInit = false

function PageMain(pageMain) {
    if (typeof (pageMain) != 'function')
        throw `pageMain should be function, not ${type(pageMain)}`
    _pageMainList.push(pageMain)
}

let _main = function () {
    //Init fullPage.js
    //See all options in https://github.com/alletotrigo/fullPage.js#vanilla-js-example-with-all-options
    $('#fullpage').fullpage({
        //options here
    });

    for (let pageMain of _pageMainList) {
        pageMain()
    }

    _finishInit = false
}

$(_main)