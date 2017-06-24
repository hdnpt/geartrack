const Promise = require("bluebird")
const tracker = require('../src/postNL')
require('./config') // global test config

const getInfo = Promise.promisify(tracker.getInfo)

test('extract info with success', () => {
    const id = 'RS804446736NL'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.states.length).toBeGreaterThanOrEqual(8)

        let firstState = info.states[info.states.length - 1]
        expect(firstState.date).toBe("2017-03-03T04:18:00+01:00")
        expect(firstState.state).toContain("The item is pre-advised")
    })
})

test('extract info with success too', () => {
    const id = 'RS882674034NL'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.states.length).toBeGreaterThanOrEqual(7)

        let firstState = info.states[info.states.length - 1]
        expect(firstState.date).toBe("2017-06-05T01:51:00+02:00")
        expect(firstState.state).toContain("The item is pre-advised")
    })
})

test('id not found', () => {
    const id = 'RE84521'
    return expect(getInfo(id)).rejects.toBeDefined()
})
