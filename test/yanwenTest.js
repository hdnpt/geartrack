const assert = require('chai').assert

const yanwen = require('../src/yanwen')

describe('yanwen', function () {
    this.timeout(0)

    describe('#YanwenPost', function () {
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