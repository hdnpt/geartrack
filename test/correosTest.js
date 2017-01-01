const assert = require('chai').assert

const correos = require('../src/correosTracker')

describe('Correos Express', function() {
    this.timeout(0)

    describe('#Correos Express', function() {
        it('should extract the messages from the website with success', function(done) {
            const id = 'PQ4F6P0702945760181750M', code = 1750
            correos.getInfo(id, code, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, '2016122222240929')
                assert.equal(info.state, 'PROVEEDOR/DELEGACION DESTINO')
                assert.equal(info.received, '22/12/16')
                assert.equal(info.sender.name, 'GLOBALEGROW.COM')
                assert.equal(info.receiver.name, 'CARLOS FLORENCIO')
                assert.equal(info.product.ref, 'ES14806990967805')
                assert.equal(info.states.length, 10)
                assert.equal(info.states[0].info, 'SIN RECEPCION: ENVIO GRABADO')
                assert.equal(info.states[0].department, 'CENTRAL')
                assert.equal(info.states[0].date, '22/12/16 22:24')

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