const Promise = require("bluebird")
const tracker = require('../src/cjahTracker')
require('./config') // global test config

const getInfo = Promise.promisify(tracker.getInfo)

test('extract info with success', () => {
    const id = 'SB3000050456'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.states.length).toBeGreaterThanOrEqual(6)

        let firstState = info.states[info.states.length - 1]
        expect(firstState.date).toBe("2017-03-17T00:00:00+08:00")
        expect(firstState.state).toBe("Pre-Check to PORTUGAL")
    })
});

test('id not found', () => {
    const id = 'AB'
    return expect(getInfo(id)).rejects.toBeDefined()
});
