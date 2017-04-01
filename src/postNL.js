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
            entity = createPostNLEntity(id, body)
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

function createPostNLEntity(id, html) {

    let $ = parser.load(html)

    let table = $('#datatables tbody tr')

    let states = []

    table.each(function (i, elem) {

        if(elem.children !== undefined){
            let state = {
                'date': moment.tz(elem.children[1].children[0].data.trim(), "DD-MM-YYYY HH:mm:ss.S", zone).format(),
                'state': elem.children[3].children[0].data.trim()
            }
            if(elem.children[5] !== undefined){
                state.area = elem.children[5].children[0].data.trim()
            }
            states.push(state)
        }

    })

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
}

module.exports = postNL