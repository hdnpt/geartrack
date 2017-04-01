const assert = require('chai').assert

const singpost = require('../src/singpostTracker')
const moment = require('moment-timezone')
moment.tz.setDefault("Asia/Singapore") // +8h

describe('Singpost', function() {
    this.timeout(0)

    describe('#Singpost', function() {
        it('should extract the messages from the website with success', function(done) {
            const id = 'RF427233044SG'
            singpost.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.deepEqual(info.messages, [
                    {
                        "date": "2017-01-25T00:00:00+08:00",
                        "status": "Product Delivered"
                    },
                    {
                        "date": "2016-12-17T00:00:00+08:00",
                        "status": "Held by Custom"
                    },
                    {
                        "date": "2016-12-05T00:00:00+08:00",
                        "status": "Held by Custom"
                    },
                    {
                        "date": "2016-12-02T00:00:00+08:00",
                        "status": "Arrival at Processing Center"
                    },
                    {
                        "date": "2016-11-30T00:00:00+08:00",
                        "status": "Arrival at Destination Post"
                    },
                    {
                        "date": "2016-11-28T00:00:00+08:00",
                        "status": "Despatched to overseas"
                    },
                    {
                        "date": "2016-11-26T00:00:00+08:00",
                        "status": "Received from Customer"
                    }
                ])

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('should fail to extract', function(done) {
            const id = '423423424'
            singpost.getInfo(id, (err, info) => {
                assert.isNotNull(err)

                done()
            })

        });
    });


});