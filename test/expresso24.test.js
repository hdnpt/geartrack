const Promise = require("bluebird")
const tracker = require('../src/expresso24Tracker')
require('./config') // global test config

const getInfo = Promise.promisify(tracker.getInfo)

test('extract info with success', () => {
    const id = 'ES14806990967805'
    return getInfo(id).then(info => {
        expect(info.ref).toBe(id)
        expect(info.guide).toBe("X6019011")
        expect(info.origin).toBe("GLOBALEGROW.COM")
        expect(info.receiver_name).toBe('CARLOS FLORENCIO')
        expect(info.date).toBe('2016-12-22T00:00:00Z')
    })
});

test('id not found', () => {
    const id = '423423424'
    return expect(getInfo(id)).rejects.toBeDefined()
});
