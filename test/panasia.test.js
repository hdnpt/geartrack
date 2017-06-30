const Promise = require("bluebird")
const tracker = require('../src/panasiaTracker')
require('./config') // global test config

const getInfo = Promise.promisify(tracker.getInfo)

test('extract info with success', () => {
    const id = 'PQ4F6P0705898310181998C'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.country).toBe('PORTUGAL')
        expect(info.product).toBe('CORREOS')
        expect(info.orderNumber).toBe('A00A076170420008254')
        expect(info.states.length).toBeGreaterThanOrEqual(6)

        let firstState = info.states[info.states.length - 1]
        expect(firstState.date).toBe("2017-04-17T00:00:00+08:00")
        expect(firstState.state).toContain("Pre-registrado")
    })
})

test('TH14982320496126 extract info with success', () => {
    const id = 'TH14982320496126'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.country).toBe('PORTUGAL')
        expect(info.product).toBe('EUTHXYH')
        expect(info.orderNumber).toBe('A00A076170627001013')
        expect(info.states.length).toBeGreaterThanOrEqual(1)

        let firstState = info.states[info.states.length - 1]
        expect(firstState.date).toBe("2017-06-26T19:21:50+08:00")
        expect(firstState.state).toBe("Parcel departure in Shenzhen Sorting Centre, next station is Chengdu,China")
    })
})


test('id not found', () => {
    const id = '423423424'
    return expect(getInfo(id)).rejects.toBeDefined()
})