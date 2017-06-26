"use strict";

/**
 * Get the Error message by Type
 *
 * @param type
 * @param error Error message
 * @returns {Error}
 */
const getErrorMessage = function(type, error = null, id = null) {
    type = type.toUpperCase()
    let errors = {
        'NO_DATA': 'No info for that id yet. Or maybe the data provided was wrong.',
        'BUSY': 'The server providing the info is busy right now. Try again.',
        'UNAVAILABLE': 'The server providing the info is unavailable right now. Try again later.',
        'EMPTY': 'The provider server was parsed correctly, but has no data to show. Try Again later.',
        'DOWN': 'The provider server is currently down. Try Again later.',
        'PARSER': 'Something went wrong when parsing the provider website.',
        'ACTION_REQUIRED': 'That tracker requires an aditional step in their website.'
    }

    let message = error != null ? error : errors[type]
    message = id != null ? message + ' ID:' + id : message
    return new Error(type + ' - ' + message)
}

module.exports.getError = getErrorMessage // old compatibility

module.exports.errorParser = function(id = null, error = null) {
    return getErrorMessage('PARSER', error, id)
}

module.exports.errorEmpty = function(id = null, error = null) {
    return getErrorMessage('EMPTY', error, id)
}

module.exports.errorNoData = function(id = null, error = null) {
    return getErrorMessage('NO_DATA', error, id)
}

module.exports.errorBusy = function(id = null, error = null) {
    return getErrorMessage('BUSY', error, id)
}

module.exports.errorUnavailable = function(id = null, error = null) {
    return getErrorMessage('UNAVAILABLE', error, id)
}

module.exports.errorDown = function(id = null, error = null) {
    return getErrorMessage('DOWN', error, id)
}

module.exports.errorActionRequired = function(id = null, error = null) {
    return getErrorMessage('ACTION_REQUIRED', error, id)
}


/**
 * Extract postal code from an id
 * @param id
 * @returns {string}
 */
module.exports.getPostalCode = function (id) {
    let code = ""

    for (let i = id.length - 1, max = 0; i >= 0 && max < 4; i--) {
        let char = id.charAt(i)

        if (char >= '0' && char <= '9') {
            code = char + code
            max++
        }
    }

    return code
}

/**
 * Parse values from table rows
 *
 * @param trs table rows to parse an array or an object returned by cheerio
 *            must an each(function(i, elem)) or forEach(function(elem))
 * @param fields object which keys are the name of the fields returned,
 *               value is an object with the field index and parser function(elem)
 * @param elemValidation function that should return true if tr is to process, true by default
 *
 * Example:
 *
 * const states = tableParser(trs, {
 *                  date: {
 *                      idx: 3,
 *                      mandatory: true
 *                   },
 *                }, e => true) // default is already true
 *
 * @returns [] Array of lines objects
 */
module.exports.tableParser = function (trs, fields, elemValidation = e => true) {
    let lines = []

    let _lineParser = (elem, fields) => {
        if (elemValidation(elem)) lines.push(lineParser(elem, fields))
    }

    if (trs.each) {
        trs.each((i, elem) => _lineParser(elem, fields))
    } else if (trs.forEach) {
        trs.forEach(elem => _lineParser(elem, fields))
    }

    return lines;
}

function lineParser(elem, fields) {
    if (elem.children !== undefined) {
        let line = {}
        let keys = Object.keys(fields)
        keys.forEach(function (key) {
            if (elem.children[fields[key].idx] || fields[key].mandatory) {
                if (fields[key].parser) {
                    line[key] = fields[key].parser(elem.children[fields[key].idx].children[0].data.trim())
                } else {
                    if(line[key] = elem.children[fields[key].idx].children.length > 0){
                        line[key] = elem.children[fields[key].idx].children[0].data.trim()
                    } else {
                        line[key] = "" // we dont have the field :/ is an empty tag
                    }
                }
            }
        })
        return line
    }
}

/**
 * Remove all Chinese chars from the string
 * @param str
 * @returns {XML|string}
 */
module.exports.removeChineseChars = function (str) {
    return str
            .replace(/\p{Han}+/, '')
            .replace(/[\u3400-\u9FBF]/g, '')
}