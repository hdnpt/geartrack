const assert = require('chai').assert

const correos = require('../src/track24')

describe('Track 24', function() {
    this.timeout(0)

    describe('#Track 24', function() {
        it('should extract the messages from API with success', function(done) {
            const id = 'BZ012761245CN'
            correos.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, 'BZ012761245CN')
                assert.equal(info.destiny, 'Portugal')
                assert.equal(info.origin, 'China')
                assert.isAtLeast(info.states.length, 2)

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('should fail to extract', function(done) {
            const id = 'BZ01275CN'
            correos.getInfo(id, (err, info) => {
                assert.isNotNull(err)

                done()
            })

        });
    });


});
