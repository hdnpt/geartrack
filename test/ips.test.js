const Promise = require("bluebird")
const tracker = require('../src/ipsTracker')
require('./config') // global test config

const getInfo = Promise.promisify(tracker.getInfo)

test('extract info with success', () => {
    const id = 'RR378711735IN'
    return getInfo(id).then(info => {

        expect(info.id).toBe(id)
        expect(info.states.length).toBeGreaterThanOrEqual(3)

        let state = info.states[info.states.length -1]
        expect(state.area).toBe('India - Jaipur City S.O')
        expect(state.date).toBe('2017-06-17T14:06:00+05:30')
        expect(state.state).toBe('Receive item from customer (Otb)')
    })
});

test('id not found', () => {
    const id = '423423424'
    return expect(getInfo(id)).rejects.toBeDefined()
})
