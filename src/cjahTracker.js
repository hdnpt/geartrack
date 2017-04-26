'use strict';

const request = require('requestretry')
const parser = require('cheerio')
const utils = require('./utils')
const moment = require('moment-timezone')
const zone = "Asia/Shanghai"

const URL = 'http://pts.cjah.co/Home/OMTDetailStatus/{{id}}'

const cjah = {}

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
cjah.getInfo = function (id, postalcode, callback) {
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
    request.get({
        url: action.replace('{{id}}', id),
        timeout: 30000
    }, function (error, response, body) {
        if (error || response.statusCode != 200) {
            cb(utils.getError('DOWN'))
            return
        }

        let entity = null
        try {
            entity = createCjahEntity(body, cb)
        } catch (error) {
            console.log(error);
            return cb(utils.getError('PARSER'))
        }

        cb(null, entity)
    })
}

/**
 * Create malaysiaPos entity from html
 * @param html
 */
function createCjahEntity(html, cb) {

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

    return new CjahInfo({
        id: states[0].id,
        state: states[0].state,
        states: states
    })
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