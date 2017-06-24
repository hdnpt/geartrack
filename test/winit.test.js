const Promise = require("bluebird")
const tracker = require('../src/winitTrack')
require('./config') // global test config

const getInfo = Promise.promisify(tracker.getInfo)

test('extract info with success', () => {
    const id = 'ID18050634174840CN'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.states.length).toBeGreaterThanOrEqual(6)

        let firstState = info.states[info.states.length - 1]
        expect(firstState.area).toBe("Yiwu")
        expect(firstState.date).toBe("2017-04-20T15:48:49+08:00")
        expect(firstState.state).toContain("Picked up Package from Origin")
    })
})

test('extract info with success another id', () => {
    const id = 'ID18130739928357CN'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.states.length).toBeGreaterThanOrEqual(7)

        let firstState = info.states[info.states.length - 2]
        expect(firstState.area).toBe("Foshan")
        expect(firstState.date).toBe("2017-05-17T20:32:42+08:00")
        expect(firstState.state).toContain("Processing shipment")
    })
})


test('id not found', () => {
    const id = 'safafsa'
    return expect(getInfo(id)).rejects.toBeDefined()
})
