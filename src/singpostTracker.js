'use strict';

const request = require('requestretry')
const parser = require('cheerio')

const URL = 'http://www.singpost.com/track-items'

const singpost = {}

/**
 * Get singpost info
 * Scraps the Singpost website
 * Async
 *
 * Design changes may break this code!!
 * @param id like RF23423423SG
 * @param callback(Error, SingpostInfo)
 */
singpost.getInfo = function (id, callback) {
    request.post({
        url: URL,
        form: {
            track_number: id,
            op: "Check item status",
            captoken: "",
        },
        timeout: 30000,
        maxAttempts: 3,
        retryDelay: 1000,
    }, function (error, response, body) {
        if (error || response.statusCode != 200) {
            callback(error)
            return
        }

        // Not found
        if (body.indexOf('Item status not found in the system.') != -1) {
            callback(new Error("No data or invalid data provided!"))
            return
        }

        const entity = createSingpostEntity(id, body)
        entity.retries = response.attempts
        callback(null, entity)
    })
}


/**
 * Create singpost entity from html
 * @param id
 * @param html
 */
function createSingpostEntity(id, html) {
    let $ = parser.load(html)

    let date = []
    $('span.tacking-date').each(function (i, elem) {
        date.push($(this).text().trim())
    })

    let status = []
    $('div.tacking-status').each(function (i, elem) {
        status.push($(this).text().trim())
    })

    let messages = []
    for(let i = 0; i < date.length; i++) {
        messages.push({
            date: date[i],
            status: status[i]
        })
    }

    return new SingpostInfo(id, messages)
}

/*
|--------------------------------------------------------------------------
| Entity
|--------------------------------------------------------------------------
*/
function SingpostInfo(id, messages) {
    this.id = id
    this.messages = messages
}

/*
|--------------------------------------------------------------------------
| Utils
|--------------------------------------------------------------------------
*/

module.exports = singpost