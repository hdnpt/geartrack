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
        'EMPTY': 'The provider server was parsed correctly, but has no data to show. Try Again later.',
        'DOWN': 'The provider server is currently down. Try Again later.',
        'PARSER': 'The provider website was changed his design. This api should be updated.'
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