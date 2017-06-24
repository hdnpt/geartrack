const Promise = require("bluebird")
const tracker = require('../src/mrwTracker')
require('./config') // global test config

const getInfo = Promise.promisify(tracker.getInfo)

test('extract info with success', () => {
    const id = '028192765163'
    return getInfo(id).then(info => {

        expect(info.id).toBe(id)
        expect(info.states.length).toBeGreaterThanOrEqual(5)

        let state = info.states[info.states.length -1]
        expect(state.area).toBe('MURCIA')
        expect(state.date).toBe('2017-06-16T13:31:00+02:00')
        expect(state.state).toBe('Pendente de receber dados de entrega')
    })
});

test('id not found', () => {
    const id = '423423424'
    return expect(getInfo(id)).rejects.toBeDefined()
})
