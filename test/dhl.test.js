const Promise = require("bluebird")
const tracker = require('../src/dhlTracker')
require('./config') // global test config

const getInfo = Promise.promisify(tracker.getInfo)

test('extract info with success', () => {
    const id = '9490966041'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.destiny).toBe("MAPUTO - MAPUTO - MOZAMBIQUE")
        expect(info.origin).toBe("LISBON - ODIVELAS - PORTUGAL")
        expect(info.states.length).toBeGreaterThanOrEqual(23)

        let firstState = info.states[info.states.length - 1]
        expect(firstState.date).toContain("2017-04-27")
        expect(firstState.area).toBe("LISBON - PORTUGAL")
        expect(firstState.state).toContain("Envio recolhido")
    })
});

test('id not found', () => {
    const id = '94909'
    return expect(getInfo(id)).rejects.toBeDefined()
});
