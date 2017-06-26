'use strict';

const request = require('requestretry')
const utils = require('./utils')
const moment = require('moment-timezone')
const zone = "GMT"

const URL_BASE = 'https://track24.net'
const URL_PATH = '/ajax/track24/ajax/tracking118.ajax.php'

const exportModule = {}

/**
 * Get Track24 tracker info
 * Async
 *
 * Design changes may break this code!!
 * @param id
 * @param callback(Error, Track24TrackerInfo)
 */
exportModule.getInfo = function (id, callback) {
    obtainInfo(URL_BASE + URL_PATH, id, callback)
}

exportModule.getInfoProxy = function (id, proxyUrl, callback) {
    obtainInfo(proxyUrl + URL_BASE, id, callback)
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
            lng: 'en',
            type: 'update'
        },
        timeout: 20000,
        maxAttempts: 2,
    }, function (error, response, body) {
        if (error || response.statusCode != 200) {
            cb(utils.getError('DOWN'))
            return
        }

        let data = null
        try {
            data = JSON.parse(body)
        } catch (error) {
            console.log(error);
            return cb(utils.getError('PARSER'))
        }

        if (data.status == undefined ||
            data.status != 'ok' ||
            (data.data.events.length == 1 &&
            data.data.events[0].operationAttributeTranslated == 'The track code is added to the database Track24.ru for automatic monitoring.')) {
            cb(utils.getError('NO_DATA'))
            return
        }

        data.gearTrackID = id

        let entity = null
        try {
            entity = createTrackerEntity(data)
        } catch (error) {
            console.log(id, error)
            return cb(utils.getError('PARSER'))
        }

        if (entity != null) cb(null, entity)
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
        }).filter(state => {
            if (state.state == 'The track code is added to the database Track24.ru for automatic monitoring.')
                return false
            return true
        }).sort((a, b) => {
            let dateA = moment(a.date),
                dateB = moment(b.date)

            if (dateA.isBefore(dateB))
                return 1

            return -1
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