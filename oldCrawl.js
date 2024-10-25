const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const baseURL = 'https://transfermarkt.co.uk'


const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://danielspicer:Scrappy2003@cluster0.qs66vcb.mongodb.net/test?retryWrites=true&w=majority"
const client = new MongoClient(uri);

// import Squad from './Squad.js'
const { Collection } = require('./Collection.js')

async function crawlPage(currentURL) {
    console.log(`crawling ${currentURL}`)

    try {

        const resp = await fetch(currentURL)
        const htmlBody = (await resp.text())

        let collection = new Collection(htmlBody);
        console.log(collection.getSquads());




        // const squadURLs = await getSquadURLs(htmlBody, baseURL) //get the squad urls WORKING
        
        // const playerURLs = await getSquadInfo(squadURLs, baseURL) //get the player links from each team

        // const realPlayers = await getPlayerStats(playerURLs, baseURL)

        // console.log('out')

        // console.log(realPlayers.length)

        // run(realPlayers)

    } catch (err) {
        console.log("error")
    }


}
async function run(players) {
    try {
        await client.connect();
        const db = client.db('test');
        const collection = db.collection('players');
        for (const player of players) {
            const result = await collection.insertOne(player)
        }
        console.log("Finished")
    } catch (err) {
        console.log(err)
    } finally {
        // Close the database connection when finished or an error occurs
        await client.close();
    }
}


async function getSquadInfo(squadURLs, baseURL) {
    const playerLinks = []
    for (const url of squadURLs) {
        try {
            const resp = await fetch(url)

            const htmlBody = (await resp.text())
            
            playerLinks.push(getPlayerLinks(htmlBody, baseURL))

        } catch (err) {
            console.log("error in getSquadInfo")
        }
    }
    const playerObjectArray = []
    for (const squad of playerLinks) {
        playerObjectArray.push(getPlayerAttributes(squad))
    }
    return playerLinks

}

async function getPlayerStats(playerURLs, baseURL) {
    const playerObjs = []
    for (const team of playerURLs) {
        for (const player of team)
            try {
                const resp = await fetch(player)
                const htmlBody = (await resp.text())
                playerObjs.push(getPlayerAttributes(htmlBody, player))

            } catch (err) {
                console.log("err in getPlayerStats")
            }
    }
    return playerObjs
}

function getPlayerLinks(htmlBody, baseURL) {
    const dom = new JSDOM(htmlBody) //creates a document object model of the html file
    const playerURLs = []

    let table = dom.window.document.querySelectorAll('table.inline-table tbody tr td.hauptlink a');
    if (table.length > 0) {
        table.forEach(player => {
            playerURLs.push(`${baseURL}${player.href}`);
        })
    }
    return playerURLs
}

