const Promise = require("bluebird")
const tracker = require('../src/directLink')
require('./config') // global test config

const getInfo = Promise.promisify(tracker.getInfo)

test('OrderNumber Q..XX', done => {
    const id = 'Q1845621341XX'
    tracker.getItemNumber(id, (err, item) => {
        expect(err).toBeNull()
        expect(item).toBe('RE845621341SE')
        done()
    })
})

test('OrderNumber Q..XX not found', () => {
    const id = 'Q18456342341XX'
    return expect(getInfo(id)).rejects.toBeDefined()
})

test('extract info with success', () => {
    const id = 'RE845212395SE'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.states.length).toBeGreaterThanOrEqual(8)

        let firstState = info.states[info.states.length - 1]
        expect(firstState.date).toContain("2017-01-13T09:32:00+01:00")
        expect(firstState.state).toContain("Item pre-advice received")
    })
})

test('UF616427699SE extract info with success', () => {
    const id = 'UF616427699SE'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.states.length).toBeGreaterThanOrEqual(3)

        let firstState = info.states[info.states.length - 2]
        expect(firstState.date).toContain("2017-05-27T16:38:00+02:00")
        expect(firstState.state).toContain("Item received for processing")
    })
})

test('extract info with success Q.. ID', () => {
    const id = 'Q1845621341XX'
    return getInfo(id).then(info => {
        expect(info.id).toBe("RE845621341SE")
        expect(info.states.length).toBeGreaterThanOrEqual(7)

        let firstState = info.states[info.states.length - 1]
        expect(firstState.date).toContain("2017-04-05T10:05:00+02:00")
        expect(firstState.state).toContain("Item pre-advice received")
    })
})

test('OrderNumber RE.. not found', () => {
    const id = 'RE84521'
    return expect(getInfo(id)).rejects.toBeDefined()
})