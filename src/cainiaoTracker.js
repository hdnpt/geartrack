'use strict';

const request = require('requestretry')
const parser = require('cheerio')
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
const moment = require('moment')

const URL = 'https://global.cainiao.com/detail.htm?mailNoList='

const cainiao = {}

/**
 * Get cainiao info
 * Scraps the cainiao website
 * Async
 *
 * Design changes may break this code!!
 * @param id like RQ0623279MY
 * @param callback(Error, CainiaoInfo)
 */
cainiao.getInfo = function (id, callback) {
    request.get({
        url: URL + id,
        timeout: 30000,
        maxAttempts: 3,
        retryDelay: 500,
        pool: false,
        agent: false,
        jar: true,
        json: true,
        gzip: true
    }, function (error, response, body) {
        if (error || response.statusCode != 200) {
            callback(error)
            return
        }

        let $ = parser.load(body)
        let val =  JSON.parse(entities.decode( $('#waybill_list_val_box').val()))

        // Not found
        if (val.data[0].errorCode == "ORDER_NOT_FOUND" || val.data[0].errorCode == "RESULT_EMPTY") {
            callback(new Error("No data or invalid data provided!"))
            return
        }

        const entity = createCainiaoEntity(id, val)
        entity.retries = response.attempts
        callback(null, entity)
    })
}


/**
 * Create cainiao entity from html
 * @param id
 * @param json
 */
function createCainiaoEntity(id, json) {

    let msgs = json.data[0].section2.detailList.map(m => {
        return {
            status: m.desc,
            date: moment(m.time, "YYYY-MM-DD HH:mm:ss").format()
        }
    })

    return new CainiaoInfo(id, msgs)
}

/*
|--------------------------------------------------------------------------
| Entity
|--------------------------------------------------------------------------
*/
function CainiaoInfo(id, messages) {
    this.id = id
    this.messages = messages
}

/*
|--------------------------------------------------------------------------
| Utils
|--------------------------------------------------------------------------
*/

module.exports = cainiao