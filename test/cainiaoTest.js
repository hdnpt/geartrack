const assert = require('chai').assert

const cainiao = require('../src/cainiaoTracker')

describe('Cainiao', function() {
    this.timeout(0)

    describe('#Cainiao', function () {
        it('Yanwen LP WITH CTT ID.. - must pass', function (done) {
            const id = 'LP00068434402473'
            cainiao.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.equal(info.destinyId, 'RQ083716873MY')
                assert.isTrue(info.states.length >= 18)
                let firstState = info.states[info.states.length - 1]
                assert.equal(firstState.date, "2017-02-14T09:19:24+08:00")
                assert.equal(firstState.state, "Shipment confirmation")


                console.log(id + ' attempts: ' + info.retries)
                done()
            })
        });

        it('Yanwen LP.. - must pass', function (done) {
            const id = 'LP00071653567725'
            cainiao.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.isTrue(info.states.length >= 7)
                assert.isNull(info.destinyId)
                let firstState = info.states[info.states.length - 1]
                assert.equal(firstState.date, "2017-03-30T13:34:52+08:00")
                assert.equal(firstState.state, "Shipment confirmation")


                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('Kuala Lumpur - must pass', function(done) {
            const id = 'RQ062471279MY'
            cainiao.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.deepEqual(info.states, [
                    {
                        "state": "Delivery success",
                        "date": "2017-01-13T10:00:00+08:00"
                    },
                    {
                        "state": "In distribution",
                        "date": "2017-01-13T09:25:00+08:00"
                    },
                    {
                        "state": "International reception",
                        "date": "2017-01-10T17:45:00+08:00"
                    },
                    {
                        "state": "Leave the transit coutry",
                        "date": "2016-12-28T13:45:08+08:00"
                    },
                    {
                        "state": "International dispatch",
                        "date": "2016-12-28T13:37:00+08:00"
                    },
                    {
                        "state": "Arrival at transit country",
                        "date": "2016-12-27T15:39:39+08:00"
                    },
                    {
                        "state": "Acceptance by the Post Services",
                        "date": "2016-12-27T13:47:00+08:00"
                    },
                    {
                        "state": "Security check success",
                        "date": "2016-12-26T21:07:31+08:00"
                    },
                    {
                        "state": "Leave the processing center and shipped",
                        "date": "2016-12-26T09:03:29+08:00"
                    },
                    {
                        "state": "Item sorting by shipper in shenzhen",
                        "date": "2016-12-24T15:58:57+08:00"
                    },
                    {
                        "state": "Item received by shipper in shenzhen",
                        "date": "2016-12-24T11:56:45+08:00"
                    },
                    {
                        "state": "Outbound in sorting center",
                        "date": "2016-12-23T16:16:56+08:00"
                    },
                    {
                        "state": "Inbound in sorting center",
                        "date": "2016-12-23T13:52:05+08:00"
                    },
                    {
                        "state": "Accepted by carrier",
                        "date": "2016-12-22T22:52:13+08:00"
                    },
                    {
                        "state": "Waiting for pick up",
                        "date": "2016-12-22T09:20:26+08:00"
                    },
                    {
                        "state": "Shipment confirmation",
                        "date": "2016-12-21T11:20:15+08:00"
                    }
                ])

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('China EMS ePacket - must pass', function(done) {
            const id = 'LX299455986CN'
            cainiao.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.deepEqual(info.states, [
                    {
                        "date": "2017-04-03T10:16:32+08:00",
                        "state": "Despatch from Sorting Center",
                    },
                    {
                        "date": "2017-04-03T00:10:00+08:00",
                        "state": "International dispatch"
                    },
                    {
                        "date": "2017-04-02T04:55:00+08:00",
                        "state": "Arrival at Sorting Center"
                    },
                    {
                        "date": "2017-04-02T01:31:00+08:00",
                        "state": "Despatch from Sorting Center"
                    },
                    {
                        "date": "2017-04-01T00:29:00+08:00",
                        "state": "Arrival at Sorting Center"
                    },
                    {
                        "date": "2017-03-31T23:26:00+08:00",
                        "state": "Despatch from Sorting Center"
                    },
                    {
                        "date": "2017-03-31T19:55:13+08:00",
                        "state": "Arrival at Sorting Center"
                    },
                    {
                        "date": "2017-03-31T17:19:00+08:00",
                        "state": "Posting"
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
