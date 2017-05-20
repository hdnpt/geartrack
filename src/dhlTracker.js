'use strict';

const request = require('requestretry')
const utils = require('./utils')
const moment = require('moment-timezone')
const zone = "Europe/Berlin"

const URL = 'http://www.dhl.com/shipmentTracking?AWB={{id}}&languageCode=pt'

const exportModule = {}

/**
 * Get DHL tracker info
 * Async
 *
 * Design changes may break this code!!
 * @param id
 * @param callback(Error, DHLTrackerInfo)
 */
exportModule.getInfo = function (id, callback) {
    obtainInfo(URL.replace("{{id}}", id), callback)
}

/**
 * Get info from tracker request
 *
 * @param action
 * @param id
 * @param cb
 */
function obtainInfo(action, cb) {
    request.get({
        url: action,
        timeout: 20000
    }, function (error, response, body) {
        if (error || response.statusCode != 200) {
            cb(utils.getError('DOWN'))
            return
        }

        const data = JSON.parse(body)
        if (data.errors != undefined) {
            cb(utils.getError('NO_DATA'))
            return
        }

        let entity = null
        try {
            entity = createTrackerEntity(data)
        } catch (error) {
            console.log(error);
            return cb(utils.getError('PARSER'))
        }

        if(entity != null) cb(null, entity)
    })
}

/**
 * Create tracker entity from object
 * @param html
 */
function createTrackerEntity(data) {

    let result = data.results[0]

    return new TrackerInfo({
        attempts: 1,
        id: result.id,
        transportType: result.type,
        origin: result.origin.value,
        destiny: result.destination.value,
        states: result.checkpoints.map((elem) => {
            let date = elem.date.trim() + " " + elem.time.trim()
            return {
                state: elem.description.trim(),
                date: moment.tz(date, "dddd, MMMM DD, YYYY HH:mm", 'pt', zone),
                area: elem.location.trim()
            }
        })
    })
}

/*
 |--------------------------------------------------------------------------
 | Entity
 |--------------------------------------------------------------------------
 */
function TrackerInfo(obj) {
    this.attempts = obj.attempts
    this.id = obj.id
    this.deliveryDate = obj.deliveryDate
    this.states = obj.states
    this.origin = obj.origin,
    this.destiny = obj.destiny
    this.trackerWebsite = "http://www.dhl.com/en/express/tracking.html?AWB=" + this.id
}

module.exports = exportModule