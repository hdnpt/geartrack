'use strict';

const request = require('requestretry').defaults({timeout: 10000, maxAttempts: 2, retryDelay: 500})
const parser = require('cheerio')
const utils = require('./utils')
const sprintf = require('sprintf')
const moment = require('moment-timezone')
const zone = "Asia/Hong_Kong" // +8h

const URL = 'http://www.faryaa.com/user/index/package-refer/type/track?order_number={{id}}&button_search=Track'

const panasia = {}

/**
 * Get panasia info
 * Scraps the Panasia website
 * Async
 *
 * Design changes may break this code!!
 * @param id
 * @param cb(Error, PanasiaInfo)
 */
panasia.getInfo = function (id, cb) {
    request(URL.replace('{{id}}', id), function (error, response, body) {
        if (error || response.statusCode != 200) {
            cb(utils.errorDown())
            return
        }

        // Not found
        if (body.indexOf('Order does not exist') != -1 || body.indexOf('one-parcel') == -1) {
            cb(utils.errorNoData())
            return
        }

        let entity = null
        try {
            entity = createPanasiaEntity(body, id)
            entity.retries = response.attempts
        } catch (error) {
            return cb(utils.errorParser(id, error.message))
        }

        cb(null, entity)
    })
}

/**
 * Create panasia entity from html
 * @param html
 * @param id
 */
function createPanasiaEntity(html, id) {
    let $ = parser.load(html)

    let td11 = $('.one-parcel .td11').contents()
    let orderNumber = td11[1].data
    let product = td11[3].data

    let td22 = $('.one-parcel .td22').contents()
    let trackingNumber = td22[1].data
    let country = utils.removeChineseChars(td22[3].data).trim()

    let td33 = $('.one-parcel .td33').contents()
    let dates = []

    for(let i = 1; i < td33.length; ++i) {
        let date = td33[i].children[1].data
        dates.push(moment.tz(date, "YYYY-MM-DD HH:mm:ss", zone).format())
    }

    let td44 = $('.one-parcel .td44').contents()
    let states = []

    for(let i = 0; i < td44.length; ++i) {
        let s = td44[i].children[0].data
        states.push(s.replace('，', ', ').replace('En tr?nsito', 'En transito'))
    }

    let finalStates = []

    for(let i = 0; i < dates.length; ++i) {
        finalStates.push({
            state: states[i],
            date: dates[i]
        })
    }

    return new PanasiaInfo({
        orderNumber: orderNumber,
        product: product,
        id: id,
        country: country,
        states: finalStates.sort((a, b) => {
            let dateA = moment(a.date),
                dateB = moment(b.date)

            return dateA < dateB
        })
    })
}

/*
 |--------------------------------------------------------------------------
 | Entity
 |--------------------------------------------------------------------------
 */
function PanasiaInfo(obj) {
    this.id = obj.id
    this.states = obj.states
    this.orderNumber = obj.orderNumber
    this.product = obj.product
    this.country = obj.country
    this.trackerWebsite = URL.replace('{{id}}', obj.id)
}
module.exports = panasia