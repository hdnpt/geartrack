'use strict';

const request = require('requestretry')
const parser = require('cheerio')
const utils = require('./utils')
const moment = require('moment-timezone')
const zone = "Europe/Lisbon"

const URL = 'http://www.cttexpresso.pt/feapl_2/app/open/cttexpresso/objectSearch/objectSearch.jspx?lang=def&objects='

const ctt = {}

/**
 * Get CTT info
 * Scraps the CTT website
 * Async
 *
 * Design changes may break this code!!
 * @param id like RQ02341279MY & RF432233044SG
 * @param callback(Error, CttInfo)
 */
ctt.getInfo = function (id, callback) {
    request.get({
        url: URL + id,
        timeout: 30000,
        maxAttempts: 3,
        retryDelay: 1000,
    }, function (error, response, body) {
        if (error || response.statusCode != 200) {
            return callback(utils.getError('DOWN'))
        }

        // Not found
        if (body.indexOf('Não foi possível obter mais informação sobre o objeto.') != -1 ||
            body.indexOf('Insira pelo menos 10 caracteres') != -1) {
            return callback(utils.getError('NO_DATA'))
        }

        createCttEntity(id, body, (err, result) => {
            if(err)
                return callback(utils.getError('PARSER'))

            result.retries = response.attempts
            callback(null, result)
        })
    })
}


function htmlBeautify(html){

    let firstTableIdx = html.indexOf('<table class="full-width">')
    let secondTableIdx = html.indexOf('<table class="full-width">', firstTableIdx + 1)

    let secondTableEndIdx = html.indexOf('</table>', secondTableIdx)+8
    let firstTableEndIdx = html.indexOf('</table>', secondTableEndIdx)+8

    html = html.substring(firstTableIdx, firstTableEndIdx).replace(/\r/g, "").replace(/\n/g, "").replace(/\t/g, "")
        .replace(/  /g, " ")
        .replace(/<thead>/g, "").replace(/<\/thead>/g, "")
        .replace(/<tr class="group"><td colspan="5">/g, "<td>")
        .replace(/<\/tr><td>/g, "<td>")

    return html

}

/**
 * Create ctt entity from html
 * @param id
 * @param html
 * @param cb
 */
function createCttEntity(id, html, cb) {

    let state = null
    let messages = []

    try {
        html = htmlBeautify(html)
        let $ = parser.load(html)

        let table = $('table.full-width tr').get(1).children.filter(e => e.type == 'tag')

        let dayAndHours = table[2].children[0].data.trim() + ' ' + table[3].children[0].data.trim()
        state = {
            date: moment.tz(dayAndHours, "YYYY/MM/DD HH:mm", zone).format()
        }

        if(table[4].children.length == 0) {
            state['status'] = 'Sem estado'
        } else {
            if(table[4].children[0].data) {
                state['status'] = table[4].children[0].data.trim()
            } else {
                state['status'] = table[4].children[0].children[0].data.trim()
            }
        }

        let details = $('#details_0').find('tr')

        let day = ""
        let dayUnformated = ""
        let message = {}
        for(let i = 0; i < details.length; i++) {
            let tr = details.get(i)
            if(tr.children.length >= 8){
                let idxsum = 0

                if(tr.children.length >= 9) {
                    day = tr.children[0].children[0].data.trim()
                    dayUnformated = day.split(',')[1].trim()
                    day = moment.tz(dayUnformated, "DD MMMM YYYY", 'pt', zone).format()
                    message = {
                        day: day,
                        status: []
                    }
                    messages.push(message)
                    idxsum = 1
                }

                let hours = tr.children[0+idxsum].children[0].data.trim()
                let time = moment.tz(dayUnformated + ' ' + hours, "DD MMMM YYYY HH:mm", 'pt', zone).format()
                let add = {
                    time: time,
                    status: tr.children[2+idxsum].children[0].data.trim(),
                    local: tr.children[6+idxsum].children[0].data.trim()
                }
                message.status.push(add)
            }
        }

    } catch (error) {
        return cb(error)
    }

    cb(null, new CttInfo(id, state, messages))

}

/*
|--------------------------------------------------------------------------
| Entity
|--------------------------------------------------------------------------
*/
function CttInfo(id, state, messages) {
    this.id = id
    this.state = state
    this.messages = messages
    this.trackerWebsite = URL + id
}

/*
|--------------------------------------------------------------------------
| Utils
|--------------------------------------------------------------------------
*/

module.exports = ctt