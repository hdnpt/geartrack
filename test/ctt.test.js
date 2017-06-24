const Promise = require("bluebird")
const tracker = require('../src/cttTracker')
require('./config') // global test config

const getInfo = Promise.promisify(tracker.getInfo)

test('Singapura', () => {
    const id = 'RF427233044SG'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.messages.length).toBeGreaterThanOrEqual(7)

        let firstState = info.messages[info.messages.length - 1]
        expect(firstState.status[0].local).toBe("SINGAPORE SAL")
        expect(firstState.status[0].time).toContain("2016-11-28")
        expect(firstState.status[0].status).toContain("Expedição internacional")
    })
})

test('Malasya Kuala Lumpur', () => {
    const id = 'RQ062471279MY'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.messages.length).toBeGreaterThanOrEqual(4)

        let firstState = info.messages[info.messages.length - 1]
        expect(firstState.status[0].local).toBe("KUALA LUMP B")
        expect(firstState.status[0].time).toContain("2016-12-27")
        expect(firstState.status[0].status).toContain("Aceitação")
    })
})


test('China Post', () => {
    const id = 'RI937765505CN'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.messages.length).toBeGreaterThanOrEqual(4)

        let firstState = info.messages[info.messages.length - 1]
        expect(firstState.status[0].local).toBe("Local não definido")
        expect(firstState.status[0].time).toContain("2016-07-25")
        expect(firstState.status[0].status).toContain("Aceitação")
    })
})

test('Sweden', () => {
    const id = 'RE845212395SE'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.messages.length).toBeGreaterThanOrEqual(5)

        let firstState = info.messages[info.messages.length - 1]
        expect(firstState.status[0].local).toBe("Local não definido")
        expect(firstState.status[0].time).toContain("2017-01-19")
        expect(firstState.status[0].status).toContain("Expedição internacional")
    })
})

test('EA358948794PT', () => {
    const id = 'EA358948794PT'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.messages.length).toBeGreaterThanOrEqual(2)

        let firstState = info.messages[info.messages.length - 1]
        expect(firstState.status[0].local).toBe("C.O. LOURES-MARL (OLX)")
        expect(firstState.status[0].time).toContain("2017-04-21")
        expect(firstState.status[0].status).toContain("Expedição")
    })
})

test('RE845621341SE', () => {
    const id = 'RE845621341SE'
    return getInfo(id).then(info => {
        expect(info.id).toBe(id)
        expect(info.messages.length).toBeGreaterThanOrEqual(4)

        let firstState = info.messages[info.messages.length - 1]
        expect(firstState.status[0].local).toBe("Local não definido")
        expect(firstState.status[0].time).toContain("2017-04-12")
        expect(firstState.status[0].status).toContain("Expedição internacional")
    })
})


test('id not found', () => {
    const id = '423423424'
    return expect(getInfo(id)).rejects.toBeDefined()
});
