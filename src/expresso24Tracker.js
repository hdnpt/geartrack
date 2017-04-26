'use strict';

const request = require('requestretry')
const parser = require('cheerio')
const utils = require('./utils')
const moment = require('moment-timezone')
const zone = "Europe/Lisbon"

const URL = 'http://www.expresso24.pt/index.php?action=pesquisaguias3'

const expresso = {}

/**
 * Get expresso24 info
 * Scraps the Expresso24 website
 * Async
 *
 * Design changes may break this code!!
 * @param id like ES12312332
 * @param callback(Error, ExpressoInfo)
 */
expresso.getInfo = function (id, callback) {
    request.post({
        url: URL,
        form: {
            ref_cliente: id
        },
        timeout: 30000,
        maxAttempts: 3,
        retryDelay: 1000,
        encoding: 'latin1'
    }, function (error, response, body) {
        if (error || response.statusCode != 200) {
            return callback(utils.getError('DOWN'))
        }

        // Not found
        if (body.indexOf('Nenhuma guia encontrada com esta') != -1) {
            return callback(utils.getError('NO_DATA'))
        }

        let entity = null
        try {
            entity = createExpressoEntity(body)
            entity.retries = response.attempts
        } catch (error) {
            console.log(error);
            return callback(utils.getError('PARSER'))
        }

        callback(null, entity)
    })
}


/**
 * Create expresso entity from html
 * @param html
 */
function createExpressoEntity(html) {
    let $ = parser.load(html)

    let data = []
    $('table span').each(function (i, elem) {
        if(i >= 10 )
            data.push($(this).text().trim().replace(/\s\s+/g, ' '))
    })

    return new ExpressoInfo({
        'guide': data[0],
        'origin': data[1],
        'date': moment.tz(data[2], "YYYY-MM-DD", zone).format(),
        'status': data[3],
        'weight': data[4],
        'parcels': data[5],
        'receiver_name': data[6],
        'address': parseAddress(data[7]),
        'refund': data[8],
        'ref': data[9],
    })
}

/*
|--------------------------------------------------------------------------
| Entity
|--------------------------------------------------------------------------
*/
function ExpressoInfo(obj) {
    this.guide = obj.guide
    this.origin = obj.origin
    this.date = obj.date
    this.status = obj.status
    this.weight = parseFloat(obj.weight)
    this.parcels = parseInt(obj.parcels)
    this.receiver_name = obj.receiver_name
    this.address = obj.address
    this.refund = obj.refund
    this.ref = obj.ref
    this.trackerWebsite = URL
}

/*
|--------------------------------------------------------------------------
| Utils
|--------------------------------------------------------------------------
*/
function parseAddress(addr) {
    return addr.replace(/(ATT .)/g, ' $1')
}

module.exports = expresso