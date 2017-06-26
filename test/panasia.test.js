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


test('id not found', () => {
    const id = '423423424'
    return expect(getInfo(id)).rejects.toBeDefined()
})