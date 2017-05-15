const assert = require('chai').assert

const panasia = require('../src/panasiaTracker')

describe('Panasia', function() {
    this.timeout(0)

    describe('#Panasia', function() {
        it('should extract the messages from the website with success', function(done) {
            const id = 'PQ4F6P0705898310181998C'
            panasia.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.equal(info.states.length, 6)
                assert.equal(info.country, 'PORTUGAL')
                assert.equal(info.product, 'CORREOS')
                assert.equal(info.orderNumber, 'A00A076170420008254')
                assert.equal(info.states[0].state, 'Entregado')
                assert.equal(info.states[0].date, '2017-05-03T00:00:00+08:00')

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });


        it('should fail to extract', function(done) {
            const id = '423423424'
            panasia.getInfo(id, (err, info) => {
                assert.isNotNull(err)

                done()
            })

        });
    });


});