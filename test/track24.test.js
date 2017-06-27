const Promise = require("bluebird")
const tracker = require('../src/track24')
require('./config') // global test config

const getInfo = Promise.promisify(tracker.getInfo)

if(!process.env.CI) { // this test fails in Travis CI
    test('extract info with success', async () => {
        const id = 'BZ012761245CN'

        try {
            const info = await getInfo(id)
            expect(info.id).toBe(id)
            expect(info.destiny).toBe('Portugal')
            expect(info.origin).toBe('China')

            expect(info.states.length).toBeGreaterThanOrEqual(2)
        } catch (e) {
            expect(e.message).toContain('DOWN') // only allow down exceptions
        }
    })
}

test('id not found', () => {
    const id = 'BZ01275CN'
    return expect(getInfo(id)).rejects.toBeDefined()
})

test('should remove the default state', () => {
    const id = 'BZ012761144CN'
    return expect(getInfo(id)).rejects.toBeDefined()
})

