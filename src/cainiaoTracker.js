'use strict';

const request = require('requestretry')
const parser = require('cheerio')
const Entities = require('html-entities').AllHtmlEntities
const entities = new Entities()
const utils = require('./utils')
const moment = require('moment-timezone')
const zone = "Asia/Kuala_Lumpur" // +8h

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
        timeout: 10000,
        maxAttempts: 2,
        retryDelay: 500,
        pool: false,
        agent: false,
        jar: true,
        json: true,
        gzip: true
    }, function (error, response, body) {
        if (error || response.statusCode != 200) {
            callback(utils.errorDown())
            return
        }

        let $ = parser.load(body)
        let val = JSON.parse(entities.decode($('#waybill_list_val_box').val()))

        // Not found
        if (val.data[0].errorCode == "ORDER_NOT_FOUND" || val.data[0].errorCode == "RESULT_EMPTY") {
            callback(utils.errorNoData())
            return
        }

        let entity = null
        try {
            entity = createCainiaoEntity(id, val)
            entity.retries = response.attempts
        } catch (error) {
            return callback(utils.errorParser(id, error.message))
        }

        callback(null, entity)
    })
}


/**
 * Create cainiao entity from html
 * @param id
 * @param json
 */
function createCainiaoEntity(id, json) {

    let section = json.data[0].section3 || json.data[0].section2;
    let msgs = section.detailList.map(m => {
        return {
            state: fixStateName(m.desc),
            date: moment.tz(m.time, "YYYY-MM-DD HH:mm:ss", zone).format()
        }
    })

    let destinyId = json.data[0].section2.mailNo || null

    return new CainiaoInfo(id, msgs, destinyId)
}

/*
 |--------------------------------------------------------------------------
 | Entity
 |--------------------------------------------------------------------------
 */
function CainiaoInfo(id, messages, destinyId) {
    this.id = id
    this.states = messages
    this.destinyId = destinyId
    this.trackerWebsite = URL + id
}

/*
 |--------------------------------------------------------------------------
 | Utils
 |--------------------------------------------------------------------------
 */
function fixStateName(state) {
    let res = state.replace('[-]', '')

    let matches = res.match(/\[(.*?)\]/);

    if (matches) {
        let submatch = matches[1]

        if (submatch.length > 10) // we dont want long country names, is ugly
            res = res.replace(/\s*\[.*?\]\s*/, '') // remove [all inside]
    }

    res = res.replace(']', "] ") // add space after ]
    res = res.replace('交接成功', 'Successful transfer')
    res = res.replace('上海市', 'Shanghai')
    res = res.replace('宁波市', 'Ningbo City')
    res = res.replace('电子信息已收到', 'Electronic information has been received')
    res = res.replace('[广州] 【广州互换局】已开拆', '[Guangzhou] In transit - Arrived at the waypoint')
    res = res.replace('[东莞] 【东莞市邮政局电商包裹局国际小包处理组】已封发(国内经转)', 
        '[Dongguan] In transit - Departed waypoint')

    return res
}

module.exports = cainiao
