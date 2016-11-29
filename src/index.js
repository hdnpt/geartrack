"use strict";

const correos = require('./correosTracker')
const sky = require('./skyTracker')
const adicional = require('./adicionalTracker')

const trackID = process.argv[2]
const postalcode = process.argv[3]

if (process.argv.length < 4) {
    console.log("Wrong arguments! Should be: id postalcode");
    process.exit(1)
}

// async
sky.getInfo(trackID, (err, skyInfo) => {
    if (err) {
        console.log(err.message);
        return
    }

    console.log("\n===== Sky 56");
    skyInfo.messages.forEach(m => console.log(m.date + " - " + m.message))
    console.log("");
    skyInfo.status.forEach(s => console.log(s.date + " - " + s.status))
})

//async
correos.getInfo(trackID, postalcode, (err, correosInfo) => {
    if (err) return

    console.log("\n===== Correos Express");
    console.log("Estado: " + correosInfo.state);
    console.log("Ultima Atualizacao: " + correosInfo.lastUpdate);

    console.log("");
    correosInfo.states.forEach(s => console.log(s.date + " - " + s.info + " " + s.department))

    adicional.getInfo(correosInfo.id, postalcode, (err, adicionalInfo) => {
        if (err) return

        console.log("\n===== Adicional PT");
        console.log("Estado: " + adicionalInfo.status);
        console.log("Sub Estado: " + adicionalInfo.sub_status);
        console.log("Distribuidor: " + adicionalInfo.name);
    })
})


