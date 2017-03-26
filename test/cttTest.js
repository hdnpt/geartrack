const assert = require('chai').assert

const singpost = require('../src/cttTracker')

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
                assert.equal(info.messages[0].day, 'quarta-feira, 25 Janeiro 2017')
                assert.equal(info.messages[0].status.length, 2)
                assert.equal(info.messages[0].status[0].hours, '12:26')
                assert.equal(info.messages[0].status[0].status, 'Entregue')
                assert.equal(info.messages[0].status[0].local, '2910 - SETUBAL')

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
                assert.equal(info.messages[0].day, 'sexta-feira, 13 Janeiro 2017')
                assert.equal(info.messages[0].status.length, 2)
                assert.equal(info.messages[0].status[0].hours, '10:00')
                assert.equal(info.messages[0].status[0].status, 'Entregue')
                assert.equal(info.messages[0].status[0].local, '4480 - VILA DO CONDE')

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