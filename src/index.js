"use strict";

const correos = require('./correosTracker')
const sky = require('./skyTracker')

const id = 'PQ4F6P0702441170181750Z'
const postalcode = 1750

//
//correos.getInfo(id, postalcode, (err, correosInfo) => {
//    if(err) {
//        console.log(err.message);
//        return
//    }
//
//    console.log(correosInfo);
//})

sky.getInfo(id, (err, skyInfo) => {
    if (err) {
        console.log(err.message);
        return
    }

    console.log(skyInfo);
})