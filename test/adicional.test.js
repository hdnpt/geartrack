const Promise = require("bluebird")
const tracker = require('../src/adicionalTracker')
require('./config') // global test config

const getInfo = Promise.promisify(tracker.getInfo)

test('extract info with success', () => {
    const id = '2016122222240929', code = 1750
    return getInfo(id, code).then(info => {
        expect(info.date_expedition).toBe('2016-12-24T00:00:00Z')
        expect(info.service_type).toBe('ENTREGA')
        expect(info.updated).toBe('2016-12-27T15:57:00Z')
        expect(info.status).toBe('DESCARTADO')
    })
});

test('id not found', () => {
    const id = '423423424', code = 1750
    return expect(getInfo(id, code)).rejects.toBeDefined()
});
