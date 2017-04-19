const assert = require('chai').assert

const correos = require('../src/malaysiaPosTracker')

describe('Malaysia Pos', function() {
    this.timeout(0)

    describe('#Malaysia Pos', function() {
        it('should extract the messages from the website with success', function(done) {
            const id = 'RC104712375MY'
            correos.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, 'RC104712375MY')
                assert.equal(info.state, 'Item dispatched out LISBOA (PT INTERNATIONAL)')
                assert.deepEqual(info.states, [
                    {
                        "date": "2017-04-09T16:51:10+08:00",
                        "state": "Item dispatched out LISBOA (PT INTERNATIONAL)",
                        "area": "KUALA LUMPUR D"
                    },
                    {
                        "date": "2017-04-09T13:21:19+08:00",
                        "state": "Initial item information received",
                        "area": "In Transit"
                    }
                ])

                done()
            })

        });

        it('should fail to extract', function(done) {
            const id = 'AB', code = 1750
            correos.getInfo(id, code, (err, info) => {
                assert.isNotNull(err)

                done()
            })

        });
    });


});
