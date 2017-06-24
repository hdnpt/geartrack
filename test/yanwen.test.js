const Promise = require("bluebird")
const tracker = require('../src/yanwen')
require('./config') // global test config

const getInfo = Promise.promisify(tracker.getInfo)

test('extract info with success', () => {
    const id = '8001077530850'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.origin).toBe('China')
        expect(info.destiny).toBe('Portugal')
        expect(info.states.length).toBeGreaterThanOrEqual(8)

        let firstState = info.states[info.states.length - 1]
        expect(firstState.date).toBe("2017-03-11T02:04:00+08:00")
        expect(firstState.state).toContain("The item information was created by the seller.")
    })
})

test('extract info with success 2', () => {
    const id = 'UR848385766YP'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.origin).toBe('China')
        expect(info.destiny).toBe('Portugal')
        expect(info.states.length).toBeGreaterThanOrEqual(19)

        let firstState = info.states[info.states.length - 1]
        expect(firstState.date).toBe("2017-04-02T13:55:00+08:00")
        expect(firstState.state).toContain("Yanwen Acceptance.")
    })
})

test('extract info with success even the ones between countries', () => {
    const id = 'UA846098317YP'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.origin).toBe('China')
        expect(info.destiny).toBe('Portugal')
        expect(info.states.length).toBeGreaterThanOrEqual(10)

        let firstState = info.states[info.states.length - 1]
        expect(firstState.date).toBe("2017-03-14T09:14:00+08:00")
        expect(firstState.state).toContain("The item information was created by the seller.")
    })
})


test('id not found', () => {
    const id = 'RE84521'
    return expect(getInfo(id)).rejects.toBeDefined()
})
