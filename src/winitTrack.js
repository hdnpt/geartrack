'use strict';

const request = require('request')
const parser = require('cheerio')
const utils = require('./utils')
const moment = require('moment-timezone')
const zone = "Asia/Shanghai" // +1h

const URL = 'http://track.winit.com.cn/tracking/Index/result'
var j = request.jar();
var cookie = request.cookie('think_language=en-us');
j.setCookie(cookie, 'http://track.winit.com.cn');

const winit = {}

/**
 * Get winit track info
 * Scraps the winit track website
 * Async
 *
 * Design changes may break this code!!
 * @param id
 * @param callback(Error, CorreosInfo)
 */
winit.getInfo = function (id, callback) {
    request.get({
        url: URL,
        timeout: 30000,
        jar: j
    }, function (error, response, html) {
        if (error || response.statusCode != 200) {
            callback(utils.getError('DOWN'))
            return
        }

        let $ = parser.load(html)
        let hidden = $('input[name="__hash__"]');
        if (!hidden) {
            callback(utils.getError('PARSER'))
            return
        }

        obtainInfo(URL, id, hidden[0].attribs.value, callback)
    });
}

/**
 * Get info from correos page
 *
 * @param action
 * @param id
 * @param postalcode
 * @param cb
 */
function obtainInfo(action, id, hash, cb) {
    request.post({
        url: action,
        form: {
            trackingNo: id,
            trackingNoString: id,
            __hash__: hash
        },
        jar: j,
        timeout: 30000
    }, function (error, response, body) {
        if (error || response.statusCode != 200) {
            cb(utils.getError('DOWN'))
            return
        }

        let $ = parser.load(body);
        let trs = $('.center_table table tbody tr');
        // Not found
        if (trs.length < 2) {
            cb(utils.getError('NO_DATA'))
            return
        }

        let entity = null
        try {
            entity = createWinitEntity(
                trs[1].children[0].children[0].data,
                $('.center_table table tbody tr td a.poptips')[0].attribs['data-id'])
        } catch (error) {
            console.log(error);
            return cb(utils.getError('PARSER'))
        }

        cb(null, entity)
    })
}

/**
 * Create correos entity from html
 * @param html
 */
function createWinitEntity(id, html) {
    let $ = parser.load(html)

    let lines = $('ul li')

    let states = utils.tableParser(
        lines,
        {
            'date': {'idx': 2, 'mandatory': true, 'parser': elem => { return moment.tz( elem, 'YYYY-MM-DD HH:mm:ss', 'en', zone).format()}},
            'state': { 'idx': 3, 'mandatory': true },
            'area': { 'idx': 4, 'mandatory': true }
        },
        elem => true)

    return new WinitInfo({
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
function WinitInfo(obj) {
    this.id = obj.id
    this.state = obj.state
    this.states = obj.states
    this.trackerWebsite = URL
}

module.exports = winit