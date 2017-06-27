'use strict';

const rp = require('request-promise')
const utils = require('./utils')
const sprintf = require('sprintf')
const moment = require('moment-timezone')
const zone = "Europe/Lisbon"

const URL = 'http://www.17track.net/en/track?nums='

const URL_BASE = 'http://www.17track.net'
const URL_PATH = '/restapi/handlertrack.ashx'

const tracker = {}

/**
 * Get 17track  info
 *
 * @param id
 * @param cb(Error, EntityInfo)
 */
tracker.getInfo = function (id, cb) {
    fetchInfo(id, URL_BASE + URL_PATH)
        .then(info => cb(null, info))
        .catch(cb)
}

tracker.getInfoProxy = function (id, proxyUrl, cb) {
    fetchInfo(id, proxyUrl + URL_PATH)
        .then(info => cb(null, info))
        .catch(cb)
}

async function fetchInfo(id, trackerUrl) {
    const options = {
        method: 'POST',
        uri: trackerUrl,
        body: '{"guid":"","data":[{"num":"' + id + '"}]}',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    const maxTries = 10
    let tries = maxTries // sometimes the website returns an error (seems random :/)
    while (tries > 0) {
        --tries

        let info = null
        try {
            info = await rp(options).then(body => JSON.parse(body))
        } catch (e) {
            await utils.sleep(2000)
            continue
        }

        if(info.ret == -8 && info.msg == 'abN')
            throw utils.errorUnavailable() // we are blocked?

        if (info.msg != "Ok" || info.dat[0].delay == -1) {
            await utils.sleep(3000)
            continue
        }

        if (info.dat[0].yt != null) {
            throw utils.errorActionRequired()
        }

        if (info.dat[0].track == null) {
            throw utils.errorNoData()
        }

        try {
            let entity = createEntity(id, info)
            entity.retries = maxTries - tries
            return entity
        } catch (error) {
            console.log(id, error)
            throw utils.errorParser(id, error.message)
        }
    }

    throw utils.errorBusy()
}


/**
 * Create tracker entity from html
 * @param html
 */
function createEntity(id, json) {

    const originStates = json.dat[0].track.z1.map(mapRow)
    const destinStates = json.dat[0].track.z2 ? json.dat[0].track.z1.map(mapRow) : null

    return new EntityInfo({
        id: id,
        states: originStates,
        destinStates: destinStates
    })
}

function mapRow(row) {
    return {
        date: moment.tz(row.a, "YYYY-MM-DD HH:mm", zone).format(),
        area: row.c.length == 0 ? null : row.c,
        state: row.z
    }
}

/*
 |--------------------------------------------------------------------------
 | Entity
 |--------------------------------------------------------------------------
 */
function EntityInfo(obj) {
    const {id, states, destinStates} = obj

    this.id = id
    this.states = states
    this.destinStates = destinStates

    this.trackerWebsite = tracker.getLink(id)
}

tracker.getLink = function (id) {
    return URL + id
}

module.exports = tracker