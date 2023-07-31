const jsdom = require("jsdom");
const { JSDOM } = jsdom;


function getURLsFromHTML(htmlBody, baseURL) {
    const urls = []
    const dom = new JSDOM(htmlBody) //creates a document object model of the html file
    const linkElements = dom.window.document.querySelectorAll('a')
    for (const link of linkElements) {
        if (link.href.slice(0, 1) === '/') {
            //relative
            try {
                const urlObj = new URL(`${baseURL}${link.href}`)
                urls.push(urlObj.href)
            } catch (err) {
                console.log(`err`)
            }
        } else {
            //absolute
            try {
                const urlObj = new URL(link.href)
                urls.push(urlObj.href)
            } catch (err) {
                console.log(`err`)
            }
        }
    }
    console.log(urls)
    return urls
}



function normalizeURL(urlString) {
    const urlObj = new URL(urlString)
    const hostpath = `${urlObj.hostname}${urlObj.pathname}` //strips protocols
    if (hostpath.length > 0 && hostpath.slice(-1) === '/') { //strips trailing slashes
        return hostpath.slice(0, - 1)
    }
    return hostpath
}

module.exports = {
    normalizeURL,
    getURLsFromHTML
}