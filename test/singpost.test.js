const Promise = require("bluebird")
const tracker = require('../src/singpostTracker')
require('./config') // global test config

const getInfo = Promise.promisify(tracker.getInfo)

test('extract info with success', () => {
    const id = 'RF427233044SG'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.states.length).toBeGreaterThanOrEqual(7)

        let firstState = info.states[info.states.length - 1]
        expect(firstState.date).toBe("2016-11-26T00:00:00+08:00")
        expect(firstState.state).toContain("Received from Customer")
    })
})


test('id not found', () => {
    const id = '423423424'
    return expect(getInfo(id)).rejects.toBeDefined()
})
