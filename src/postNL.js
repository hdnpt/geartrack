'use strict';

const request = require('requestretry').defaults({ maxAttempts: 3, retryDelay: 1000 })
const parser = require('cheerio')
const utils = require('./utils')
const moment = require('moment-timezone')
const zone = "Europe/Amsterdam"

const URL_BASE = 'http://www.postnl.post'
const URL_PATH = '/details/'

const postNL = {}

/**
 * Get DirectLink info
 * Async
 *
 * @param id
 * @param callback(Error, DirectLinkInfo)
 */
postNL.getInfo = function (id, callback) {
    obtainInfo(id, URL_BASE + URL_PATH, callback)
}

postNL.getInfoProxy = function (id, proxyUrl, callback) {
    obtainInfo(id, proxyUrl + URL_PATH, callback)
}

function obtainInfo(id, actionUrl, callback) {
    request.post({
        url: actionUrl,
        form: {
            barcodes: id
        },
        timeout: 20000
    }, function (error, response, body) {
        if (error) {
            console.log('error:', error)
            return callback(utils.errorDown())
        }
        if (response.statusCode != 200) {
            console.log('response.statusCode: ', response.statusCode)
            return callback(utils.errorDown())
        }

        if (body.indexOf('The shipment barcode was not found.') != -1){
            return callback(utils.errorNoData())
        }

        let entity = null
        try {
            entity = createPostNLEntity(id, body)
            if (!entity) {
                return callback(utils.errorNoData())
            }
            entity.retries = response.attempts
        } catch (error) {
            return callback(utils.errorParser(id, error.message))
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