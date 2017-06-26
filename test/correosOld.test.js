const Promise = require("bluebird")
const tracker = require('../src/correosOldTracker')
require('./config') // global test config

const getInfo = Promise.promisify(tracker.getInfo)

test('extract info with success', () => {
    const id = 'PQ4F6P0707342430183450V'
    return getInfo(id).then(info => {
        expect(info.id).toBe("2117062302552956")
        expect(info.sender.name).toBe("ZAMBITIOUS SL")
        expect(info.sender.city).toBe("ASPE")
        expect(info.states.length).toBeGreaterThanOrEqual(5)

        expect(info.receiver.name).toBe("BRAULIO AFONSO")
        expect(info.receiver.city).toBe("MORTAGUA")

        let firstState = info.states[info.states.length - 1]
        expect(firstState.date).toBe("2017-06-23T02:55:00+02:00")
        expect(firstState.department).toBe("CENTRAL")
        expect(firstState.info).toBe("SIN RECEPCION: ENVIO GRABADO")
    })
});

test('id not found', () => {
    const id = '423423424'
    return expect(getInfo(id)).rejects.toBeDefined()
});
