'use strict';

const request = require('requestretry')
const parser = require('cheerio')
const utils = require('./utils')
const moment = require('moment-timezone')
const zone = "Europe/Madrid" // +1h

const correos = {}

//const URL = 'https://aplicacionesweb.correos.es/localizadorenvios/track.asp?numero={{id}}&idiomaCorreos=es_ES'
//https is giving some kind of error
const URL = 'http://aplicacionesweb.correos.es/localizadorenvios/track.asp?numero={{id}}&idiomaCorreos=es_ES'

/**
 * Get correos.es info
 * Scraps the Correos.es website
 * Async
 *
 * Design changes may break this code!!
 * @param id
 * @param callback(Error, CorreosInfo)
 */
correos.getInfo = function (id, callback) {
    let _URL = URL.replace('{{id}}', id)

    request(_URL, {timeout: 10000, maxAttempts: 2, retryDelay: 1000, encoding: 'latin1'},
        function (error, response, body) {
            if (error) {
                console.log('error:', error)
                return callback(utils.getError('DOWN'))
            }
            if (response.statusCode != 200) {
                console.log('response.statusCode: ', response.statusCode)
                return callback(utils.getError('DOWN'))
            }

            let entity = null

            try {
                entity = createCorreosEsEntity(id, body)
                if (!entity) {
                    return callback(utils.getError('NO_DATA'))
                }
                entity.retries = response.attempts

            } catch (error) {
                console.log(id, error)
                return callback(utils.getError('PARSER'))
            }

            callback(null, entity)
        })
}

/**
 * Create correos.es entity from html
 * @param html
 */
function createCorreosEsEntity(id, html) {

    let $ = parser.load(html)

    let table2 = $('#Table2').get(0);

    let states = []
    const fields = ['date', 'info']
    if (table2.children.length === 0 ||
        (table2.children[1] !== undefined
        && table2.children[1].data !== undefined
        && table2.children[1].data.trim() === 'fin tabla descripciones'))
        return null;

    table2.children.forEach(function (elem) {

        if (elem.attribs !== undefined && elem.attribs.class.trim() === 'txtCabeceraTabla') {
            let state = {}
            elem.children.forEach(function (_child) {
                if (_child.attribs !== undefined && _child.attribs.class !== undefined) {
                    let _class = _child.attribs.class.trim()
                    if (_class === 'txtDescripcionTabla') {
                        state['date'] = moment.tz(_child.children[0].data.trim(), "DD/MM/YYYY", zone).format()
                    } else if (_class === 'txtContenidoTabla' || _class === 'txtContenidoTablaOff') {
                        state['state'] = _child.children[1].children[0].data.trim()
                        if (_child.children[1].attribs !== undefined && _child.children[1].attribs !== undefined
                            && _child.children[1].attribs.title) {
                            state['title'] = _child.children[1].attribs.title.trim()
                        }
                    }
                }
            })
            if (Object.keys(state).length > 0) {
                states.push(state)
            }
        }

    })

    return new CorreosESInfo({
        'id': id,
        'state': states[states.length - 1].state,
        'states': states.reverse()
    })
}

/*
 |--------------------------------------------------------------------------
 | Entity
 |--------------------------------------------------------------------------
 */
function CorreosESInfo(obj) {
    this.id = obj.id
    this.state = obj.state
    this.states = obj.states
    this.trackerWebsite = URL.replace('{{id}}', obj.id)
}

module.exports = correos