function getPlayerAttributes(htmlBody, playerURL) {
    const dom = new JSDOM(htmlBody) //creates a document object model of the html file
    // const textElements = dom.window.document.getElementsByClassName('info-table__content info-table__content--regular') //gets the table elements
    // const statElements = dom.window.document.getElementsByClassName('info-table__content info-table__content--bold') //gets the table elements
    // const playerImage = dom.window.document.getElementsByClassName('data-header__profile-image')



    var temp = Array.prototype.slice.call(playerImage)

    const statElementsNeeded = []
    const textElementsNeeded = []
    var playerObj = { name: "", age: "", height: "", country: "", pos: "", foot: "", club: "", photo: "" }
    var playerURLString = String(playerURL)
    var playerName = String((playerURLString.replace(baseURL, "").split("/")[1]))
    var finalName = []

    count = 0
    for (const part of playerName.split("-")) {
        count++
        const toAdd = part.charAt(0).toUpperCase() + part.slice(1);
        finalName.push(String(toAdd))
    }
    commaCount = 0
    indexCount = 0
    const stringName = finalName.toString()
    let name = ""

    for (let letter of stringName) {
        if (letter == ",") {
            commaCount++;
            if (count == 2 && commaCount == 1) {
                name += " "
            } else if (count == 3 && commaCount == 1) {
                name += " "
            } else if (count == 3 && commaCount == 2) {
                name += "-"
            } else if (count == 4 && commaCount > 1) {
                name += "-"
            }
        } else {
            name += letter
        }
        indexCount++
    }

    playerObj['name'] = name
    playerObj['photo'] = temp[0] ? temp[0].src : "filler"

    var count = 0
    var textElArray = Array.prototype.slice.call(textElements)
    for (const text of textElArray) {
        var txtValue = (text.innerHTML.trim())
        switch (txtValue) {
            case "Age:":
                textElementsNeeded.push(count)
                break;
            case "Height:":
                textElementsNeeded.push(count)
                break;
            case "Citizenship:":
                textElementsNeeded.push(count)
                break;
            case "Position:":
                textElementsNeeded.push(count)
                break;
            case "Foot:":
                textElementsNeeded.push(count)
                break;
            case "Current club:":
                textElementsNeeded.push(count)
                break;

        }
        count++;
    }

    var count = 0
    for (const stat of statElements) {
        if (textElementsNeeded.includes(count)) {
            statElementsNeeded.push(stat)
        }
        count++;
    }
    var objStatsNeeded = []
    var count = 0
    for (const el of statElementsNeeded) {
        if (count == 2) {
            objStatsNeeded.push(el.children[0].src)
        } else if (count == 5) {
            var tempLink = ((Array.prototype.slice.call(el.children))[0].children[0])
            var imgLink = (tempLink.srcset.split(',')[1].trim().split(' ')[0])
            objStatsNeeded.push(imgLink)
        }
        else if (count == 6) {
            objStatsNeeded.push(temp[0].src)
        }
        else {

            objStatsNeeded.push(el.firstChild.textContent.trim())
        }
        count++;
    }
    var count = 0
    for (const stat of objStatsNeeded) {
        switch (count) {
            case 0: //age
                playerObj[Object.keys(playerObj)[count + 1]] = stat;
                break;
            case 1: //height
                playerObj[Object.keys(playerObj)[count + 1]] = `${stat[0]}${stat[2]}${stat[3]}`
                break;
            case 2://country
                playerObj[Object.keys(playerObj)[count + 1]] = stat
                break;
            case 3: //pos
                if (stat.includes("Forward")) {
                    playerObj[Object.keys(playerObj)[count + 1]] = `FWD`
                } else if (stat.includes("Left Winger")) {
                    playerObj[Object.keys(playerObj)[count + 1]] = `FWD`
                } else if (stat.includes("Right Winger")) {
                    playerObj[Object.keys(playerObj)[count + 1]] = `FWD`
                } else if (stat.includes("Second Striker")) {
                    playerObj[Object.keys(playerObj)[count + 1]] = `FWD`
                } else if (stat.includes("Attacking Midfield")) {
                    playerObj[Object.keys(playerObj)[count + 1]] = `MID`
                } else if (stat.includes("Central Midfield")) {
                    playerObj[Object.keys(playerObj)[count + 1]] = `MID`
                } else if (stat.includes("Right Midfield")) {
                    playerObj[Object.keys(playerObj)[count + 1]] = `MID`
                } else if (stat.includes("Left Midfield")) {
                    playerObj[Object.keys(playerObj)[count + 1]] = `MID`
                } else if (stat.includes("Defensive Midfield")) {
                    playerObj[Object.keys(playerObj)[count + 1]] = `MID`
                } else if (stat.includes("Back")) {
                    playerObj[Object.keys(playerObj)[count + 1]] = `DEF`
                } else if (stat.includes("keeper")) {
                    playerObj[Object.keys(playerObj)[count + 1]] = `GK`
                }
                else {
                    playerObj[Object.keys(playerObj)[count + 1]] = `ERROR`
                }
                break;
            case 4: //foot
                playerObj[Object.keys(playerObj)[count + 1]] = stat.charAt(0).toUpperCase()
                break;
            case 5: //club
                playerObj[Object.keys(playerObj)[count + 1]] = stat
                break;
        }
        count++;

    }
    return playerObj
}


function getSquadURLs(htmlBody, baseURL) {
    const dom = new JSDOM(htmlBody) //creates a document object model of the html file
    const linkParentElements = dom.window.document.getElementsByClassName('no-border-links hauptlink') //gets the table elements
    var count = 0
    const parentList = []
    for (const parent of linkParentElements) {
        if (count < 20) {
            parentList.push(parent)
        }
        count++;
    }
    const squadLinks = []
    for (const link of parentList) {
        var test = link.firstChild.href
        if (test.slice(0, 1) === '/') {
            //relative
            try {
                const urlObj = new URL(`${baseURL}${test}`)
                squadLinks.push(urlObj.href)
            } catch (err) {
                console.log(`err`)
            }
        } else {
            //absolute
            try {
                const urlObj = new URL(test)
                squadLinks.push(urlObj.href)
            } catch (err) {
                console.log(`err`)
            }
        }
    }
    return squadLinks
}


function getURLsFromHTML(htmlBody, baseURL) {
    const urls = []
    const dom = new JSDOM(htmlBody) //creates a document object model of the html file
    const linkElements = dom.window.document.querySelectorAll('a')

    for (const link of linkElements) {
        if (link.href.slice(0, 1) === '/') {
            //relative
            try {
                const urlObj = new URL(`${baseURL}${link.href} `)
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
                console.log("err in getURLsFromHTML")
            }
        }
    }
    return urls

}



function normalizeURL(urlString) {
    const urlObj = new URL(urlString)
    const hostpath = `${urlObj.hostname}${urlObj.pathname} ` //strips protocols
    if (hostpath.length > 0 && hostpath.slice(-1) === '/') { //strips trailing slashes
        return hostpath.slice(0, - 1)
    }
    return hostpath
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage,
    run
}