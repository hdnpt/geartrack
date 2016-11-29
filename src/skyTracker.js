'use strict';

const request = require('request')
const parser = require('cheerio')

const URL = 'http://www.sky56.cn/track/track/result?tracking_number='

const sky = {}

/**
 * Get Sky56 info
 * Async
 *
 * @param id
 * @param callback(Error, SkyInfo)
 */
sky.getInfo = function (id, callback) {
    request(URL + id, function (error, response, body) {
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

       let entity = createSkyEntity(json)
        callback(null, entity)
    })
}

/**
 * Create SkyInfo entity from json
 * @param json
 */
function createSkyEntity(json) {
    let infos = json.message.split('<br/>')
    let messages = infos.splice(infos.length - 4,4)
    let table = messages[messages.length-1]
    let $ = parser.load(table)

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
        'messages': parsedMessages,
        'status': states
    })
}

/*
 |--------------------------------------------------------------------------
 | Entity
 |--------------------------------------------------------------------------
 */
function SkyInfo(obj) {
    this.messages = obj.messages
    this.status = obj.status
}

module.exports = sky