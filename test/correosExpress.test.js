const Promise = require("bluebird")
const tracker = require('../src/correosTracker')
require('./config') // global test config

const getInfo = Promise.promisify(tracker.getInfo)

test('extract info with success', () => {
    const id = 'PQ4F6P0705905960188365S'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.destiny).toBe("PÊRA")
        expect(info.origin).toBe("ASPE")
        expect(info.deliveryDate).toBeUndefined()
        expect(info.states.length).toBeGreaterThanOrEqual(10)

        let firstState = info.states[info.states.length - 1]
        expect(firstState.date).toBe("2017-04-28T01:49:00+02:00")
        expect(firstState.area).toBe("CENTRAL")
        expect(firstState.state).toContain("INFORMADO.")
    })
});

test('extract info with success 2', () => {
    const id = 'PQ4F6P0707051350182440J'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.destiny).toBe("LEIRIA")
        expect(info.origin).toBe("MADRID")
        expect(info.states.length).toBeGreaterThanOrEqual(4)
    })
});

test('id not found', () => {
    const id = 'PQ4F6P070524894018175000000G'
    return expect(getInfo(id)).rejects.toBeDefined()
});
