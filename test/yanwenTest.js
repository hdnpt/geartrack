const assert = require('chai').assert

const yanwen = require('../src/yanwen')

describe('yanwen', function () {
    this.timeout(0)

    describe('#Yanwen', function () {
        it('should extract the messages from the website with success', function (done) {
            const id = '8001077530850'
            yanwen.getInfo(id, (err, info) => {
                assert.isNotNull(info)
                assert.isNull(err)

                assert.equal(info.id, '8001077530850')
                assert.equal(info.origin, 'China')
                assert.equal(info.destiny, 'Portugal')
                assert.equal(info.state, 'Destination Country Item arrived to destination country.')
                assert.deepEqual(info.states, [
                    {
                        "date": "2017-03-26T10:30:00+08:00",
                        "state": "Destination Country Item arrived to destination country."
                    },
                    {
                        "date": "2017-03-26T07:35:00+08:00",
                        "state": "Turkey Item was uplifted to flight to destination country."
                    },
                    {
                        "date": "2017-03-25T02:25:00+08:00",
                        "state": "İSTANBUL(AVR) Gönderi Yurtdışına Sevk Edildi/Item Forwarded to Destination Country"
                    },
                    {
                        "date": "2017-03-14T11:30:00+08:00",
                        "state": "Origin Sipariş Sevk Edilmek İçin Hazır/Item Is Ready for Ship"
                    },
                    {
                        "date": "2017-03-12T09:42:00+08:00",
                        "state": "Shenzhen Despatched from yanwen sorting center."
                    },
                    {
                        "date": "2017-03-12T06:38:00+08:00",
                        "state": "Shenzhen Process completed in yanwen sorting center."
                    },
                    {
                        "date": "2017-03-11T20:48:00+08:00",
                        "state": "Yanwen Acceptance."
                    },
                    {
                        "date": "2017-03-11T02:04:00+08:00",
                        "state": "The item information was created by the seller."
                    }
                ])

                console.log(id + ' attempts: ' + info.retries + ' busy_count: ' + info.busy_count)
                done()
            })

        });

        it('should extract the messages from the website with success 2', function (done) {
            const id = 'UR848385766YP'
            yanwen.getInfo(id, (err, info) => {
                assert.isNotNull(info)
                assert.isNull(err)

                assert.equal(info.id, 'UR848385766YP')
                assert.equal(info.origin, 'China')
                assert.equal(info.destiny, 'Portugal')
                assert.equal(info.state, 'LISBOA International reception')
                assert.deepEqual(info.states, [
                    {
                        "date": "2017-04-05T18:16:00+08:00",
                        "state": "Shanghai Interchange has been opened for export"
                    },
                    {
                        "date": "2017-04-13T03:47:00+08:00",
                        "state": "LISBOA International reception"
                    },
                    {
                        "date": "2017-04-13T03:47:00+08:00",
                        "state": "葡萄牙里斯本 到达互换局"
                    },
                    {
                        "date": "2017-04-03T22:22:00+08:00",
                        "state": "Canton business international package to leave, the next stop [Canton business bulk]"
                    },
                    {
                        "date": "2017-04-07T13:47:00+08:00",
                        "state": "上海浦东 离开"
                    },
                    {
                        "date": "2017-04-07T13:47:00+08:00",
                        "state": "上海浦东 离开交航"
                    },
                    {
                        "date": "2017-04-07T11:48:00+08:00",
                        "state": "上海浦东 到达"
                    },
                    {
                        "date": "2017-04-06T01:43:00+08:00",
                        "state": "Shanghai Exchange Bureau has been export direct seal"
                    },
                    {
                        "date": "2017-04-03T20:51:00+08:00",
                        "state": "Guangshang international package has been closed"
                    },
                    {
                        "date": "2017-04-03T20:08:00+08:00",
                        "state": "Non-defined location Acceptance by the Post Services"
                    },
                    {
                        "date": "2017-04-03T20:08:00+08:00",
                        "state": "Guangshang international package has been received"
                    },
                    {
                        "date": "2017-04-02T19:03:00+08:00",
                        "state": "Shanghai Despatched from yanwen sorting center."
                    },
                    {
                        "date": "2017-04-02T14:11:00+08:00",
                        "state": "Shanghai Process completed in yanwen sorting center."
                    },
                    {
                        "date": "2017-04-02T13:55:00+08:00",
                        "state": "Yanwen Acceptance."
                    }
                ])

                console.log(id + ' attempts: ' + info.retries + ' busy_count: ' + info.busy_count)
                done()
            })

        });

        it('should extract the messages from the website with success even the ones between countries', function (done) {
            const id = 'UA846098317YP'
            yanwen.getInfo(id, (err, info) => {
                assert.isNotNull(info)
                assert.isNull(err)

                assert.equal(info.id, 'UA846098317YP')
                assert.equal(info.origin, 'China')
                assert.equal(info.destiny, 'Portugal')
                assert.equal(info.state, 'Portugal Arrive at Portugal airport.')
                assert.deepEqual(info.states, [
                    {
                        "date": "2017-03-20T15:00:00+08:00",
                        "state": "Portugal Arrive at Portugal airport."
                    },
                    {
                        "date": "2017-03-17T15:00:00+08:00",
                        "state": "Handled by airline,flight No.."
                    },
                    {
                        "date": "2017-03-17T03:00:00+08:00",
                        "state": "Internationg Mail Center Prepare to dispatch."
                    },
                    {
                        "date": "2017-03-16T03:00:00+08:00",
                        "state": "Internationg Mail Center Received."
                    },
                    {
                        "date": "2017-03-16T01:00:00+08:00",
                        "state": "Internationg Mail Center Accepted."
                    },
                    {
                        "date": "2017-03-15T23:00:00+08:00",
                        "state": "The post office of electronic information has been received."
                    },
                    {
                        "date": "2017-03-15T03:39:00+08:00",
                        "state": "Yiwu Despatched from yanwen sorting center."
                    },
                    {
                        "date": "2017-03-15T00:08:00+08:00",
                        "state": "Yiwu Process completed in yanwen sorting center."
                    },
                    {
                        "date": "2017-03-14T15:29:00+08:00",
                        "state": "Yanwen Acceptance."
                    },
                    {
                        "date": "2017-03-14T09:14:00+08:00",
                        "state": "The item information was created by the seller."
                    }
                ])

                console.log(id + ' attempts: ' + info.retries + ' busy_count: ' + info.busy_count)
                done()
            })

        });


        it('should fail to extract', function (done) {
            const id = 'RE84521'
            yanwen.getInfo(id, (err, info) => {
                assert.isNotNull(err)

                done()
            })

        });
    });
});
