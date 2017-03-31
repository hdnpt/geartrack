'use strict';

const request = require('requestretry').defaults({ maxAttempts: 3, retryDelay: 1000 })
const parser = require('cheerio')
const moment = require('moment')

const URL = 'http://track-chinapost.com/result_china.php'

const directLink = {}

/**
 * Get DirectLink info
 * Async
 *
 * @param id
 * @param callback(Error, DirectLinkInfo)
 */
directLink.getInfo = function (id, callback, _try = 0) {
    if(_try >= 3){
        callback(new Error("No data beacause tracker server is busy, try again later!"))
        return
    }
    request.post({
        url: URL,
        form: {
            order_no: id
        },
        timeout: 30000
    }, function (error, response, body) {
        if (error) {
            console.log('error:', error)
            return callback(error)
        }
        if (response.statusCode != 200) {
            console.log('response.statusCode: ', response.statusCode)
            return callback(new Error('statuscode: ' + response.statusCode))
        }

        if (body.indexOf('server is busy') != -1) {
            return setTimeout(directLink.getInfo, 2000, id, callback, ++_try)
        }

        if (body.indexOf('is invalid') != -1){
            return callback(new Error("No data or invalid data provided!"))
        }

        const entity = createTrackChinaPostEntity(id, body)
        if (!entity) {
            return callback(new Error("No data or invalid data provided!"))
        }
        entity.retries = response.attempts
        entity.busy_count = _try
        callback(null, entity)
    })
}

function createTrackChinaPostEntity(id, html) {

    let $ = parser.load(html)

    let table = $('table').get(2);

    let states = []

    table.children.forEach(function (elem) {

        if(elem.children !== undefined){
            let state = {
                'date': moment(elem.children[1].children[0].data.trim(), "YYYY/MM/DD HH:mm:ss.S").format(),
                'state': elem.children[3].children[0].data.trim()
                    .replace(/\p{Han}+/,'')
                    .replace(/[\u3400-\u9FBF]/g, '')
                    .replace(/\s{2,}/g,' ')
                    .replace('，', ',')
            }
            states.push(state)
        }

    })

    return new TrackChinaPostInfo({
        'id': id,
        'states': states
    })
}

/*
 |--------------------------------------------------------------------------
 | Entity
 |--------------------------------------------------------------------------
 */
function TrackChinaPostInfo(obj) {
    this.id = obj.id
    this.state = obj.states[obj.states.length-1].state
    this.states = obj.states.reverse()
}

module.exports = directLink