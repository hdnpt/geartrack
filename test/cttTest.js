const assert = require('chai').assert

const ctt = require('../src/cttTracker')

describe('CTT', function () {
    this.timeout(0)

    describe('#CTT', function () {
        it('Singapura - must pass', function (done) {
            const id = 'RF427233044SG'
            ctt.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.isAtLeast(info.messages.length, 7) // number of states at this time

                // assert the first state
                let states = info.messages.reverse() // order from the oldest state to the newest
                assert.equal(states[0].status[0].local, "SINGAPORE SAL")
                assert.include(states[0].status[0].time, "2016-11-28") // only date because timezone
                assert.equal(states[0].status[0].status, "Expedição internacional")

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('Malasya Kuala Lumpur - must pass', function (done) {
            const id = 'RQ062471279MY'
            ctt.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.isAtLeast(info.messages.length, 4) // number of states at this time

                // assert the first state
                let states = info.messages.reverse() // order from the oldest state to the newest
                assert.equal(states[0].status[0].local, "KUALA LUMP B")
                assert.include(states[0].status[0].time, "2016-12-27") // only date because timezone
                assert.equal(states[0].status[0].status, "Aceitação")

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('China Post - must pass', function (done) {
            const id = 'RI937765505CN'
            ctt.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.isAtLeast(info.messages.length, 4) // number of states at this time

                // assert the first state
                let states = info.messages.reverse() // order from the oldest state to the newest
                assert.equal(states[0].status[0].local, "Local não definido")
                assert.include(states[0].status[0].time, "2016-07-25") // only date because timezone
                assert.equal(states[0].status[0].status, "Aceitação")

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('Sweden - must pass', function (done) {
            const id = 'RE845212395SE'
            ctt.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.isAtLeast(info.messages.length, 5) // number of states at this time

                // assert the first state
                let states = info.messages.reverse() // order from the oldest state to the newest
                assert.equal(states[0].status[0].local, "Local não definido")
                assert.include(states[0].status[0].time, "2017-01-19") // only date because timezone
                assert.equal(states[0].status[0].status, "Expedição internacional")

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('EA358948794PT - must pass', function (done) {
            const id = 'EA358948794PT'
            ctt.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.isAtLeast(info.messages.length, 2) // number of states at this time

                // assert the first state
                let states = info.messages.reverse() // order from the oldest state to the newest
                assert.equal(states[0].status[0].local, "C.O. LOURES-MARL (OLX)")
                assert.include(states[0].status[0].time, "2017-04-21") // only date because timezone
                assert.equal(states[0].status[0].status, "Expedição")

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('RE845621341SE - must pass', function (done) {
            const id = 'RE845621341SE'
            ctt.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.isAtLeast(info.messages.length, 4) // number of states at this time

                // assert the first state
                let states = info.messages.reverse() // order from the oldest state to the newest
                assert.equal(states[0].status[0].local, "Local não definido")
                assert.include(states[0].status[0].time, "2017-04-12") // only date because timezone
                assert.equal(states[0].status[0].status, "Expedição internacional")

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('should fail to extract', function (done) {
            const id = '423423424'
            ctt.getInfo(id, (err, info) => {
                assert.isNotNull(err)

                done()
            })

        });
    });
});