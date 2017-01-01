const assert = require('chai').assert

const expresso = require('../src/expresso24Tracker')

describe('Expresso24', function() {
    this.timeout(0)

    describe('#Expresso24', function() {
        it('should extract the messages from the website with success', function(done) {
            const id = 'ES14806990967805'
            expresso.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.guide, 'X6019011')
                assert.equal(info.origin, 'GLOBALEGROW.COM')
                assert.equal(info.date, '2016-12-22')
                assert.equal(info.status, 'Entregue')
                assert.equal(info.receiver_name, 'CARLOS FLORENCIO')
                assert.equal(info.ref, id)

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('should fail to extract', function(done) {
            const id = '423423424'
            expresso.getInfo(id, (err, info) => {
                assert.isNotNull(err)

                done()
            })

        });
    });


});