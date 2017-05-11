const assert = require('chai').assert

const ctt = require('../src/cttTracker')

describe('CTT', function () {
    this.timeout(0)

    describe('#CTT', function () {
        it('Singapura - must pass', function (done) {
            const id = 'RF427233044SG'
            ctt.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.equal(info.state.status, 'Objeto entregue')
                assert.deepEqual(info.messages, [
                    {
                        "day": "2017-01-25T00:00:00Z",
                        "status": [
                            {
                                "time": "2017-01-25T12:26:00Z",
                                "status": "Entregue",
                                "local": "2910 - SETUBAL"
                            },
                            {
                                "time": "2017-01-25T08:04:00Z",
                                "status": "Em distribuição",
                                "local": "2910 - SETUBAL"
                            }
                        ]
                    },
                    {
                        "day": "2017-01-24T00:00:00Z",
                        "status": [
                            {
                                "time": "2017-01-24T03:10:00Z",
                                "status": "Expedição",
                                "local": "COCS - LISBOA"
                            }
                        ]
                    },
                    {
                        "day": "2017-01-20T00:00:00Z",
                        "status": [
                            {
                                "time": "2017-01-20T15:47:00Z",
                                "status": "Autorização de Saída pela Alfândega",
                                "local": "LISBOA"
                            }
                        ]
                    },
                    {
                        "day": "2016-12-17T00:00:00Z",
                        "status": [
                            {
                                "time": "2016-12-17T11:32:00Z",
                                "status": "Entrada em Armazém para Aplicação de Legislação",
                                "local": "LISBOA"
                            }
                        ]
                    },
                    {
                        "day": "2016-12-05T00:00:00Z",
                        "status": [
                            {
                                "time": "2016-12-05T14:41:00Z",
                                "status": "Para apresentação à Alfândega",
                                "local": "LISBOA"
                            }
                        ]
                    },
                    {
                        "day": "2016-12-02T00:00:00Z",
                        "status": [
                            {
                                "time": "2016-12-02T07:34:00Z",
                                "status": "Receção internacional",
                                "local": "LISBOA"
                            }
                        ]
                    },
                    {
                        "day": "2016-11-28T00:00:00Z",
                        "status": [
                            {
                                "time": "2016-11-28T10:07:00Z",
                                "status": "Expedição internacional",
                                "local": "SINGAPORE SAL"
                            }
                        ]
                    }
                ])
                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('Malasya Kuala Lumpur - must pass', function (done) {
            const id = 'RQ062471279MY'
            ctt.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.equal(info.state.status, 'Objeto entregue')
                assert.deepEqual(info.messages, [
                    {
                        "day": "2017-01-13T00:00:00Z",
                        "status": [
                            {
                                "time": "2017-01-13T10:00:00Z",
                                "status": "Entregue",
                                "local": "8811516"
                            },
                            {
                                "time": "2017-01-13T09:25:00Z",
                                "status": "Em distribuição",
                                "local": "8811516"
                            }
                        ]
                    },
                    {
                        "day": "2017-01-10T00:00:00Z",
                        "status": [
                            {
                                "time": "2017-01-10T17:45:00Z",
                                "status": "Receção internacional",
                                "local": "LISBOA"
                            }
                        ]
                    },
                    {
                        "day": "2016-12-28T00:00:00Z",
                        "status": [
                            {
                                "time": "2016-12-28T13:37:00Z",
                                "status": "Expedição internacional",
                                "local": "KUALA LUMP B"
                            }
                        ]
                    },
                    {
                        "day": "2016-12-27T00:00:00Z",
                        "status": [
                            {
                                "time": "2016-12-27T13:47:00Z",
                                "status": "Aceitação",
                                "local": "KUALA LUMP B"
                            }
                        ]
                    }
                ])

                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('China Post - must pass', function (done) {
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
                                "local": "8811516"
                            },
                            {
                                "time": "2016-08-04T08:36:00+01:00",
                                "status": "Em distribuição",
                                "local": "8811516"
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

        it('Sweden - must pass', function (done) {
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
                        "day": "2017-03-16T00:00:00Z",
                        "status": [
                            {
                                "time": "2017-03-16T09:31:00Z",
                                "status": "Autorização de Saída pela Alfândega",
                                "local": "LISBOA"
                            }
                        ]
                    },
                    {
                        "day": "2017-02-15T00:00:00Z",
                        "status": [
                            {
                                "time": "2017-02-15T14:49:00Z",
                                "status": "Entrada em Armazém para Aplicação de Legislação",
                                "local": "LISBOA"
                            }
                        ]
                    },
                    {
                        "day": "2017-02-01T00:00:00Z",
                        "status": [
                            {
                                "time": "2017-02-01T15:05:00Z",
                                "status": "Receção internacional",
                                "local": "LISBOA"
                            }
                        ]
                    },
                    {
                        "day": "2017-01-19T00:00:00Z",
                        "status": [
                            {
                                "time": "2017-01-19T08:12:00Z",
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

        it('EA358948794PT - must pass', function (done) {
            const id = 'EA358948794PT'
            ctt.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.equal(info.state.status, 'Objeto entregue')
                assert.deepEqual(info.messages, [
                    {
                        "day": "2017-04-24T00:00:00+01:00",
                        "status": [
                            {
                                "time": "2017-04-24T10:42:00+01:00",
                                "status": "Entregue",
                                "local": "2615 - ALVERCA"
                            },
                            {
                                "time": "2017-04-24T08:06:00+01:00",
                                "status": "Em distribuição",
                                "local": "2615 - ALVERCA"
                            },
                            {
                                "time": "2017-04-24T02:15:00+01:00",
                                "status": "Expedição",
                                "local": "C.O. LOURES-MARL (OLX)"
                            },
                            {
                                "time": "2017-04-24T00:35:00+01:00",
                                "status": "Receção",
                                "local": "C.O. LOURES - MARL"
                            }
                        ]
                    },
                    {
                        "day": "2017-04-21T00:00:00+01:00",
                        "status": [
                            {
                                "time": "2017-04-21T23:59:00+01:00",
                                "status": "Expedição",
                                "local": "C.O. LOURES-MARL (OLX)"
                            },
                            {
                                "time": "2017-04-21T21:26:00+01:00",
                                "status": "Receção",
                                "local": "C.O. LOURES - MARL"
                            },
                            {
                                "time": "2017-04-21T21:13:00+01:00",
                                "status": "Expedição",
                                "local": "C.O. COIMBRA (OCO)"
                            },
                            {
                                "time": "2017-04-21T18:59:00+01:00",
                                "status": "Receção",
                                "local": "C. O. COIMBRA"
                            },
                            {
                                "time": "2017-04-21T18:36:00+01:00",
                                "status": "Recolha",
                                "local": "C. O. COIMBRA"
                            },
                            {
                                "time": "2017-04-21T18:36:00+01:00",
                                "status": "Aceitação",
                                "local": "FATURACAO AUTOMATIZADA"
                            }
                        ]
                    }
                ])
                console.log(id + ' attempts: ' + info.retries)
                done()
            })

        });

        it('RE845621341SE - must pass', function (done) {
            const id = 'RE845621341SE'
            ctt.getInfo(id, (err, info) => {
                assert.isNull(err)

                assert.equal(info.id, id)
                assert.equal(info.state.status, 'Sem estado')
                assert.deepEqual(info.messages, [
                    {
                        "day": "2017-05-02T00:00:00+01:00",
                        "status": [
                            {
                                "time": "2017-05-02T14:41:00+01:00",
                                "status": "Entrada em Armazém para Aplicação de Legislação",
                                "local": "LISBOA"
                            }
                        ]
                    },
                    {
                        "day": "2017-04-26T00:00:00+01:00",
                        "status": [
                            {
                                "time": "2017-04-26T19:34:00+01:00",
                                "status": "Para apresentação à Alfândega",
                                "local": "LISBOA"
                            }
                        ]
                    },
                    {
                        "day": "2017-04-25T00:00:00+01:00",
                        "status": [
                            {
                                "time": "2017-04-25T08:15:00+01:00",
                                "status": "Receção internacional",
                                "local": "LISBOA"
                            }
                        ]
                    },
                    {
                        "day": "2017-04-12T00:00:00+01:00",
                        "status": [
                            {
                                "time": "2017-04-12T13:29:00+01:00",
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

        it('should fail to extract', function (done) {
            const id = '423423424'
            ctt.getInfo(id, (err, info) => {
                assert.isNotNull(err)

                done()
            })

        });
    });
});