'use strict';

const request = require('requestretry')
const parser = require('cheerio')
const utils = require('./utils')
const moment = require('moment-timezone')
const zone = "Asia/Kuala_Lumpur"

const URL = 'http://www.pos.com.my/postal-services/quick-access/?track-trace'

const malaysiaPos = {}

/**
 * Get malaysiaPos info
 * Scraps the Correos Express website
 * Async
 *
 * Design changes may break this code!!
 * @param id
 * @param postalcode
 * @param callback(Error, CorreosInfo)
 */
malaysiaPos.getInfo = function (id, postalcode, callback) {
    obtainInfo(URL, id, postalcode, callback)
}

/**
 * Get info from malaysiaPos page
 *
 * @param action
 * @param id
 * @param postalcode
 * @param cb
 */
function obtainInfo(action, id, cb) {
    request.post({
        url: action,
        form: {
            trackingNo03: id
        },
        timeout: 20000
    }, function (error, response, body) {
        if (error || response.statusCode != 200) {
            cb(utils.errorDown())
            return
        }

        // Not found
        if (body.indexOf('Please insert the correct Tracking Number.') != -1) {
            cb(utils.errorNoData())
            return
        }

        let entity = null
        try {
            entity = createMalaysiaPosEntity(body)
        } catch (error) {
            return cb(utils.errorParser(id, error.message))
        }

        cb(null, entity)
    })
}

/**
 * Create malaysiaPos entity from html
 * @param html
 */
function createMalaysiaPosEntity(html) {

    let $ = parser.load(html)
    let id = $('#trackingNo03').get(0).children[0].data.trim()
    let init = html.indexOf("var strTD")
    init = html.indexOf('"', init + 1)
    let fin = html.indexOf('"', init + 1)
    let strTD = html.substring(init, fin)

    $ = parser.load(strTD)
    let trs = $('#tbDetails tbody tr')
    let states = utils.tableParser(
        trs,
        {
            'date': {
                'idx': 0,
                'mandatory': true,
                'parser': elem => {
                    return moment.tz(elem, 'DD MMM YYYY HH:mm:ss', 'en', zone).format()
                }
            },
            'state': {'idx': 1, 'mandatory': true},
            'area': {'idx': 2}
        },
        elem => {
            // On Maintenance there is a row with a td colspan=4, we want to skip it
            if(elem.children[0].attribs && elem.children[0].attribs.colspan &&
                elem.children[0].attribs.colspan == 4) {
                return false
            }

            return true
        })

    return new MalaysiaInfo({
        id: id,
        state: states[0].state,
        states: states
    })
}

/*
 |--------------------------------------------------------------------------
 | Entity
 |--------------------------------------------------------------------------
 */
function MalaysiaInfo(obj) {
    this.id = obj.id
    this.state = obj.state
    this.states = obj.states
    this.trackerWebsite = malaysiaPos.getLink(null)
}

malaysiaPos.getLink = function (id) {
    return URL
}

module.exports = malaysiaPos