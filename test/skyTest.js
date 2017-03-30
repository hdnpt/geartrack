const assert = require('chai').assert

const sky = require('../src/skyTracker')
const moment = require('moment')

describe('Sky 56', function() {
    this.timeout(0)

    describe('#Malasya Post', function() {
        it('should extract the messages from the website with success', function(done) {
            const id = 'SYBPL01957855'
            sky.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.equal(info.status[0].area, 'PORTUGAL')
                assert.equal(info.status[2].area, 'Transit Center')

                assert(moment(info.status[8].date).isValid())
                assert.equal(moment(info.status[8].date).format("DD/MM/YYYY"), '23/12/2016')

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });
    });

    describe('#Netherlands Post', function() {
        it('should extract the messages from the website with success', function(done) {
            const id = 'NL14812386123607'
            sky.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.equal(info.status[0].area, 'PORTUGAL')
                assert.equal(info.status[3].area, 'Exchange Bureau')

                assert(moment(info.status[0].date).isValid())
                assert.equal(moment(info.status[0].date).format("DD/MM/YYYY"), '24/12/2016')

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });
    });

    describe('#Priority Line', function () {
        it('should extract the messages from the website with success', function (done) {
            const id = 'PQ4F6P0702945760181750M'
            sky.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.equal(info.messages.length, 6)
                assert.equal(info.messages[0].status, 'Information sent to Spain')

                assert(moment(info.messages[0].date).isValid())
                assert.equal(moment(info.messages[0].date).format("DD/MM/YYYY"), '09/12/2016')


                assert.equal(info.status.length, 5)
                assert.equal(info.status[0].status, 'Entregado')

                assert(moment(info.status[0].date).isValid())
                assert.equal(moment(info.status[0].date).format("DD/MM/YYYY"), '30/12/2016')

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('should correct status en tra?nsito', function(done) {
            const id = 'PQ4F6P0703673180181750T'
            sky.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal('En tránsito', info.status[info.status.length-3].status)

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('should sort status by date', function(done) {
            const id = 'PQ4F6P0702945760181750M'
            sky.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal('Entregado', info.status[0].status)

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });
    });

    describe('#Bpost International', function() {
        it('should extract the messages from the website with success', function(done) {
            const id = 'LVS1376360000761593'
            sky.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.equal(info.messages.length, 6)
                assert.equal(info.messages[1].status, 'Departure to country of destination')

                assert.equal(info.status.length, 7)
                assert.equal(info.status[0].status, 'The transfer of customs')

                assert(moment(info.messages[0].date).isValid())
                assert.equal(moment(info.messages[0].date).format("DD/MM/YYYY"), '23/02/2017')

                assert(moment(info.status[6].date).isValid())
                assert.equal(moment(info.status[6].date).format("DD/MM/YYYY"), '15/02/2017')

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });
    });

    describe('#Switzerland Post Unregistered', function() {
        it('should extract the messages from the website with success', function(done) {
            const id = 'GEGMY00054570'
            sky.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.messages, null)

                assert.equal(info.status.length, 9)
                assert.equal(info.status[0].area, 'PORTUGAL')

                assert(moment(info.status[0].date).isValid())
                assert.equal(moment(info.status[0].date).format("DD/MM/YYYY"), '24/03/2017')

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('should extract the messages from the website with success', function(done) {
            const id = 'SB3000050456'
            sky.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.messages, null)

                assert(info.status.length >= 5)
                assert.equal(info.status[0].area, 'PORTUGAL')

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });
    });


    it('should fail to extract', function(done) {
        const id = '423423424'
        sky.getInfo(id, (err, info) => {
            assert.isNotNull(err)

            done()
        })

    });
});