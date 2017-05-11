const assert = require('chai').assert

const correos = require('../src/correosOldTracker')

describe('Correos Express', function() {
    this.timeout(0)

    describe('#Correos Express', function() {
        //TO add some test

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