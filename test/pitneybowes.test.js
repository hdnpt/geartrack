const Promise = require("bluebird")
const tracker = require('../src/pitneybowesTracker')
require('./config') // global test config

const getInfo = Promise.promisify(tracker.getInfo)

test('extract info with success', () => {
    const id = 'UPAAA000000218364455'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.destiny).toBe('PT - Seixal - Pinhal de Frades')
        expect(info.origin).toBe('GB - Hampshire - Portsmouth')
        expect(info.states.length).toBeGreaterThanOrEqual(3)

        let firstState = info.states[info.states.length - 1]
        expect(firstState.date).toBe("2017-04-05T08:42:26+00:00")
        expect(firstState.state).toContain("Tracking Details Uploaded")
    })
})

test('id not found', () => {
    const id = 'UPAAA000000'
    return expect(getInfo(id)).rejects.toBeDefined()
})
