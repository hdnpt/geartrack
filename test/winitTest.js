const assert = require('chai').assert

const winit = require('../src/winitTrack')

describe('Winit Tracking and Trace', function() {
    this.timeout(0)

    describe('#Winit Tracking and Trace', function() {
        it('should extract the messages from the website with success', function(done) {
            const id = 'ID18050634174840CN'
            winit.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, 'ID18050634174840CN')
                assert.equal(info.state, 'Enroute to Next Station')
                assert.deepEqual(info.states, [
                    {
                        "date": "2017-04-21T22:27:06+08:00",
                        "state": "Enroute to Next Station",
                        "area": "Shanghai"
                    },
                    {
                        "date": "2017-04-21T22:26:34+08:00",
                        "state": "China Post Acceptance",
                        "area": "Shanghai"
                    },
                    {
                        "date": "2017-04-21T00:15:34+08:00",
                        "state": "Enroute to Carrier’s Depot to be shipped via [China Post], this is an untracked service, you will not receive any additional tracking information before delivery.",
                        "area": "Shanghai"
                    },
                    {
                        "date": "2017-04-21T00:15:31+08:00",
                        "state": "Enroute to Next Operation Center",
                        "area": "Yiwu"
                    },
                    {
                        "date": "2017-04-20T16:56:46+08:00",
                        "state": "Processing shipment",
                        "area": "Jinhua"
                    },
                    {
                        "date": "2017-04-20T15:48:49+08:00",
                        "state": "Picked up Package from Origin",
                        "area": "Yiwu"
                    }
                ])

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('should extract the messages from the website with success 2', function(done) {
            const id = 'ID18130739928357CN'
            winit.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.isAtLeast(info.states.length, 7)

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('should fail to extract', function(done) {
            const id = 'safafsa'
            winit.getInfo(id, (err, info) => {
                assert.isNotNull(err)

                done()
            })

        });
    });


});
