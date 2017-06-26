const Promise = require("bluebird")
const tracker = require('../src/cainiaoTracker')
require('./config') // global test config

const getInfo = Promise.promisify(tracker.getInfo)

test('Yanwen LP with CTT ID', () => {
    const id = 'LP00068434402473'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.destinyId).toBe('RQ083716873MY')
        expect(info.states.length).toBeGreaterThanOrEqual(18)

        let firstState = info.states[info.states.length - 1]
        expect(firstState.date).toBe("2017-02-14T09:19:24+08:00")
        expect(firstState.state).toBe("Shipment confirmation")
    })
})

test('Yanwen LP', () => {
    const id = 'LP00071653567725'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.destinyId).toBeNull()
        expect(info.states.length).toBeGreaterThanOrEqual(7)

        let firstState = info.states[info.states.length - 1]
        expect(firstState.date).toBe("2017-03-30T13:34:52+08:00")
        expect(firstState.state).toBe("Shipment confirmation")
    })
})

if (!process.env.CI) { // this test fails in Travis CI
    test('Kuala Lumpur', () => {
        const id = 'RQ062471279MY'
        return getInfo(id).then(info => {
            expect(info.id).toBe(id)
            expect(info.states.length).toBeGreaterThanOrEqual(14)

            // cannot test the states, cainiao is providing some wrong states
        })
    })
}

test('China EMS ePacket', () => {
    const id = 'LX299455986CN'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.states.length).toBeGreaterThanOrEqual(17)
    })
})

test('S...', () => {
    const id = 'S000011731855'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.states.length).toBeGreaterThanOrEqual(10)
    })
})

test('id not found', () => {
    const id = '42e3423424'
    return expect(getInfo(id)).rejects.toBeDefined()
});