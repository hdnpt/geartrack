'use strict';

const sprintf = require('sprintf')
const request = require('requestretry').defaults({ maxAttempts: 3, retryDelay: 1000 })
const parser = require('cheerio')

const URL = 'http://www.sky56.cn/track/track/result?tracking_number=%s'

const sky = {}

/**
 * Get Sky56 info
 * Supports PQ... and NL... LVS.. SYB.. ids
 * Async
 *
 * @param id
 * @param callback(Error, SkyInfo)
 */
sky.getInfo = function (id, callback) {
    request(sprintf(URL, id), function (error, response, body) {
        if (error || response.statusCode != 200) {
            callback(error)
            return
        }

        const json = JSON.parse(body)

        // Not found
        if (json.message.indexOf('No result found for your query.') != -1) {
            callback(new Error("No data or invalid data provided!"))
            return
        }

        let entity = null
        switch(id.charAt(0)) {
            case 'N': // Netherlands Post surface mail
            case 'L': // Bpost is the same
            case 'S': // Malasya Pos
                entity = createNLSkyEntity(id, json)
                break
            default: // Spain express, correos line
                entity = createSkyEntity(id, json)
        }

        callback(null, entity)
    })
}

/*
|--------------------------------------------------------------------------
| Correos Line Parse
|--------------------------------------------------------------------------
*/
/**
 * Create SkyInfo entity from json
 * @param id
 * @param json
 */
function createSkyEntity(id, json) {
    let infos = json.message.split('<br/>')
    let messages = infos.splice(infos.length - 4,4)
    let table = messages[messages.length-1]

    let states = parseStatusTable(table)

    let parsedMessages = infos.map(message => {
        let idx1 = message.indexOf(" ")
        let idx2 = message.indexOf(" ", idx1+1)
        let date = message.substr(0, idx2)
        let m = message.substr(idx2 + 1, message.length)
        return {
            date: date,
            message: m.trim()
        }
    })

    return new SkyInfo({
        id: id,
        'messages': parsedMessages,
        'status': states
    })
}


function SkyInfo(obj) {
    this.id = obj.id
    this.messages = obj.messages
    this.status = obj.status

    this.isNL = () => {
        return this.id.charAt(0) == 'N'
    }
}

/*
|--------------------------------------------------------------------------
| Netherlands Post surface mail Parse
|--------------------------------------------------------------------------
*/
function createNLSkyEntity(id, json) {
    let infos = json.message.replace('，', ',').split('<br/>').filter(m => m.length != 0)

    let messages = null

    if(infos[0].indexOf("span") !== -1) { // title
        infos.splice(0, 1) //remove first element
    }

    if(infos[0].indexOf("table") !== -1) {
        let table = infos.splice(0, 1) //remove first element
        messages = parseStatusTable(table[0])
    }

    let parsedStatus = infos.map(message => {
        let idx1 = message.indexOf(",")
        let idx2 = message.indexOf("--", idx1+1)
        let area = message.substr(0, idx1)
        let status = message.substr(idx1+1, idx2 - idx1 - 1)
        let date = message.substr(idx2 + 2)
        return {
            area: area,
            status: status.trim().capitalizeFirstLetter(),
            date: date
        }
    })

    return new SkyInfo({
        id: id,
        status: parsedStatus,
        messages: messages
    })
}


/*
|--------------------------------------------------------------------------
| Utils
|--------------------------------------------------------------------------
*/
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}

function parseStatusTable(tableHtml) {
    let $ = parser.load(tableHtml)

    let states = []
    const fields = ['date', 'area', 'status']
    $('tr').each(function (i) {
        if(i == 0) return

        let state = {}

        $(this).children().each(function (s) {
            state[fields[s]] = $(this).text()
        })
        states.push(state)
    })

    return states.reverse()
}

module.exports = sky