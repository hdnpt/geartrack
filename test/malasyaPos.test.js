const Promise = require("bluebird")
const tracker = require('../src/malaysiaPosTracker')
require('./config') // global test config

const getInfo = Promise.promisify(tracker.getInfo)

test('extract info with success', () => {
    const id = 'RC104712375MY'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.states.length).toBeGreaterThanOrEqual(2)

        let firstState = info.states[info.states.length - 1]
        expect(firstState.date).toBe("2017-04-09T13:21:19+08:00")
        expect(firstState.area).toBe("In Transit")
        expect(firstState.state).toContain("Initial item information received")
    })
})

test('extract info with success 2', () => {
    const id = 'RC104828886MY'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.states.length).toBeGreaterThanOrEqual(3)
    })
})

test('id not found', () => {
    const id = 'AB'
    return expect(getInfo(id)).rejects.toBeDefined()
})
