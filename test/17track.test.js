const Promise = require("bluebird")
const tracker = require('../src/17track')
require('./config') // global test config

const getInfo = Promise.promisify(tracker.getInfo)


test('PostNL', () => {
    const id = 'RS875815831NL'
    return getInfo(id).then(info => {

        expect(info.id).toBe(id)
        expect(info.states.length).toBeGreaterThanOrEqual(3)

        let state = info.states[info.states.length -1]
        expect(state.area).toBeNull()
        expect(state.date).toBe('2017-06-19T07:59:00+01:00')
        expect(state.state).toBe("The item is pre-advised")
    })
})

test('dpd found', () => {
    const id = '15504411382518'
    return getInfo(id).then(info => {

        expect(info.id).toBe(id)
        expect(info.states.length).toBeGreaterThanOrEqual(8)

        let state = info.states[info.states.length -1]
        expect(state.area).toBe('Hub 3 - Bham')
        expect(state.date).toBe('2017-03-24T03:14:00Z')
        expect(state.state).toBe("We have your parcel and it's on its way to our depot")
    })
})


test('action required', async () => {
    const id = '4411311258'
    expect.hasAssertions()

    try {
        const info = await getInfo(id)
    } catch(e) {
      expect(e.message).toContain('ACTION_REQUIRED')
    }
})

test('id not found', async () => {
    const id = '423423424435N353'

    expect.hasAssertions()

    try {
        const info = await getInfo(id)
    } catch(e) {
        expect(e.message).toContain('NO_DATA')
    }
})
