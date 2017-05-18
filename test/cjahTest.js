const assert = require('chai').assert

const cjah = require('../src/cjahTracker')

describe('Cjah', function() {
    this.timeout(0)

    // describe('#Cjah', function() {
    //     it('should extract the messages from the website with success', function(done) {
    //         const id = 'SB3000050456'
    //         cjah.getInfo(id, (err, info) => {
    //             assert.isNull(err)
    //
    //             assert.equal(info.id, 'SB3000050456')
    //             assert.equal(info.state, 'Arrived at LISBON airport on 3/25/2017 12:42:00 PM')
    //             assert.deepEqual(info.states, [
    //                 {
    //                     "id": "SB3000050456",
    //                     "date": "2017-03-25T12:42:00+08:00",
    //                     "state": "Arrived at LISBON airport on 3/25/2017 12:42:00 PM"
    //                 },
    //                 {
    //                     "id": "SB3000050456",
    //                     "date": "2017-03-23T09:54:14+08:00",
    //                     "state": "Dispatch out from transit airport"
    //                 },
    //                 {
    //                     "id": "SB3000050456",
    //                     "date": "2017-03-22T10:55:58+08:00",
    //                     "state": "Transit out from HKG"
    //                 },
    //                 {
    //                     "id": "SB3000050456",
    //                     "date": "2017-03-19T11:17:59+08:00",
    //                     "state": "Dispatch to PORTUGAL"
    //                 },
    //                 {
    //                     "id": "SB3000050456",
    //                     "date": "2017-03-18T12:01:15+08:00",
    //                     "state": "Posting over the counter"
    //                 },
    //                 {
    //                     "id": "SB3000050456",
    //                     "date": "2017-03-17T00:00:00+08:00",
    //                     "state": "Pre-Check to PORTUGAL"
    //                 }
    //             ])
    //
    //             done()
    //         })
    //
    //     });
    //
    //     it('should fail to extract', function(done) {
    //         const id = 'AB'
    //         cjah.getInfo(id, (err, info) => {
    //             assert.isNotNull(err)
    //
    //             done()
    //         })
    //
    //     });
    // });


});
