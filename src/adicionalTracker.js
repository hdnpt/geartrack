'use strict';

const request = require('requestretry').defaults({timeout: 10000, maxAttempts: 1, retryDelay: 500})
const sprintf = require('sprintf')
const utils = require('./utils')
const moment = require('moment-timezone')
const zone = "Europe/Lisbon"

const URL = 'http://www.adicional.pt/contact/tracking.php?reference=%s&cp=%s'

const adicional = {}

/**
 * Get Adicional info
 * Async
 *
 * @param id
 * @param postcode
 * @param callback(Error, AdicionalInfo)
 */
adicional.getInfo = function (id, postcode, callback) {
    request(sprintf(URL, id, postcode),
        function (error, response, body) {
            if (error || response.statusCode != 200) {
                callback(utils.errorDown())
                return
            }

            if(body.length == 0) {
                return callback(utils.errorNoData())
            }

            const json = JSON.parse(body)

            // Not found
            if (json.length == 0) {
                callback(utils.errorNoData())
                return
            }

            let entity = null
            try {
                entity = new AdicionalInfo(json[0])
                entity.retries = response.attempts

            } catch (error) {
                return callback(utils.errorParser(id, error.message))
            }

            callback(null, entity)
        })
}

/*
 |--------------------------------------------------------------------------
 | Entity
 |--------------------------------------------------------------------------
 */
function AdicionalInfo(obj) {
    this.date_expedition = moment.tz(obj.DataExpedicao, "YYYY-MM-DD", zone).format()
    this.service_type = obj.desc_tipo_servico
    this.sub_status = obj.Desc_SubStatus.trim()
    this.updated = moment.tz(obj.data_status, "YYYY-MM-DD HH:mm", zone).format()
    this.status = obj.Desc_Status
    this.name = obj.nome
    this.distributor = obj.Distribuidor
    this.phone1 = obj.Phone1
    this.phone2 = obj.Phone2.trim()
    this.notes = obj.Notes
    this.trackerWebsite = "http://www.adicional.pt"
}

module.exports = adicional