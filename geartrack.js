"use strict"

const correos = require('./src/correosTracker')
const sky = require('./src/skyTracker')
const adicional = require('./src/adicionalTracker')
const util = require('./src/utils')

if (process.argv.length < 3) {

    console.log("Wrong arguments! You must provide the TrackingId, or multiple separated by , without spaces.")
    process.exit(1)
}

const trackingIds = process.argv[2]

trackingIds.split(',').forEach(track => {
    const trackID = track

    // async
    sky.getInfo(trackID, (err, skyInfo) => {
        if (err) {
            console.log(err.message)
            return
        }

        console.log("\n" + trackID)
        console.log("===== Sky 56")
        if (!skyInfo.isNL()) { // we only have messages for PQ... Correos line
            skyInfo.messages.forEach(m => console.log("\t" + m.date + " - " + m.message))
            console.log("")
        }
        skyInfo.status.forEach(s => console.log("\t" + s.date + " - " + s.status))
    })

    if (trackID.charAt(0) == 'P') { // We only want correos info for Spain express id's
        const postalcode = util.getPostalCode(trackID)

        //async
        correos.getInfo(trackID, postalcode, (err, correosInfo) => {
            if (err) return

            console.log("\n" + trackID)
            console.log("===== Correos Express")
            console.log("\tState: " + correosInfo.state)
            console.log("\tLast Update: " + correosInfo.lastUpdate)
            console.log("\tSender Name: " + correosInfo.sender.name)
            console.log("\tSender City: " + correosInfo.sender.city)
            console.log("\tReceiver Name: " + correosInfo.receiver.name)
            console.log("\tWeight: " + correosInfo.product.weight + "kg")
            console.log("\tParcels: " + correosInfo.product.parcels)

            console.log("")
            correosInfo.states.forEach(s => console.log("\t" + s.date + " - " + s.info + " " + s.department))

            adicional.getInfo(correosInfo.id, postalcode, (err, adicionalInfo) => {
                if (err) return

                console.log("\n" + trackID)
                console.log("===== Adicional PT")
                console.log("\tExpedition Date: " + adicionalInfo.date_expedition)
                console.log("\tState: " + adicionalInfo.status)
                console.log("\tSub State: " + adicionalInfo.sub_status)
                console.log("\tLast Updated: " + adicionalInfo.updated)
                console.log("\tDistributor: " + adicionalInfo.distributor)
                console.log("\tService Type: " + adicionalInfo.service_type)
                console.log("\tPhone: " + adicionalInfo.phone1)
                console.log("\tPhone2: " + adicionalInfo.phone2)
            })
        })
    }

})
