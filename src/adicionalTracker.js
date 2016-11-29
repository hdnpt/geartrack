'use strict';

const request = require('request')
const sprintf = require('sprintf')

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
    request(sprintf(URL, id, postcode), function (error, response, body) {
        if (error || response.statusCode != 200) {
            callback(error)
            return
        }

        const json = JSON.parse(body)

        // Not found
        if (json.length == 0) {
            callback(new Error("No data or invalid data provided!"))
            return
        }

       let entity = new AdicionalInfo(json[0])
        callback(null, entity)
    })
}

/*
 |--------------------------------------------------------------------------
 | Entity
 |--------------------------------------------------------------------------
 */
function AdicionalInfo(obj) {
    this.date_expedition = obj.DataExpedicao
    this.service_type = obj.desc_tipo_servico
    this.sub_status = obj.Desc_SubStatus
    this.updated = obj.data_status
    this.status = obj.Desc_Status
    this.name = obj.nome
    this.distributor = obj.Distribuidor
    this.phone1 = obj.Phone1
    this.phone2 = obj.Phone2
    this.notes = obj.Notes
}

module.exports = adicional