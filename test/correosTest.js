const assert = require('chai').assert

const correos = require('../src/correosTracker')

describe('Correos Express', function() {
    this.timeout(0)

    describe('#Correos Express', function() {
        it('should extract the messages from the website with success', function(done) {
            const id = 'PQ4F6P0704104480181750Q', code = 1750
            correos.getInfo(id, code, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, 'PQ4F6P0704104480181750Q')
                assert.equal(info.state, 'Entregado')
                assert.equal(info.state2, 'Su envío está entregado')
                assert.equal(info.destiny, 'LISBOA')
                assert.equal(info.origin, 'BARCELONA')
                assert.equal(info.deliveryDate, undefined)
                assert.deepEqual(info.states, [
                    {
                        "date": "2017-02-10T19:00:00+01:00",
                        "state": "ENTREGADO. Su envío está entregado.",
                        "area": "PORTUGAL - LISBOA"
                    },
                    {
                        "date": "2017-02-06T09:04:00+01:00",
                        "state": "EN REPARTO. Su envío se encuentra en reparto. Lo recibirá en la fecha de entrega prevista.",
                        "area": "PORTUGAL - LISBOA"
                    },
                    {
                        "date": "2017-02-06T08:34:00+01:00",
                        "state": "EN DESTINO. Su envío está en nuestras instalaciones de destino, y lo estamos clasificando  para ponerlo en reparto. Lo recibirá en la fecha de entrega prevista.",
                        "area": "PORTUGAL - LISBOA"
                    },
                    {
                        "date": "2017-02-04T03:56:00+01:00",
                        "state": "INFORMADO. Ya hemos recibido la información de su envío, en breve dispondremos de  su mercancía. Si necesita más información por favor contacte con su remitente",
                        "area": "PORTUGAL - LISBOA"
                    },
                    {
                        "date": "2017-02-03T21:48:00+01:00",
                        "state": "ADMITIDO",
                        "area": "BARCELONA"
                    },
                    {
                        "date": "2017-02-03T21:36:00+01:00",
                        "state": "INFORMADO. Ya hemos recibido la información de su envío, en breve dispondremos de  su mercancía. Si necesita información adicional por favor póngase en contacto con su remitente.",
                        "area": "CENTRAL"
                    }
                ])

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('should extract the messages from the website with success and deliveryDate', function(done) {
            const id = 'PQ4F6P0705248940181750G', code = 1750
            correos.getInfo(id, code, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, 'PQ4F6P0705248940181750G')
                assert.equal(info.state, 'En ruta a localidad de destino')
                assert.equal(info.state2, 'Su envío está en uno de nuestro vehículos  siendo transportado a la localidad de destino')
                assert.equal(info.destiny, 'LISBOA')
                assert.equal(info.origin, 'ASPE')
                assert.equal(info.deliveryDate, '2017-04-03T00:00:00+01:00')
                assert.deepEqual(info.states, [
                    {
                        "date": "2017-03-31T18:02:00+02:00",
                        "state": "EN RUTA A LOCALIDAD DE DESTINO. Su envío está en uno de nuestro vehículos  siendo transportado a la localidad de destino.",
                        "area": "MADRID"
                    },
                    {
                        "date": "2017-03-31T18:02:00+02:00",
                        "state": "EN RUTA A LOCALIDAD DE DESTINO. Su envío está en uno de nuestro vehículos  siendo transportado a la localidad de destino. Lo recibirá en la fecha de entrega prevista.",
                        "area": "MADRID"
                    },
                    {
                        "date": "2017-03-31T18:02:00+02:00",
                        "state": "ADMITIDO",
                        "area": "ALICANTE"
                    },
                    {
                        "date": "2017-03-31T06:52:00+02:00",
                        "state": "INFORMADO. Ya hemos recibido la información de su envío, en breve dispondremos de  su mercancía. Si necesita información adicional por favor póngase en contacto con su remitente.",
                        "area": "CENTRAL"
                    }
                ])

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('should fail to extract', function(done) {
            const id = 'PQ4F6P070524894018175000000G', code = 1750
            correos.getInfo(id, code, (err, info) => {
                assert.isNotNull(err)

                done()
            })

        });
    });


});