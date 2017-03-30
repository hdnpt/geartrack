'use strict';

const request = require('requestretry').defaults({ maxAttempts: 3, retryDelay: 1000 })
const sprintf = require('sprintf')
const moment = require('moment')

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
    obtainTexts(function(texts){
        request(URL.replace('{{id}}', id), function (error, response, body) {
            if (error) {
                console.log('error:', error)
                callback(error)
                return
            }
            if (response.statusCode != 200) {
                console.log('response.statusCode: ', response.statusCode)
                callback(new Error('statuscode: ' + response.statusCode))
                return
            }

            if (body.length == 0) {
                callback(new Error("No data or invalid data provided!"))
                return
            }

            const json = JSON.parse(body)

            let states = []

            json['item_events'].forEach(function (elem){
                states.push({
                    'date': moment(elem[0], "YYYY/MM/DD HH:mm:ss").format(),
                    'state': texts[parseInt(elem[1])]
                })
            })

            let entity = new DirectLinkInfo({
                'tracking_no': json['tracking_no'],
                'status': json['status'],
                'states': states
            })
            entity.retries = response.attempts
            callback(null, entity)
        })
    })
}

function obtainTexts(cb){
    request(textsURL, function (error, response, body) {
        if (error) {
            console.log('error:', error)
            return error
        }

        if (response.statusCode != 200) {
            console.log('response.statusCode: ', response.statusCode)
            return response.statusCode
        }

        let info = body.substring(body.indexOf('global_status_struct'), body.length-2)
        info = info.substring('global_status_struct'.length+3).replace(/\'/g, '"')
        cb(JSON.parse(info))
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