const assert = require('chai').assert

const correos = require('../src/dhlTracker')

describe('DHL Tracker', function() {
    this.timeout(0)

    describe('#DHL Tracker', function() {
        it('should extract the messages from API with success', function(done) {
            const id = '9490966041'
            correos.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, '9490966041')
                assert.equal(info.destiny, 'MAPUTO - MAPUTO - MOZAMBIQUE')
                assert.equal(info.origin, 'LISBON - ODIVELAS - PORTUGAL')
                assert.isAtLeast(info.states.length, 23)

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('should fail to extract', function(done) {
            const id = '94909'
            correos.getInfo(id, (err, info) => {
                assert.isNotNull(err)

                done()
            })

        });
    });


});
