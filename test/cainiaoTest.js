const assert = require('chai').assert

const cainiao = require('../src/cainiaoTracker')
const moment = require('moment-timezone')
const zone = "Asia/Kuala_Lumpur" // +8h

describe('Cainiao', function() {
    this.timeout(0)

    describe('#Cainiao', function() {
        it('Kuala Lumpur - must pass', function(done) {
            const id = 'RQ062471279MY'
            cainiao.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.deepEqual(info.messages, [
                    {
                        "status": "Delivery success",
                        "date": "2017-01-13T10:00:00+08:00"
                    },
                    {
                        "status": "In distribution",
                        "date": "2017-01-13T09:25:00+08:00"
                    },
                    {
                        "status": "International reception",
                        "date": "2017-01-10T17:45:00+08:00"
                    },
                    {
                        "status": "Leave the transit coutry",
                        "date": "2016-12-28T13:45:08+08:00"
                    },
                    {
                        "status": "International dispatch",
                        "date": "2016-12-28T13:37:00+08:00"
                    },
                    {
                        "status": "Arrival at transit country",
                        "date": "2016-12-27T15:39:39+08:00"
                    },
                    {
                        "status": "Acceptance by the Post Services",
                        "date": "2016-12-27T13:47:00+08:00"
                    },
                    {
                        "status": "Security check success",
                        "date": "2016-12-26T21:07:31+08:00"
                    },
                    {
                        "status": "Leave the processing center and shipped",
                        "date": "2016-12-26T09:03:29+08:00"
                    },
                    {
                        "status": "Item sorting by shipper in shenzhen",
                        "date": "2016-12-24T15:58:57+08:00"
                    },
                    {
                        "status": "Item received by shipper in shenzhen",
                        "date": "2016-12-24T11:56:45+08:00"
                    },
                    {
                        "status": "Outbound in sorting center",
                        "date": "2016-12-23T16:16:56+08:00"
                    },
                    {
                        "status": "Inbound in sorting center",
                        "date": "2016-12-23T13:52:05+08:00"
                    },
                    {
                        "status": "Accepted by carrier",
                        "date": "2016-12-22T22:52:13+08:00"
                    },
                    {
                        "status": "Waiting for pick up",
                        "date": "2016-12-22T09:20:26+08:00"
                    },
                    {
                        "status": "Shipment confirmation",
                        "date": "2016-12-21T11:20:15+08:00"
                    }
                ])

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