"use strict";

const correos = require('./correos')

const id = 'PQ4F6P0702441170181750Z'
const postalcode = 1750


correos.getInfo(id, postalcode, (err, correosInfo) => {
    console.log(correosInfo);
})
