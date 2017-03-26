const assert = require('chai').assert

const singpost = require('../src/singpostTracker')

describe('Singpost', function() {
    this.timeout(0)

    describe('#Singpost', function() {
        it('should extract the messages from the website with success', function(done) {
            const id = 'RF427233044SG'
            singpost.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.equal(info.messages[0].date, '25/01/2017')
                assert.equal(info.messages[0].status, 'Product Delivered (Country code: PT)')
                assert.equal(info.messages.length, 7)

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('should fail to extract', function(done) {
            const id = '423423424'
            singpost.getInfo(id, (err, info) => {
                assert.isNotNull(err)

                done()
            })

        });
    });


});