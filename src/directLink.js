'use strict';

const request = require('requestretry').defaults({ maxAttempts: 3, retryDelay: 1000 })
const sprintf = require('sprintf')
const utils = require('./utils')
const moment = require('moment-timezone')
const zone = "Europe/Stockholm" // +2h

const textsURL = 'https://tracking.directlink.com/javascript/timeline_struct.js.php?lang=en'
const URL = 'https://tracking.directlink.com/responseStatus.php?json=1&site_cd=AC3&lang=en&postal_ref_no={{id}}'

const directLink = {}

/**
 * Get DirectLink info
 * Async
 *
 * @param id
 * @param callback(Error, DirectLinkInfo)
 */
directLink.getInfo = function (id, callback) {
    obtainTexts(function(err1, texts){
        if(err1)
            return callback(err1)

        request(URL.replace('{{id}}', id), function (error, response, body) {
            if (error) {
                console.log('error:', error)
                return callback(utils.getError('DOWN'))
            }
            if (response.statusCode != 200) {
                console.log('response.statusCode: ', response.statusCode)
                return callback(utils.getError('DOWN'))
            }

            if (body.length == 0) {
               return callback(utils.getError('NO_DATA'))
            }

            let entity = null
            try {
                const json = JSON.parse(body)

                let states = []

                json['item_events'].forEach(function (elem){
                    states.push({
                        'date': moment.tz(elem[0], "YYYY/MM/DD HH:mm:ss", zone).format(),
                        'state': texts[parseInt(elem[1])]
                    })
                })

                states = states.sort((a, b) => {
                    let dateA = moment(a.date).tz(zone),
                        dateB = moment(b.date).tz(zone)

                    return dateA < dateB
                })

                entity = new DirectLinkInfo({
                    'tracking_no': json['tracking_no'],
                    'status': json['status'],
                    'states': states
                })
                entity.retries = response.attempts
            } catch (error) {
                console.log(error);
                return callback(utils.getError('PARSER'))
            }

            callback(null, entity)
        })
    })
}

function obtainTexts(cb){
    request(textsURL, function (error, response, body) {
        if (error) {
            console.log('error:', error)
            return cb(utils.getError('DOWN'))
        }

        if (response.statusCode != 200) {
            console.log('response.statusCode: ', response.statusCode)
            return cb(utils.getError('DOWN'))
        }

        let info = body.substring(body.indexOf('global_status_struct'), body.length-2)
        info = info.substring('global_status_struct'.length+3).replace(/\'/g, '"')
        cb(null, JSON.parse(info))
    })
}

/*
 |--------------------------------------------------------------------------
 | Entity
 |--------------------------------------------------------------------------
 */
function DirectLinkInfo(obj) {
    this.id = obj.tracking_no
    this.state = obj.status
    this.states = obj.states.reverse()
}

module.exports = directLink