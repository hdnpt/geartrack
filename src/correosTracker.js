'use strict';

const request = require('requestretry')
const parser = require('cheerio')
const utils = require('./utils')
const moment = require('moment-timezone')
const zone = "Europe/Madrid" // +1h

const URL = 'https://s.correosexpress.com/search'

const correos = {}

/**
 * Get correos info
 * Scraps the Correos Express website
 * Async
 *
 * Design changes may break this code!!
 * @param id
 * @param postalcode
 * @param callback(Error, CorreosInfo)
 */
correos.getInfo = function (id, postalcode, callback) {
    obtainInfo(URL, id, postalcode, callback)
}

/**
 * Get info from correos page
 *
 * @param action
 * @param id
 * @param postalcode
 * @param cb
 */
function obtainInfo(action, id, postalcode, cb) {
    request.post({
        url: action,
        form: {
            shippingNumber: id
        },
        timeout: 30000
    }, function (error, response, body) {
        if (error || response.statusCode != 200) {
            cb(utils.getError('DOWN'))
            return
        }

        // Not found
        if (body.indexOf('errorMessage') != -1) {
            cb(utils.getError('NO_DATA'))
            return
        }

        let entity = null
        try {
            entity = createCorreosEntity(body)
            entity.retries = response.attempts
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
function createCorreosEntity(html) {
    let $ = parser.load(html)

    let states = []

    var id = $('.shipping span').get(0).children[0].data.trim()
    var state = $('.status').get(0).children[2].data.trim()
    var state2 = $('.status-desc .status-message').get(0).children[0].data.trim()
    var deliveryDate = $('.status').get(0).children[4]
    if(deliveryDate !== undefined){
        deliveryDate = deliveryDate.data.trim()
        deliveryDate = deliveryDate.substring(deliveryDate.indexOf(':') + 1)
        deliveryDate = moment.tz(deliveryDate, 'DD MMM YYYY', 'es', zone).format()
    }
    var trs = $('table tbody tr')
    trs.each(function (i, elem) {

        if(elem.children !== undefined){
            let state = {
                'date': moment.tz(elem.children[1].children[0].data.trim(), ", DD/MM/YYYY HH:mm", 'es', zone).format(),
                'state': elem.children[5].children[0].data.trim(),
                'area': elem.children[3].children[0].data.trim()
            }
            states.push(state)
        }

    })

    return new CorreosInfo({
        id: id,
        state: state,
        state2: state2,
        deliveryDate: deliveryDate,
        states: states
    })
}

/*
 |--------------------------------------------------------------------------
 | Entity
 |--------------------------------------------------------------------------
 */
function CorreosInfo(obj) {
    this.id = obj.id
    this.state = obj.state
    this.state2 = obj.state2
    this.deliveryDate = obj.deliveryDate
    this.states = obj.states.reverse()
}

module.exports = correos