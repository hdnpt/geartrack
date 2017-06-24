const Promise = require("bluebird")
const tracker = require('../src/correosESTracker')
require('./config') // global test config

const getInfo = Promise.promisify(tracker.getInfo)

test('extract info with success', () => {
    const id = 'PQ4F6P0703673180181750T'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.states.length).toBeGreaterThanOrEqual(5)

        let firstState = info.states[info.states.length - 1]
        expect(firstState.date).toBe("2017-01-01T00:00:00+01:00")
        expect(firstState.state).toBe("Pre-registrado")
        expect(firstState.title).toBe("El remitente ha pre-registrado el envío en los sistemas de Correos.")
    })
});

test('id not found', () => {
    const id = '423423424'
    return expect(getInfo(id)).rejects.toBeDefined()
});
