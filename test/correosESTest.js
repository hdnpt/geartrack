const assert = require('chai').assert

const correosES = require('../src/correosESTracker')
const moment = require('moment')

describe('Correos ES', function() {
    this.timeout(0)

    describe('#Correos ES', function() {
        it('should extract the messages from the website with success', function(done) {
            const id = 'PQ4F6P0703673180181750T';
            correosES.getInfo(id, (err, info) => {
                assert.isNotNull(info)
                assert.isNull(err)

                assert.equal(info.id, 'PQ4F6P0703673180181750T')
                assert.equal(info.state, 'Entregado')
                assert.equal(info.states.length, 5)
                assert.equal(info.states[0].title, 'Entregado')
                assert.equal(moment(info.states[0].date).format("DD/MM/YYYY"), '20/01/2017')
                assert.equal(info.states[1].title, 'En proceso de entrega')
                assert.equal(moment(info.states[1].date).format("DD/MM/YYYY"), '20/01/2017')
                assert.equal(info.states[2].title, 'En tr�nsito')
                assert.equal(moment(info.states[2].date).format("DD/MM/YYYY"), '19/01/2017')
                assert.equal(info.states[3].title, 'Admitido')
                assert.equal(moment(info.states[3].date).format("DD/MM/YYYY"), '17/01/2017')
                assert.equal(info.states[4].title, 'Pre-registrado')
                assert.equal(moment(info.states[4].date).format("DD/MM/YYYY"), '01/01/2017')

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('should fail to extract', function(done) {
            const id = '423423424'
            correosES.getInfo(id, (err, info) => {
                assert.isNotNull(err)

                done()
            })

        });
    });


});