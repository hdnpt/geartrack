const Promise = require("bluebird")
const tracker = require('../src/track24')
require('./config') // global test config

const getInfo = Promise.promisify(tracker.getInfo)

if(!process.env.CI) { // this test fails in Travis CI
    test('extract info with success', () => {
        const id = 'BZ012761245CN'
        return getInfo(id).then(info => {
            expect(info.id).toBe(id)
            expect(info.destiny).toBe('Portugal')
            expect(info.origin).toBe('China')

            expect(info.states.length).toBeGreaterThanOrEqual(2)
        })
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

