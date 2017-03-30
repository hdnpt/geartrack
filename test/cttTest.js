const assert = require('chai').assert

const ctt = require('../src/cttTracker')
const moment = require('moment')

describe('CTT', function() {
    this.timeout(0)

    describe('#CTT', function() {
        it('Singapura - must pass', function(done) {
            const id = 'RF427233044SG'
            ctt.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.equal(info.state.status, 'Objeto entregue')
                assert.equal(info.messages.length, 7)
                assert.equal(info.messages[0].status.length, 2)
                assert.equal(info.messages[0].status[0].status, 'Entregue')
                assert.equal(info.messages[0].status[0].local, '2910 - SETUBAL')

                assert(moment(info.state.date).isValid())
                assert.equal(moment(info.state.date).format("DD/MM/YYYY"), '25/01/2017')

                assert(moment(info.messages[0].day).isValid())
                assert.equal(moment(info.messages[0].day).format("DD/MM/YYYY"), '25/01/2017')

                assert(moment(info.messages[0].status[0].time).isValid())
                assert.equal(moment(info.messages[0].status[0].time).format("DD/MM/YYYY HH:mm"), '25/01/2017 12:26')

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('Malasya Kuala Lumpur - must pass', function(done) {
            const id = 'RQ062471279MY'
            ctt.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.equal(info.state.status, 'Objeto entregue')
                assert.equal(info.messages.length, 4)
                assert.equal(info.messages[0].status.length, 2)
                assert.equal(info.messages[0].status[0].status, 'Entregue')
                assert.equal(info.messages[0].status[0].local, '4480 - VILA DO CONDE')

                assert(moment(info.state.date).isValid())
                assert.equal(moment(info.state.date).format("DD/MM/YYYY"), '13/01/2017')

                assert(moment(info.messages[0].day).isValid())
                assert.equal(moment(info.messages[0].day).format("DD/MM/YYYY"), '13/01/2017')

                assert(moment(info.messages[0].status[0].time).isValid())
                assert.equal(moment(info.messages[0].status[0].time).format("DD/MM/YYYY HH:mm"), '13/01/2017 10:00')

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('China Post - must pass', function(done) {
            const id = 'RI937765505CN'
            ctt.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.equal(info.state.status, 'Objeto entregue')
                assert.deepEqual(info.messages, [
                        {
                            "day": "2016-08-04T00:00:00+01:00",
                            "status": [
                                {
                                    "time": "2016-08-04T17:59:00+01:00",
                                    "status": "Entregue",
                                    "local": "4480 - VILA DO CONDE"
                                },
                                {
                                    "time": "2016-08-04T08:36:00+01:00",
                                    "status": "Em distribuição",
                                    "local": "4480 - VILA DO CONDE"
                                }
                            ]
                        },
                        {
                            "day": "2016-07-29T00:00:00+01:00",
                            "status": [
                                {
                                    "time": "2016-07-29T15:46:00+01:00",
                                    "status": "Receção internacional",
                                    "local": "LISBOA"
                                }
                            ]
                        },
                        {
                            "day": "2016-07-26T00:00:00+01:00",
                            "status": [
                                {
                                    "time": "2016-07-26T12:29:00+01:00",
                                    "status": "Expedição internacional",
                                    "local": "SHENZHEN"
                                }
                            ]
                        },
                        {
                            "day": "2016-07-25T00:00:00+01:00",
                            "status": [
                                {
                                    "time": "2016-07-25T20:45:00+01:00",
                                    "status": "Aceitação",
                                    "local": "Local não definido"
                                }
                            ]
                        }
                    ])

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('Sweden - must pass', function(done) {
            const id = 'RE845212395SE'
            ctt.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.equal(info.state.status, 'Objeto entregue')
                assert.deepEqual(info.messages, [
                    {
                        "day": "2017-03-27T00:00:00+01:00",
                        "status": [
                            {
                                "time": "2017-03-27T17:59:00+01:00",
                                "status": "Entregue",
                                "local": "4490 - POVOA DO VARZIM"
                            },
                            {
                                "time": "2017-03-27T09:26:00+01:00",
                                "status": "Em distribuição",
                                "local": "4490 - POVOA DO VARZIM"
                            }
                        ]
                    },
                    {
                        "day": "2017-03-16T00:00:00+00:00",
                        "status": [
                            {
                                "time": "2017-03-16T09:31:00+00:00",
                                "status": "Autorização de Saída pela Alfândega",
                                "local": "LISBOA"
                            }
                        ]
                    },
                    {
                        "day": "2017-02-15T00:00:00+00:00",
                        "status": [
                            {
                                "time": "2017-02-15T14:49:00+00:00",
                                "status": "Entrada em Armazém para Aplicação de Legislação",
                                "local": "LISBOA"
                            }
                        ]
                    },
                    {
                        "day": "2017-02-01T00:00:00+00:00",
                        "status": [
                            {
                                "time": "2017-02-01T15:05:00+00:00",
                                "status": "Receção internacional",
                                "local": "LISBOA"
                            }
                        ]
                    },
                    {
                        "day": "2017-01-19T00:00:00+00:00",
                        "status": [
                            {
                                "time": "2017-01-19T08:12:00+00:00",
                                "status": "Expedição internacional",
                                "local": "Local não definido"
                            }
                        ]
                    }
                ])
                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('should fail to extract', function(done) {
            const id = '423423424'
            ctt.getInfo(id, (err, info) => {
                assert.isNotNull(err)

                done()
            })

        });
    });


});