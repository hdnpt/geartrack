"use strict";

/**
 * Extract postal code from an id
 * @param id
 * @returns {string}
 */
module.exports.getPostalCode = function (id) {
    let code = ""

    for(let i = id.length - 1, max = 0; i >= 0 && max < 4; i--) {
        let char = id.charAt(i)

        if (char >= '0' && char <= '9') {
            code = char + code
            max++
        }
    }

    return code
}