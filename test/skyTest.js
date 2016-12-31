const assert = require('chai').assert

const sky = require('../src/skyTracker')

describe('Sky 56', function() {
    this.timeout(0)

    describe('#Malasya Post', function() {
        it('should extract the messages from the website with success', function(done) {
            const id = 'SYBPL01957855'
            sky.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.equal(info.status[0].area, 'Electronic information')
                assert.equal(info.status[1].area, 'Small package Center')

                done()
            })

        });
    });

});