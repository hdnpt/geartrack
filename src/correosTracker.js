'use strict';

const request = require('requestretry')
const parser = require('cheerio')
const moment = require('moment')

const URL = 'https://www.correosexpress.com/web/correosexpress/home'

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
    request(URL, {timeout: 30000, maxAttempts: 3, retryDelay: 1000}, function (error, response, body) {
        if (error || response.statusCode != 200) {
            callback(error)
            return
        }

        let $ = parser.load(body)
        let action = $('#homeSearchForm').attr('action')

        obtainInfo(action, id, postalcode, callback)
    })
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
            shippingNumber: id,
            zipCode: postalcode
        },
        timeout: 30000
    }, function (error, response, body) {
        if (error || response.statusCode != 200) {
            cb(error)
            return
        }

        // Not found
        if (body.indexOf('portlet-msg-error') != -1) {
            cb(new Error("No data or invalid data provided!"))
            return
        }

        const entity = createCorreosEntity(body)
        entity.retries = response.attempts
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
    const fields = ['date', 'info', 'department']
    $('.results-row').each(function (i, elem) {
        if (i == 0) return

        let state = {}
        $(this).children().each(function (s, e) {
            let text = $(this).text().trim()

            if(s == 0)
                text = moment(text, "DD/MM/YY HH:mm").format()

            state[fields[s]] = text
        })

        states.push(state)
    })

    return new CorreosInfo({
        'nenvio': $('#nenvio').val(),
        'estado': $('#estado').val(),
        'fecha': $('#fecha').val(),
        'fechaEstado': $('#fechaEstado').val(),
        'sendername': $('#sendername').val(),
        'sendercity': $('#sendercity').val(),
        'senderaddress': $('#senderaddress').val(),
        'receivername': $('#receivername').val(),
        'receivercity': $('#receivercity').val(),
        'receiveraddress': $('#receiveraddress').val(),
        'weight': $('#weight').val(),
        'parcels': $('#parcels').val(),
        'ref': $('#reference').val(),
        'observations': $('#observations').val(),
        'states': states
    })
}

/*
 |--------------------------------------------------------------------------
 | Entity
 |--------------------------------------------------------------------------
 */
function CorreosInfo(obj) {
    // Sent details
    this.id = obj.nenvio
    this.state = obj.estado
    this.received = moment(obj.fecha, "DD/MM/YY").format()
    this.lastUpdate = moment(obj.fechaEstado, "DD/MM/YY HH:mm").format()

    // Sender Details
    this.sender = {
        name: obj.sendername.replace('¿', ''),
        city: obj.sendercity,
        address: obj.senderaddress
    }

    // Receiver Details
    this.receiver = {
        name: obj.receivername,
        city: obj.receivercity,
        address: obj.receiveraddress
    }

    // Product Details
    this.product = {
        weight: obj.weight,
        parcels: obj.parcels,
        ref: obj.ref,
        observations: obj.observations
    }

    //States
    this.states = obj.states.reverse()
}

module.exports = correos