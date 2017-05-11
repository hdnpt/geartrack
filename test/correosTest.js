const assert = require('chai').assert

const correos = require('../src/correosTracker')

describe('Correos Express', function() {
    this.timeout(0)

    describe('#Correos Express', function() {
        it('should extract the messages from the website with success', function(done) {
            const id = 'PQ4F6P0705905960188365S', code = 1750
            correos.getInfo(id, code, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, 'PQ4F6P0705905960188365S')
                assert.equal(info.state, 'Entregado')
                assert.equal(info.state2, 'Su envío está entregado')
                assert.equal(info.destiny, 'PÊRA')
                assert.equal(info.origin, 'ASPE')
                assert.equal(info.deliveryDate, undefined)
                assert.isAtLeast(info.states.length, 10)

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('should fail to extract', function(done) {
            const id = 'PQ4F6P070524894018175000000G', code = 1750
            correos.getInfo(id, code, (err, info) => {
                assert.isNotNull(err)

                done()
            })

        });
    });


});
