const assert = require('chai').assert

const cainiao = require('../src/cainiaoTracker')

describe('Cainiao', function() {
    this.timeout(0)

    describe('#Cainiao', function() {
        it('Kuala Lumpur - must pass', function(done) {
            const id = 'RQ062471279MY'
            cainiao.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.equal(info.messages.length, 16)
                assert.equal(info.messages[0].desc, "Delivery success")

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });


        it('should fail to extract', function(done) {
            const id = '42e3423424'
            cainiao.getInfo(id, (err, info) => {
                assert.isNotNull(err)

                done()
            })

        });
    });


});