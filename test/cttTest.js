const assert = require('chai').assert

const singpost = require('../src/cttTracker')
const moment = require('moment')

describe('CTT', function() {
    this.timeout(0)

    describe('#CTT', function() {
        it('Singapura - must pass', function(done) {
            const id = 'RF427233044SG'
            singpost.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.equal(info.state.status, 'Objeto entregue')
                assert.equal(info.messages.length, 7)
                assert.equal(info.messages[0].status.length, 2)
                assert.equal(info.messages[0].status[0].status, 'Entregue')
                assert.equal(info.messages[0].status[0].local, '2910 - SETUBAL')

                assert(moment(info.state.date).isValid())
                assert.equal(moment(info.state.date).format("DD/MM/YYYY"), '25/01/2017')

                assert(moment(info.messages[0].day).isValid())
                assert.equal(moment(info.messages[0].day).format("DD/MM/YYYY"), '25/01/2017')

                assert(moment(info.messages[0].status[0].time).isValid())
                assert.equal(moment(info.messages[0].status[0].time).format("DD/MM/YYYY HH:mm"), '25/01/2017 12:26')

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('Malasya Kuala Lumpur - must pass', function(done) {
            const id = 'RQ062471279MY'
            singpost.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.equal(info.state.status, 'Objeto entregue')
                assert.equal(info.messages.length, 4)
                assert.equal(info.messages[0].status.length, 2)
                assert.equal(info.messages[0].status[0].status, 'Entregue')
                assert.equal(info.messages[0].status[0].local, '4480 - VILA DO CONDE')


                assert(moment(info.state.date).isValid())
                assert.equal(moment(info.state.date).format("DD/MM/YYYY"), '13/01/2017')

                assert(moment(info.messages[0].day).isValid())
                assert.equal(moment(info.messages[0].day).format("DD/MM/YYYY"), '13/01/2017')

                assert(moment(info.messages[0].status[0].time).isValid())
                assert.equal(moment(info.messages[0].status[0].time).format("DD/MM/YYYY HH:mm"), '13/01/2017 10:00')

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('should fail to extract', function(done) {
            const id = '423423424'
            singpost.getInfo(id, (err, info) => {
                assert.isNotNull(err)

                done()
            })

        });
    });


});