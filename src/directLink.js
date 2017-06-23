'use strict';

const request = require('requestretry').defaults({ maxAttempts: 3, retryDelay: 1000 })
const sprintf = require('sprintf')
const utils = require('./utils')
const moment = require('moment-timezone')
const zone = "Europe/Stockholm" // +2h

const textsURL = 'https://tracking.directlink.com/javascript/timeline_struct.js.php?lang=en'
const URL = 'https://tracking.directlink.com/responseStatus.php?json=1&site_cd=AC3&lang=en&postal_ref_no={{id}}'

const orderURL = 'https://tracking.directlink.com/multipletrack-client2.php?lang=en&postal_ref_mode=0&order_no={{order}}'

const directURL = 'https://tracking.directlink.com/multipletrack-client2.php?lang=en&postal_ref_mode=1&postal_ref_no='

const directLink = {}

/**
 * Get DirectLink info
 * Async
 *
 * @param id
 * @param callback(Error, DirectLinkInfo)
 */
directLink.getInfo = function (id, callback) {
    if (/Q.+XX$/.test(id)) { // order number Q24324234XX
        // get the item number from the order number

        this.getItemNumber(id, (err, item) => {
            if(err)
                return callback(err)

            getByItemNumber(item, callback)
        })
    } else {
        getByItemNumber(id, callback)
    }
}

directLink.getItemNumber = function(id, callback) {
    request(orderURL.replace('{{order}}', id), function (error, response, body) {
        if (error) {
            console.log('error:', error)
            return callback(utils.getError('DOWN'))
        }

        if (response.statusCode != 200) {
            console.log('response.statusCode: ', response.statusCode)
            return callback(utils.getError('DOWN'))
        }

        if(body.indexOf('Sorry order number') !== -1) {
            return callback(utils.getError('NO_DATA'))
        }

        try {
            let idx = body.indexOf('ordernum')
            let endIdx = body.indexOf('"', idx)

            if(idx == -1 || endIdx == -1) {
                console.log(id, error)
                return callback(utils.getError('PARSER'))
            }

            let idxStart = idx + 'ordernum'.length
            let item = body.substr(idxStart,  endIdx - idxStart)

            return callback(null, item)
        } catch (error) {
            console.log(id, error)
            return callback(utils.getError('PARSER'))
        }

    })
}

function getByItemNumber(id, callback) {
    obtainTexts(function(err1, texts) {
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
                    let dateA = moment(a.date),
                        dateB = moment(b.date)

                    return dateA > dateB
                })

                entity = new DirectLinkInfo({
                    'tracking_no': json['tracking_no'],
                    'status': json['status'],
                    'states': states
                })
                entity.retries = response.attempts
            } catch (error) {
                console.log(id, error)
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
    this.trackerWebsite = directURL + obj.tracking_no
}

module.exports = directLink