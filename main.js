const { crawlPage } = require('./crawl.js');


function main() {
    if (process.argv.length < 3) {
        console.log("No URL Supplied.")
        process.exit(1)
    } else if (process.argv.length > 3) {
        console.log("Too many arguments.")
        process.exit(1)
    }

    const url = process.argv[2];

    crawlPage(url);
}
main()


