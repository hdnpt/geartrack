'use strict';

const request = require('requestretry')
const utils = require('./utils')
const moment = require('moment-timezone')
const zone = "GMT"

const URL = 'https://track24.net/ajax/tracking.ajax.php'

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
    obtainInfo(URL, id, callback)
}

/**
 * Get info from tracker request
 *
 * @param action
 * @param id
 * @param cb
 */
function obtainInfo(action, id, cb) {
    request.post({
        url: action,
        form: {
            code: id,
            lng: 'en'
        },
        timeout: 30000
    }, function (error, response, body) {
        if (error || response.statusCode != 200) {
            cb(utils.getError('DOWN'))
            return
        }

        const data = JSON.parse(body)
        if (data.status == undefined || data.status != 'ok' ) {
            cb(utils.getError('NO_DATA'))
            return
        }
        data.gearTrackID = id

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

    let result = data.data

    return new TrackerInfo({
        attempts: 1,
        id: data.gearTrackID,
        origin: result.fromCountry,
        destiny: result.destinationCountry,
        states: result.events.map((elem) => {
            return {
                state: elem.operationAttributeTranslated,
                date: moment.tz(elem.operationDateTime, "DD.MM.YYYY HH:mm:ss", zone),
                area: elem.operationPlaceNameTranslated,
                service: elem.serviceName
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
    this.states = obj.states
    this.origin = obj.origin,
    this.destiny = obj.destiny
    this.trackerWebsite = "https://track24.net/?code=" + this.id
}

module.exports = exportModule