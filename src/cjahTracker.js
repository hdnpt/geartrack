'use strict';

const request = require('requestretry')
const parser = require('cheerio')
const utils = require('./utils')
const moment = require('moment-timezone')
const zone = "Asia/Shanghai"

const URL = 'http://pts.cjah.co/Home/OMTDetailStatus/{{id}}'

const cjah = {}

/**
 * Get Cjah info
 * Scraps the Cjah website
 * Async
 *
 * Design changes may break this code!!
 * @param id
 * @param cb(Error, CjahInfo)
 */
cjah.getInfo = function (id, cb) {
    request.get({
        url: URL.replace('{{id}}', id),
        timeout: 10000,
        maxAttempts: 2
    }, function (error, response, body) {
        if (error || response.statusCode != 200) {
            cb(utils.getError('DOWN'))
            return
        }

        createCjahEntity(id, body, cb)
    })
}


/**
 * Create cjah entity from html
 * @param id
 * @param html
 * @param cb
 */
function createCjahEntity(id, html, cb) {
    let entity = null
    try {
        let $ = parser.load(html)
        let trs = $('table tbody tr')

        // Not found
        if (!trs || trs.length === 0) {
            cb(utils.getError('NO_DATA'))
            return
        }

        let states = utils.tableParser(
        trs,
        {
            'id': { 'idx': 1, 'mandatory': true },
            'date': {'idx': 3, 'mandatory': true, 'parser': elem => { return moment.tz( elem, 'DD/MM/YYYY h:mm:ssa', 'en', zone).format()}},
            'state': { 'idx': 5, 'mandatory': true }
        },
        elem => true)

        entity = new CjahInfo({
            id: states[0].id,
            state: states[0].state,
            states: states
        })
    } catch (error) {
        console.log(id, error)
        return cb(utils.getError('PARSER'))
    }

    cb(null, entity)
}

/*
 |--------------------------------------------------------------------------
 | Entity
 |--------------------------------------------------------------------------
 */
function CjahInfo(obj) {
    this.id = obj.id
    this.state = obj.state
    this.states = obj.states
    this.trackerWebsite = URL.replace('{{id}}', obj.id)
}

module.exports = cjah