'use strict';

const request = require('requestretry').defaults({ maxAttempts: 3, retryDelay: 1000 })
const parser = require('cheerio')
const utils = require('./utils')
const moment = require('moment-timezone')
const zone = "Europe/Amsterdam"

const URL = 'http://www.postnl.post/details/'

const postNL = {}

/**
 * Get DirectLink info
 * Async
 *
 * @param id
 * @param callback(Error, DirectLinkInfo)
 */
postNL.getInfo = function (id, callback, _try = 0) {
    if(_try >= 3){
        return callback(utils.getError('BUSY'))
    }
    request.post({
        url: URL,
        form: {
            barcodes: id
        },
        timeout: 20000
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
            entity = createPostNLEntity(id, body)
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

function createPostNLEntity(id, html) {

    let $ = parser.load(html)
    let states = utils.tableParser(
        $('#datatables tbody tr'),
        {
            'date': {'idx': 1, 'mandatory': true, 'parser': elem => { return moment.tz( elem, 'DD-MM-YYYY HH:mm:ss.S', 'en', zone).format()}},
            'state': { 'idx': 3, 'mandatory': true },
            'area': { 'idx': 5 }
        },
        () => true)

    return new PostNLInfo({
        'id': id,
        'states': states
    })
}

/*
 |--------------------------------------------------------------------------
 | Entity
 |--------------------------------------------------------------------------
 */
function PostNLInfo(obj) {
    this.id = obj.id
    this.state = obj.states[0].state
    this.states = obj.states
    this.trackerWebsite = "http://www.postnl.post/tracktrace"
}

module.exports = postNL