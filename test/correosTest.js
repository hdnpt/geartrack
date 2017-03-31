const assert = require('chai').assert

const correos = require('../src/correosTracker')
const moment = require('moment-timezone')
moment.tz.setDefault("Europe/Madrid") // +1h

describe('Correos Express', function() {
    this.timeout(0)

    describe('#Correos Express', function() {
        it('should extract the messages from the website with success', function(done) {
            const id = 'PQ4F6P0704104480181750Q', code = 1750
            correos.getInfo(id, code, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, '2017020321364036')
                assert.equal(info.state, 'ENTREGADO')
                assert.equal(moment(info.received).format("DD/MM/YY"), '03/02/17')
                assert.equal(info.sender.name, 'GLOBALEGROW.COM')
                assert.equal(info.receiver.name, 'CARLOS FLORENCIO')
                assert.equal(info.product.ref, 'ES14849763092829')
                assert.equal(info.states.length, 6)
                assert.equal(info.states[0].info, 'ENTREGADO')
                assert.equal(info.states[0].department, 'PORTUGAL - LISBOA')
                assert.equal(moment(info.states[0].date).format("DD/MM/YY HH:mm"), '10/02/17 19:00')

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('should correct company name: zambitious s¿l to zambitious sl', function(done) {
            const id = 'PQ4F6P0705159770184410W', code = 4410
            correos.getInfo(id, code, (err, info) => {
                assert.isNull(err)

                assert.equal('zambitious sl', info.sender.name.toLowerCase())

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });


        it('should fail to extract', function(done) {
            const id = '423423424', code = 1750
            correos.getInfo(id, code, (err, info) => {
                assert.isNotNull(err)

                done()
            })

        });
    });


});