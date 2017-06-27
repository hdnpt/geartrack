'use strict';

const request = require('requestretry').defaults({timeout: 5000, maxAttempts: 2, retryDelay: 500})
const parser = require('cheerio')
const utils = require('./utils')
const sprintf = require('sprintf')
const moment = require('moment-timezone')
const zone = "Europe/Madrid" // +1h

const URL = 'http://www.mrw.pt/seguimiento_envios/MRW_historico_nacional.asp?enviament='

const tracker = {}

/**
 * Get MRW info
 *
 * @param id
 * @param cb(Error, EntityInfo)
 */
tracker.getInfo = function (id, cb) {
    request(URL + id, function (error, response, body) {
        if (error || response.statusCode > 200 && response.statusCode < 500) {
            return cb(utils.errorDown())
        }

        // Not found
        if (response.statusCode >= 500) { // ahah when the id is not valid they have an error
            return cb(utils.errorNoData())
        }

        let entity = null
        try {
            entity = createEntity(body, id)
            entity.retries = response.attempts
        } catch (error) {
            return cb(utils.errorParser(id, error.message))
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

    let table = $('tr.past')

    let states = utils.tableParser(table, {
        date: {
            idx: 3,
            mandatory: true
        },
        hours: {
            idx: 5,
            mandatory: true
        },
        state: {
            idx: 7,
            mandatory: true
        },
        area: {
            idx: 9,
            mandatory: false
        }
    }).map(line => {
        let d = line.date + ' ' + line.hours
        return {
            date: moment.tz(d, "DD/MM/YYYY HH:mm", zone).format(),
            state: line.state,
            area: line.area
        }
    })

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

    this.trackerWebsite = tracker.getLink(id)
}

tracker.getLink = function (id) {
    return URL + id
}

module.exports = tracker