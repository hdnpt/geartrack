const assert = require('chai').assert

const trackChinaPost = require('../src/trackChinaPost')
const moment = require('moment')

describe('TrackChinaPost', function () {
    this.timeout(0)

    describe('#TrackChinaPost', function () {
        it('should extract the messages from the website with success', function (done) {
            const id = 'RF622875135CN'
            trackChinaPost.getInfo(id, (err, info) => {
                assert.isNotNull(info)
                assert.isNull(err)

                assert.equal(info.id, 'RF622875135CN')
                assert.equal(info.state, 'Shanghai Transit Station export security scan')
                assert.equal(moment.utc(info.states[0].date).format('DD/MM/YY HH:mm'), '31/03/17 13:44')
                assert.deepEqual(info.states, [
                    {
                        date: '2017-03-31T13:44:54Z',
                        state: 'Shanghai Transit Station export security scan'
                    },
                    {
                        date: '2017-03-30T14:32:38Z',
                        state: 'Transit Station export customs scan (domestic transit )'
                    },
                    {
                        date: '2017-03-30T09:33:34Z',
                        state: 'Transit Station export security scan'
                    },
                    {
                        date: '2017-03-29T16:35:17Z',
                        state: 'leaving China Post Group city eCommerce dept. ,next station center'
                    },
                    {
                        date: '2017-03-29T16:32:10Z',
                        state: 'China Post Group city eCommerce dept. customs scan'
                    },
                    {
                        date: '2017-03-29T14:50:16Z',
                        state: 'China Post Group city eCommerce dept. received'
                    },
                    {
                        date: '2017-03-29T07:28:51Z',
                        state: 'Electronic Data Received'
                    }
                ])

                console.log(id + ' attempts: ' + info.retries + ' busy_count: ' + info.busy_count)
                done()
            })

        });

        it('should fail to extract', function (done) {
            const id = 'RE84521'
            trackChinaPost.getInfo(id, (err, info) => {
                assert.isNotNull(err)

                done()
            })

        });
    });


});