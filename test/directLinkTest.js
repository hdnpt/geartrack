const assert = require('chai').assert

const directLink = require('../src/directLink')
const moment = require('moment')

describe('DirectLink', function () {
    this.timeout(0)

    describe('#DirectLink', function () {
        it('should extract the messages from the website with success', function (done) {
            const id = 'RE845212395SE'
            directLink.getInfo(id, (err, info) => {
                assert.isNotNull(info)
                assert.isNull(err)

                assert.equal(info.id, 'RE845212395SE')
                assert.equal(info.state, 'Order delivered')

                assert.equal(info.states.length, 8)
                assert.equal(moment(info.states[0].date).format('DD/MM/YY'), "27/03/17")
                assert.equal(info.states[0].state, "Order delivered")

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('should fail to extract', function (done) {
            const id = 'RE84521'
            directLink.getInfo(id, (err, info) => {
                assert.isNotNull(err)

                done()
            })

        });
    });


});