'use strict';

const request = require('requestretry').defaults({timeout: 5000, maxAttempts: 2, retryDelay: 500})
const parser = require('cheerio')
const utils = require('./utils')
const sprintf = require('sprintf')
const moment = require('moment-timezone')
const zone = "Asia/Kolkata" // +5h ist

const URL = 'http://ipsweb.ptcmysore.gov.in/ipswebtracking/IPSWeb_item_events.asp?itemid='

const tracker = {}

/**
 * Get IPS web tracker info
 *
 * @param id
 * @param cb(Error, EntityInfo)
 */
tracker.getInfo = function (id, cb) {
    request(URL + id, function (error, response, body) {
        if (error || response.statusCode != 200) {
            return cb(utils.getError('DOWN'))
        }

        // Not found
        if (body.indexOf('No information, please check your item identifier') !== -1) {
            return cb(utils.getError('NO_DATA'))
        }

        let entity = null
        try {
            entity = createEntity(body, id)
            entity.retries = response.attempts
        } catch (error) {
            console.log(id, error)
            return cb(utils.getError('PARSER'))
        }

        cb(null, entity)
    })
}

/**
 * Create tracker entity from html
 * @param html
 */
function createEntity(html, id) {
    let $ = parser.load(html)

    let trs = $('.tabproperty table tr').slice(2)

    let states = utils.tableParser(trs, {
        date: {
            idx: 1,
            mandatory: true,
            parser: e => moment.tz(e, "MM/DD/YYYY hh:mm a", zone).format()
        },
        country: {
            idx: 3,
            mandatory: true
        },
        area: {
            idx: 5,
            mandatory: true
        },
        state: {
            idx: 7,
            mandatory: true
        }
    }).map(line => {
        return {
            date: line.date,
            state: line.state,
            area: line.country + ' - ' + line.area
        }
    }).reverse()

    return new EntityInfo({
        id: id,
        states: states
    })
}

/*
 |--------------------------------------------------------------------------
 | Entity
 |--------------------------------------------------------------------------
 */
function EntityInfo(obj) {
    const {id, states} = obj

    this.id = id
    this.states = states

    this.trackerWebsite = URL + id
}

module.exports = tracker