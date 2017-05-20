const assert = require('chai').assert

const adicional = require('../src/adicionalTracker')

describe('Adicional', function() {
    this.timeout(0)

    // describe('#Adicional', function() {
    //     it('should extract the messages from the website with success', function(done) {
    //         const id = '2016122222240929', code = 1750
    //         adicional.getInfo(id, code, (err, info) => {
    //             assert.isNull(err)
    //
    //             assert.equal(info.date_expedition, '2016-12-24T00:00:00Z')
    //             assert.equal(info.service_type, 'ENTREGA')
    //             assert.equal(info.updated, '2016-12-27T15:57:00Z')
    //             assert.equal(info.status, 'DESCARTADO')
    //
    //             console.log(id + ' attempts: ' + info.retries)
    //             done()
    //         })
    //
    //     });
    //
    //     it('should fail to extract', function(done) {
    //         const id = '423423424', code = 1750
    //         adicional.getInfo(id, code, (err, info) => {
    //             assert.isNotNull(err)
    //
    //             done()
    //         })
    //
    //     });
    // });


});