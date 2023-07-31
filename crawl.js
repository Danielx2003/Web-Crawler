function normalizeURL(urlString) {
    const urlObj = new URL(urlString)
    const hostpath = `${urlObj.hostname}${urlObj.pathname}` //strips protocols
    if (hostpath.length > 0 && hostpath.slice(-1) === '/') { //strips trailing slashes
        return hostpath.slice(0, - 1)
    }
    return hostpath
}

module.exports = {
    normalizeURL
}