"use strict";

const correos = require('./src/correosTracker')
const sky = require('./src/skyTracker')
const adicional = require('./src/adicionalTracker')

const trackingIds = process.argv[2]

if (process.argv.length < 3) {
    console.log("Wrong arguments! Should be: TRACKINGID:POSTALCODE or multiple separated by , without spaces.");
    process.exit(1)
}

trackingIds.split(',').forEach(track => {
    let data = track.split(":")
    const trackID = data[0]
    const postalcode = data[1]

    // async
    sky.getInfo(trackID, (err, skyInfo) => {
        if (err) {
            console.log(err.message);
            return
        }

        console.log("\n" + trackID);
        console.log("===== Sky 56");
        skyInfo.messages.forEach(m => console.log("\t" + m.date + " - " + m.message))
        console.log("");
        skyInfo.status.forEach(s => console.log("\t" + s.date + " - " + s.status))
    })

    //async
    correos.getInfo(trackID, postalcode, (err, correosInfo) => {
        if (err) return

        console.log("\n" + trackID);
        console.log("===== Correos Express");
        console.log("\tState: " + correosInfo.state);
        console.log("\tLast Update: " + correosInfo.lastUpdate);
        console.log("\tSender Name: " + correosInfo.sender.name);
        console.log("\tSender City: " + correosInfo.sender.city);
        console.log("\tReceiver Name: " + correosInfo.receiver.name);
        console.log("\tWeight: " + correosInfo.product.weight + "kg");
        console.log("\tParcels: " + correosInfo.product.parcels);

        console.log("");
        correosInfo.states.forEach(s => console.log("\t" + s.date + " - " + s.info + " " + s.department))

        adicional.getInfo(correosInfo.id, postalcode, (err, adicionalInfo) => {
            if (err) return

            console.log("\n" + trackID);
            console.log("===== Adicional PT");
            console.log("\tExpedition Date: " + adicionalInfo.date_expedition);
            console.log("\tState: " + adicionalInfo.status);
            console.log("\tSub State: " + adicionalInfo.sub_status);
            console.log("\tLast Updated: " + adicionalInfo.updated);
            console.log("\tDistributor: " + adicionalInfo.distributor);
            console.log("\tService Type: " + adicionalInfo.service_type);
            console.log("\tPhone: " + adicionalInfo.phone1);
            console.log("\tPhone2: " + adicionalInfo.phone2);
        })
    })
})

