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
                assert.isDefined(info.state)
                assert.isAtLeast(info.states.length, 8)

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
                assert.isDefined(info.state)
                assert.isAtLeast(info.states.length, 19)

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
                assert.isDefined(info.state)
                assert.isAtLeast(info.states.length, 10)

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
