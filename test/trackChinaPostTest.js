const assert = require('chai').assert

const trackChinaPost = require('../src/trackChinaPost')

describe('TrackChinaPost', function () {
    this.timeout(0)

    describe('#TrackChinaPost', function () {
        it('should extract the messages from the website with success', function (done) {
            this.retries(6); // Track china post may be busy

            const id = 'RF622875135CN'
            trackChinaPost.getInfo(id, (err, info) => {
                assert.isNotNull(info)
                assert.isNull(err)

                assert.equal(info.id, 'RF622875135CN')
                assert.equal(info.state, "arrive Portugal Lisbon Transit Station")
                assert.deepEqual(info.states, [
                    {
                        "date": "2017-04-15T10:48:00+08:00",
                        "state": "arrive Portugal Lisbon Transit Station"
                    },
                    {
                        "date": "2017-04-02T12:41:30+08:00",
                        "state": "leaving Shanghai Int'l Airport going to next airport/seaport"
                    },
                    {
                        "date": "2017-04-02T12:16:00+08:00",
                        "state": "arrive Shanghai Int'l Airport"
                    },
                    {
                        "date": "2017-04-01T02:14:49+08:00",
                        "state": "Shanghai Transit Station export customs cleared"
                    },
                    {
                        "date": "2017-03-31T14:44:54+08:00",
                        "state": "Shanghai Transit Station export security scan"
                    },
                    {
                        "date": "2017-03-30T15:32:38+08:00",
                        "state": "Transit Station export customs scan (domestic transit )"
                    },
                    {
                        "date": "2017-03-30T10:33:34+08:00",
                        "state": "Transit Station export security scan"
                    },
                    {
                        "date": "2017-03-29T17:35:17+08:00",
                        "state": "leaving China Post Group city eCommerce dept. ,next station center"
                    },
                    {
                        "date": "2017-03-29T17:32:10+08:00",
                        "state": "China Post Group city eCommerce dept. customs scan"
                    },
                    {
                        "date": "2017-03-29T15:50:16+08:00",
                        "state": "China Post Group city eCommerce dept. received"
                    },
                    {
                        "date": "2017-03-29T08:28:51+08:00",
                        "state": "Electronic Data Received"
                    }
                ])

                console.log(id + ' attempts: ' + info.retries + ' busy_count: ' + info.busy_count)
                done()
            })

        });

        it('should fail to extract', function (done) {
            this.retries(6);

            const id = 'RE84521'
            trackChinaPost.getInfo(id, (err, info) => {
                assert.isNotNull(err)

                done()
            })

        });
    });
});