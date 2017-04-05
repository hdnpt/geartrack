'use strict';

const request = require('requestretry').defaults({ maxAttempts: 3, retryDelay: 1000 })
const parser = require('cheerio')
const utils = require('./utils')
const moment = require('moment-timezone')
const zone = "Asia/Shanghai" // +8h

const URL = 'http://track.yw56.com.cn/en-US'

const yanwen = {}

/**
 * Get DirectLink info
 * Async
 *
 * @param id
 * @param callback(Error, DirectLinkInfo)
 */
yanwen.getInfo = function (id, callback, _try = 0) {
    if(_try >= 3){
        return callback(utils.getError('BUSY'))
    }
    request.post({
        url: URL,
        form: {
            InputTrackNumbers: id
        },
        timeout: 30000
    }, function (error, response, body) {
        if (error) {
            console.log('error:', error)
            return callback(utils.getError('DOWN'))
        }
        if (response.statusCode != 200) {
            console.log('response.statusCode: ', response.statusCode)
            return callback(utils.getError('DOWN'))
        }

        if (body.indexOf('The shipment barcode was not found.') != -1){
            return callback(utils.getError('NO_DATA'))
        }

        let entity = null
        try {
            entity = createYanwenEntity(id, body)
            if (!entity) {
                return callback(utils.getError('NO_DATA'))
            }
            entity.retries = response.attempts
            entity.busy_count = _try
        } catch (error) {
            console.log(error);
            return callback(utils.getError('PARSER'))
        }

        callback(null, entity)

    })
}

function createYanwenEntity(id, html) {
    let skipLines = 2

    let $ = parser.load(html)
    let trs = $('table tbody tr')

    if(!trs || trs.length == 0) return null;

    let destiny;
    let origin;

    let states = utils.tableParser(
        trs,
        {
            'date': {'idx': 1, 'mandatory': true, 'parser': elem => { return moment.tz( elem, 'YYYY-MM-DD HH:mm', zone).format()}},
            'state': { 'idx': 3, 'mandatory': true }
        },
        (elem) => {
            if(elem.children !== undefined
                && elem.children[1].children !== undefined
                && elem.children[1].children[0].children !== undefined
                && elem.children[1].children[0].children[0].data != undefined)
                if(elem.children[1].children[0].children[0].data.indexOf('Country') != -1){
                    if(elem.children[1].children[0].children[0].data.indexOf('Origin') != -1){
                        origin = elem.children[3].children[0].children[0].data.trim()
                    } else {
                        destiny = elem.children[3].children[0].children[0].data.trim()
                    }
                    return false;
                }
                return true;
            return true;
        })

    return new YanwenInfo({
        'id': id,
        'origin': origin,
        'destiny': destiny,
        'states': states
    })
}

/*
 |--------------------------------------------------------------------------
 | Entity
 |--------------------------------------------------------------------------
 */
function YanwenInfo(obj) {
    this.id = obj.id
    this.origin = obj.origin
    this.destiny = obj.destiny
    this.state = obj.states[0].state
    this.states = obj.states
}

module.exports = yanwen