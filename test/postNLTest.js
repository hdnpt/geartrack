const assert = require('chai').assert

const postNL = require('../src/postNL')

describe('PostNL', function () {
    this.timeout(0)

    describe('#TrackChinaPost', function () {
        it('should extract the messages from the website with success', function (done) {
            const id = 'RS804446736NL'
            postNL.getInfo(id, (err, info) => {
                assert.isNotNull(info)
                assert.isNull(err)

                assert.equal(info.id, 'RS804446736NL')
                assert.equal(info.state, 'The item has been delivered successfully')
                assert.deepEqual(info.states, [
                    {
                        "date": "2017-03-15T09:56:00+01:00",
                        "state": "The item has been delivered successfully",
                        "area": "PORTUGAL"
                    },
                    {
                        "date": "2017-03-15T08:59:00+01:00",
                        "state": "The delivery of the item was unsuccessful"
                    },
                    {
                        "date": "2017-03-14T02:40:00+01:00",
                        "state": "The item has been processed in the country of destination"
                    },
                    {
                        "date": "2017-03-10T11:29:00+01:00",
                        "state": "The item has arrived in the country of destination"
                    },
                    {
                        "date": "2017-03-07T16:41:00+01:00",
                        "state": "The item is on transport to the country of destination"
                    },
                    {
                        "date": "2017-03-07T08:31:00+01:00",
                        "state": "The item is processed at the PostNL sorting center"
                    },
                    {
                        "date": "2017-03-07T08:31:00+01:00",
                        "state": "The item is at the PostNL sorting center"
                    },
                    {
                        "date": "2017-03-03T04:18:00+01:00",
                        "state": "The item is pre-advised"
                    }
                ])

                console.log(id + ' attempts: ' + info.retries + ' busy_count: ' + info.busy_count)
                done()
            })

        });

        it('should fail to extract', function (done) {
            const id = 'RE84521'
            postNL.getInfo(id, (err, info) => {
                assert.isNotNull(err)

                done()
            })

        });
    });
});