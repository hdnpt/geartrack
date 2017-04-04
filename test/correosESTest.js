const assert = require('chai').assert

const correosES = require('../src/correosESTracker')

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
                assert.deepEqual(info.states, [
                    {
                        "date": "2017-01-20T00:00:00+01:00",
                        "state": "Entregado"
                    },
                    {
                        "date": "2017-01-20T00:00:00+01:00",
                        "state": "En proceso de entrega",
                        "title": "El  envío ya se encuentra en la localidad de destino y será entregado en breve."
                    },
                    {
                        "date": "2017-01-19T00:00:00+01:00",
                        "state": "En tránsito",
                        "title": "El envío está en nuestra red postal y próximamente se realizará su entrega al destinatario o, en caso de que existiera un evento anterior denominado 'En proceso de devolución', la entrega se realizaría para entregar el envío al remitente."
                    },
                    {
                        "date": "2017-01-17T00:00:00+01:00",
                        "state": "Admitido",
                        "title": "El envío ha sido depositado en Correos o en el país de origen del envío."
                    },
                    {
                        "date": "2017-01-01T00:00:00+01:00",
                        "state": "Pre-registrado",
                        "title": "El remitente ha pre-registrado el envío en los sistemas de Correos."
                    }
                ])

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