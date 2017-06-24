const Promise = require("bluebird")
const tracker = require('../src/correosOldTracker')
require('./config') // global test config

const getInfo = Promise.promisify(tracker.getInfo)

test('extract info with success', () => {
    const id = 'PQ4F6P0705159770184410W'
    return getInfo(id).then(info => {
        expect(info.id).toBe("2117032823503256")
        expect(info.sender.name).toBe("ZAMBITIOUS SL")
        expect(info.sender.city).toBe("ASPE")
        expect(info.states.length).toBeGreaterThanOrEqual(8)

        expect(info.receiver.name).toBe("RICARDO TAVARES (ARMAZÉM RÁDIO POPU")
        expect(info.receiver.city).toBe("ARCOZELO - V.N. GAIA")

        let firstState = info.states[info.states.length - 1]
        expect(firstState.date).toBe("2017-03-28T23:50:00+02:00")
        expect(firstState.department).toBe("CENTRAL")
        expect(firstState.info).toBe("SIN RECEPCION: ENVIO GRABADO")
    })
});

test('id not found', () => {
    const id = '423423424'
    return expect(getInfo(id)).rejects.toBeDefined()
});
