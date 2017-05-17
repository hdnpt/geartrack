'use strict';

const request = require('request')
const parser = require('cheerio')
const utils = require('./utils')
const moment = require('moment-timezone')
const zone = "Asia/Shanghai" // +1h

const URL = 'https://posta.hu/tracking'

var cookies = request.jar();

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
        jar: cookies // save cookies
    }, function (error, response, html) {
        if (error || response.statusCode != 200) {
            callback(utils.getError('DOWN'))
            return
        }

        let $ = parser.load(html)
        let form_action = $('form')[1].attribs['action'];
        let ice_view = $('input[name="ice.view"]')[0].attribs['value']
        let ice_window = $('input[name="ice.window"]')[0].attribs['value']
        let state = $('input[name="javax.faces.ViewState"]')[0].attribs['value']

        obtainInfo(form_action, id, ice_view, ice_window, state, callback)
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
function obtainInfo(action, id, ice_view, ice_window, state, cb) {
    request.post({
        url: "https://posta.hu/mpecom-sa-nyomkoveto-ui/nyomkoveto.jsf",
        form: {
            "ice.view": ice_view,
            "ice.window": ice_window,
            "javax.faces.ViewState": state,
            "nyomkoveto:documentnumber:input": id,
            "javax.faces.source": "nyomkoveto:pushBtnActionList",
            "javax.faces.partial.event": "click",
            "ice.event.type": "onclick",
            "ice.submit.type": "ice.s",
            "ice.submit.serialization": "form",
            "javax.faces.partial.ajax": "ajax",
            "nyomkoveto": "nyomkoveto"
        },
        jar: cookies,
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