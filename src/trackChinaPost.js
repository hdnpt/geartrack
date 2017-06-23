'use strict';

const request = require('requestretry').defaults({maxAttempts: 3, retryDelay: 1000})
const parser = require('cheerio')
const utils = require('./utils')
const moment = require('moment-timezone')
const zone = "Asia/Shanghai" // +8h

const URL = 'http://track-chinapost.com/result_china.php'

const directLink = {}

/**
 * Get DirectLink info
 * Async
 *
 * @param id
 * @param callback(Error, DirectLinkInfo)
 * @param _try
 */
directLink.getInfo = function (id, callback, _try = 0) {
    if (_try >= 4) {
        return callback(utils.getError('BUSY'))
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
            return callback(utils.getError('DOWN'))
        }
        if (response.statusCode != 200) {
            console.log('response.statusCode: ', response.statusCode)
            return callback(utils.getError('DOWN'))
        }

        if (body.indexOf('server is busy') != -1) {
            return setTimeout(directLink.getInfo, 2000, id, callback, ++_try)
        }

        if (body.indexOf('is invalid') != -1 || body.indexOf('can not be longer than 13') != -1) {
            return callback(utils.getError('NO_DATA'))
        }

        let entity = null
        try {
            entity = createTrackChinaPostEntity(id, body)
            if (!entity) {
                return callback(utils.getError('NO_DATA'))
            }
            entity.retries = response.attempts
            entity.busy_count = _try
        } catch (error) {
            console.log(id, error)
            return callback(utils.getError('PARSER'))
        }

        callback(null, entity)
    })
}

function createTrackChinaPostEntity(id, html) {

    let $ = parser.load(html)

    let states = utils.tableParser(
        $('table').get(2).children,
        {
            'date': {'idx': 1, 'mandatory': true, 'parser': elem => { return moment.tz(elem, "YYYY/MM/DD HH:mm:ss.S", zone).format()}},
            'state': { 'idx': 3, 'mandatory': true, 'parser': elem => {
                    return elem
                        .replace(/\p{Han}+/, '')
                        .replace(/[\u3400-\u9FBF]/g, '')
                        .replace(/\s{2,}/g, ' ')
                        .replace('，', ',')}
                }

        },
        elem => elem.children)

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
    this.state = obj.states[obj.states.length - 1].state
    this.states = obj.states.reverse()

    this.trackerWebsite = "http://track-chinapost.com/startairmail.php"
}

module.exports = directLink