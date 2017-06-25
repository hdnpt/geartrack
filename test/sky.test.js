const Promise = require("bluebird")
const tracker = require('../src/skyTracker')
require('./config') // global test config

const getInfo = Promise.promisify(tracker.getInfo)

test('Malasya Post', () => {
    const id = 'SYBPL01957855'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.status.length).toBeGreaterThanOrEqual(9)

        let firstState = info.status[info.status.length - 1]
        expect(firstState.area).toContain("Electronic information")
        expect(firstState.date).toBe("2016-12-23T05:47:00+08:00")
        expect(firstState.status).toBe("Receive")

        expect(info.messages).toBeNull()
    })
})

test('Netherlands Post', () => {
    const id = 'NL14812386123607'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.status.length).toBeGreaterThanOrEqual(9)

        let firstState = info.status[info.status.length - 2]
        expect(firstState.area).toContain("Small package Center")
        expect(firstState.date).toBe("2016-12-09T09:10:00+08:00")
        expect(firstState.status).toBe("Receive")

        expect(info.messages).toBeNull()
    })
})

describe('Priority Line', () => {
    test('should extract with success', () => {
        const id = 'PQ4F6P0702945760181750M'
        return getInfo(id).then(info => {
            expect(info.id).toBe(id)
            expect(info.status.length).toBeGreaterThanOrEqual(5)

            let firstState = info.status[info.status.length - 2]
            expect(firstState.area).toContain("")
            expect(firstState.date).toBe("2016-12-19T00:00:00+08:00")
            expect(firstState.status).toBe("Admitido")

            expect(info.messages.length).toBeGreaterThanOrEqual(6)
            let firstMessage = info.messages[info.messages.length - 2]
            expect(firstMessage.date).toBe("2016-12-04T19:12:00+08:00")
            expect(firstMessage.status).toBe("Parcel departure in Shenzhen Sorting Centre")

        })
    })

    test('should correct status en tra?nsito', () => {
        const id = 'PQ4F6P0703673180181750T'
        return getInfo(id).then(info => {
            expect(info.id).toBe(id)

            let firstState = info.status[info.status.length - 3]
            expect(firstState.status).toBe("En tránsito")

        })
    })

    test('should sort status by date', () => {
        const id = 'PQ4F6P0702945760181750M'
        return getInfo(id).then(info => {
            expect(info.id).toBe(id)

            expect(info.status[0].status).toBe("Entregado")
        })
    })
})

test('Bpost International', () => {
    const id = 'LVS1376360000761593'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.status.length).toBeGreaterThanOrEqual(7)

        let firstState = info.status[info.status.length - 2]
        expect(firstState.area).toContain("Small package Center")
        expect(firstState.date).toBe("2017-02-15T13:01:00+08:00")
        expect(firstState.status).toBe("Left")

        expect(info.messages.length).toBeGreaterThanOrEqual(6)
        let firstMessage = info.messages[info.messages.length - 2]
        expect(firstMessage.date).toBe("2017-02-17T09:41:28+08:00")
        expect(firstMessage.status).toBe("Item is ready for transport")

    })
})

describe('Switzerland Post Unregistered', () => {
    test('extract GEGMY00054570', () => {
        const id = 'GEGMY00054570'
        return getInfo(id).then(info => {
            expect(info.id).toBe(id)
            expect(info.status.length).toBeGreaterThanOrEqual(9)

            let firstState = info.status[info.status.length - 2]
            expect(firstState.area).toContain("Small package Center")
            expect(firstState.date).toBe("2017-03-09T22:54:00+08:00")
            expect(firstState.status).toBe("Receive")

            expect(info.messages).toBeNull()
        })
    })

    test('extract SB3000050456', () => {
        const id = 'SB3000050456'
        return getInfo(id).then(info => {
            expect(info.id).toBe(id)
            expect(info.status.length).toBeGreaterThanOrEqual(7)

            let firstState = info.status[info.status.length - 1]
            expect(firstState.area).toContain("Parcel centre")
            expect(firstState.date).toBe("2017-03-14T09:07:00+08:00")
            expect(firstState.status).toBe("Sealing")

            expect(info.messages.length).toBeGreaterThanOrEqual(6)
            let firstMessage = info.messages[info.messages.length - 2]
            expect(firstMessage.date).toBe("2017-03-18T12:01:15+08:00")
            expect(firstMessage.status).toBe("Posting over the counter")

        })
    })
})

test('Sweden Registered', () => {
    const id = 'Q1845621341XX'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.status.length).toBe(0)

        expect(info.messages.length).toBeGreaterThanOrEqual(7)
        let firstMessage = info.messages[info.messages.length - 2]
        expect(firstMessage.date).toBe("2017-04-05T11:48:00+08:00")
        expect(firstMessage.status).toBe("Item received for processing")

    })
})

test('Sweden Registered no data expected', () => {
    const id = 'Q1845779490XX'
    return expect(getInfo(id)).rejects.toBeDefined()
})



test('id not found', () => {
    const id = '423423424'
    return expect(getInfo(id)).rejects.toBeDefined()
})
