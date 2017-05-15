const assert = require('chai').assert

const correos = require('../src/parcelTracker')

describe('Parcel Tracker', function() {
    this.timeout(0)

    describe('#Parcel Tracker', function() {
        it('should extract the messages from API with success', function(done) {
            const id = 'UPAAA000000218364455'
            correos.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, 'UPAAA000000218364455')
                assert.isDefined(info.state)
                assert.equal(info.destiny, 'PT - Seixal - Pinhal de Frades')
                assert.equal(info.origin, 'GB - Hampshire - Portsmouth')
                assert.isUndefined(info.state2)
                assert.isUndefined(info.deliveryDate)
                assert.isAtLeast(info.states.length, 3)

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('should fail to extract', function(done) {
            const id = 'UPAAA000000'
            correos.getInfo(id, (err, info) => {
                assert.isNotNull(err)

                done()
            })

        });
    });


});
