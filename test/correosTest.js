const assert = require('chai').assert

const correos = require('../src/correosTracker')

// describe('Correos Express', function() {
//     this.timeout(0)
//
//     describe('#Correos Express', function() {
//         it('should extract the messages from the website with success', function(done) {
//             const id = 'PQ4F6P0705905960188365S', code = 1750
//             correos.getInfo(id, (err, info) => {
//                 assert.isNull(err)
//
//                 assert.equal(info.id, 'PQ4F6P0705905960188365S')
//                 assert.equal(info.state, 'Entregado')
//                 assert.equal(info.state2, 'Su envío está entregado')
//                 assert.equal(info.destiny, 'PÊRA')
//                 assert.equal(info.origin, 'ASPE')
//                 assert.equal(info.deliveryDate, undefined)
//                 assert.isAtLeast(info.states.length, 10)
//
//                 console.log(id + ' attempts: ' + info.retries)
//                 done()
//             })
//
//         });
//
//         it('should extract the messages from the website with success and deliveryDate', function(done) {
//             const id = 'PQ4F6P0705248940181750G', code = 1750
//             correos.getInfo(id, (err, info) => {
//                 assert.isNull(err)
//
//                 assert.equal(info.id, 'PQ4F6P0705248940181750G')
//                 assert.equal(info.state, 'Entregado')
//                 assert.equal(info.state2, "Su envío está entregado")
//                 assert.equal(info.destiny, 'LISBOA')
//                 assert.equal(info.origin, 'ASPE')
//                 assert.deepEqual(info.states, [
//                     {
//                         "date": "2017-04-03T22:13:00+02:00",
//                         "state": "ENTREGADO. Su envío está entregado.",
//                         "area": "PORTUGAL - LISBOA"
//                     },
//                     {
//                         "date": "2017-04-03T22:13:00+02:00",
//                         "state": "EN ALMACÉN. Su envío  no ha podido ser entregado por encontrarse el destinatario ausente en el momento de la entrega. Si desea gestionar una nueva entrega por favor pulse la opción Gestionar nueva entrega.",
//                         "area": "PORTUGAL - LISBOA"
//                     },
//                     {
//                         "date": "2017-04-03T20:57:00+02:00",
//                         "state": "SE MUESTRA LA INCIDENCIA. Su envío  no ha podido ser entregado por encontrarse el destinatario ausente en el momento de la entrega. Si desea gestionar una nueva entrega por favor pulse la opción Gestionar nueva entrega.",
//                         "area": "PORTUGAL - LISBOA"
//                     },
//                     {
//                         "date": "2017-04-03T10:46:00+02:00",
//                         "state": "EN REPARTO. Su envío se encuentra en reparto. Lo recibirá en la fecha de entrega prevista.",
//                         "area": "PORTUGAL - LISBOA"
//                     },
//                     {
//                         "date": "2017-03-31T18:02:00+02:00",
//                         "state": "EN RUTA A LOCALIDAD DE DESTINO. Su envío está en uno de nuestro vehículos  siendo transportado a la localidad de destino.",
//                         "area": "MADRID"
//                     },
//                     {
//                         "date": "2017-03-31T18:02:00+02:00",
//                         "state": "EN RUTA A LOCALIDAD DE DESTINO. Su envío está en uno de nuestro vehículos  siendo transportado a la localidad de destino. Lo recibirá en la fecha de entrega prevista.",
//                         "area": "MADRID"
//                     },
//                     {
//                         "date": "2017-03-31T18:02:00+02:00",
//                         "state": "ADMITIDO",
//                         "area": "ALICANTE"
//                     },
//                     {
//                         "date": "2017-03-31T06:52:00+02:00",
//                         "state": "INFORMADO. Ya hemos recibido la información de su envío, en breve dispondremos de  su mercancía. Si necesita información adicional por favor póngase en contacto con su remitente.",
//                         "area": "CENTRAL"
//                     }
//                 ])
//
//                 console.log(id + ' attempts: ' + info.retries)
//                 done()
//             })
//
//         });
//
//         it('should fail to extract', function(done) {
//             const id = 'PQ4F6P070524894018175000000G', code = 1750
//             correos.getInfo(id, (err, info) => {
//                 assert.isNotNull(err)
//
//                 done()
//             })
//
//         });
//     });
//
//
// });
