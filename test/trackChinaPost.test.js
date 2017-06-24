const Promise = require("bluebird")
const tracker = require('../src/trackChinaPost')
require('./config') // global test config

const getInfo = Promise.promisify(tracker.getInfo)

test('extract info with success', async () => {
    const id = 'RF622875135CN'
    expect.hasAssertions()

    try {
        const info = await getInfo(id)
        expect(info.id).toBe(id)
        expect(info.states.length).toBeGreaterThanOrEqual(12)

        let firstState = info.states[info.states.length - 1]
        expect(firstState.date).toBe("2017-03-29T08:28:51+08:00")
        expect(firstState.state).toContain("Electronic Data Received")
    } catch (e) {
        expect(e.message).toContain('BUSY') // only allow busy exceptions
    }
})

test('extract info with success another id', async () => {
    const id = '04698596039'
    expect.hasAssertions()

    try {
        const info = await getInfo(id)
        expect(info.id).toBe(id)
        expect(info.states.length).toBeGreaterThanOrEqual(6)

        let firstState = info.states[info.states.length - 2]
        expect(firstState.date).toBe("2017-03-11T17:32:54+08:00")
        expect(firstState.state).toBe("Dongguan city Post Office eCommerce dept. international parcel process dept. received")
    } catch (e) {
        expect(e.message).toContain('BUSY') // only allow busy exceptions
    }
})

test('id not found', () => {
    const id = 'RE84521'
    return expect(getInfo(id)).rejects.toBeDefined()
})

test('should fail to extract - max 13 digits', () => {
    const id = '2017180588830171916924'
    return expect(getInfo(id)).rejects.toBeDefined()
})
