"use strict";

/**
 * Get the Error message by Type
 *
 * @param type
 * @returns {Error}
 */
module.exports.getError = function (type) {
    type = type.toUpperCase()
    let errors = {
        'NO_DATA': 'No info for that id yet. Or maybe the data provided was wrong.',
        'BUSY': 'The server providing the info is busy right now. Try again.',
        'UNAVAILABLE': 'The server providing the info is unavailable right now. Try again later.',
        'EMPTY': 'The provider server was parsed correctly, but has no data to show. Try Again later.',
        'DOWN': 'The provider server is currently down. Try Again later.',
        'PARSER': 'Something went wrong when parsing the provider website.'
    }

    return new Error(type + ' - ' + errors[type])
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

function lineParser(elem, fields) {
    if (elem.children !== undefined) {
        let line = {}
        Object.keys(fields).forEach(function (key) {
            if (elem.children[fields[key].idx] || fields[key].mandatory) {
                if (fields[key].parser) {
                    line[key] = fields[key].parser(elem.children[fields[key].idx].children[0].data.trim())
                } else {
                    line[key] = elem.children[fields[key].idx].children[0].data.trim()
                }
            }
        })
        return line
    }
}

/**
 * Parse values from table rows
 *
 * @param trs table rows to parse an array or an object returned by cheerio
 *      must an each(function(i, elem)) or forEach(function(elem))
 * @param fields associative array, key are the name of the field returned, value is an object with the field index and parser function(elem)
 * @param trValidation function should return true if tr is to process
 * @returns {[]} of lines
 */
module.exports.tableParser = function (trs, fields, elemValidation) {
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