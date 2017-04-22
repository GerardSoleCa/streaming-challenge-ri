process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');

let injector = require('route-injector');
let server = undefined;

let should = chai.should();

let ProtectionSystemData = require('./data/protectionSystem.data');
let DeviceData = require('./data/device.data');
let ContentData = require('./data/content.data');

chai.use(chaiHttp);

describe('API', () => {
    let protectionSystemId = undefined;
    let deviceId = undefined;
    let contentId = undefined;

    before((done) => {
        injector.start(() => {
            server = injector.app;
            done();
        })
    });

    describe('Create, Read, Update', () => {

        describe('Protection System', () => {

            describe('POST /protectionSystem', () => {
                it('should reject on POST an empty protection system', (done) => {
                    let protectionSystem = ProtectionSystemData.getEmpty();
                    chai.request(server)
                        .post('/protectionSystem')
                        .send(protectionSystem)
                        .end((err, res) => {
                            res.should.have.status(403);
                            res.body.should.be.a('object');
                            res.body.should.have.property('errors');
                            done();
                        });
                });

                it('should reject on POST a protection system with an invalid algorithm', (done) => {
                   let protectionSystem = ProtectionSystemData.getWithInvalidAlgorithm();
                    chai.request(server)
                        .post('/protectionSystem')
                        .send(protectionSystem)
                        .end((err, res) => {
                            res.should.have.status(400);
                            res.body.should.be.a('object');
                            res.body.should.have.property('errors').eql('algorithm is not valid');
                            done();
                        });
                });

                it('should POST a protection system', (done) => {
                    let protectionSystem = ProtectionSystemData.getProtectionSystemData();
                    chai.request(server)
                        .post('/protectionSystem')
                        .send(protectionSystem)
                        .end((err, res) => {
                            res.should.have.status(201);
                            res.body.should.be.a('object');
                            res.body.should.have.property('_id');
                            protectionSystemId = res.body._id;
                            done();
                        });
                });
            });

            describe('GET /protectionSystem/:id', () => {
                it('should gave a 404 on get an empty id', (done) => {
                    chai.request(server)
                        .get('/protectionSystem/')
                        .end((err, res) => {
                            res.should.have.status(404);
                            done();
                        });
                });

                it('should gave a 404 on get an invalid id', (done) => {
                    chai.request(server)
                        .get('/protectionSystem/invalid_id')
                        .end((err, res) => {
                            res.should.have.status(404);
                            done();
                        });
                });

                it('should obtain the correct protection system', (done) => {
                    chai.request(server)
                        .get('/protectionSystem/' + protectionSystemId)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('_id').eql(protectionSystemId);
                            done();
                        });
                });
            });

            describe('PUT /protectionSystem/:id', () => {
                it('should update protection system', (done) => {
                    chai.request(server)
                        .put('/protectionSystem/' + protectionSystemId)
                        .send({
                            description: 'AES-256-CBC'
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('_id').eql(protectionSystemId);
                            done();
                        });
                });

                it('should description property have been updated', (done) => {
                    chai.request(server)
                        .get('/protectionSystem/' + protectionSystemId)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('description').eql('AES-256-CBC');
                            done();
                        });
                });
            });
        });

        describe('Device', () => {

            describe('POST /device', () => {
                it('should reject on POST an empty device', (done) => {
                    let device = DeviceData.getEmpty();
                    chai.request(server)
                        .post('/device')
                        .send(device)
                        .end((err, res) => {
                            res.should.have.status(403);
                            res.body.should.be.a('object');
                            res.body.should.have.property('errors');
                            done();
                        });
                });

                it('should POST a device', (done) => {
                    let protectionSystem = DeviceData.getDeviceData(protectionSystemId);
                    chai.request(server)
                        .post('/device')
                        .send(protectionSystem)
                        .end((err, res) => {
                            res.should.have.status(201);
                            res.body.should.be.a('object');
                            res.body.should.have.property('_id');
                            deviceId = res.body._id;
                            done();
                        });
                });
            });

            describe('GET /device/:id', () => {
                it('should gave a 404 on get an empty id', (done) => {
                    chai.request(server)
                        .get('/device/')
                        .end((err, res) => {
                            res.should.have.status(404);
                            done();
                        });
                });

                it('should gave a 404 on get an invalid id', (done) => {
                    chai.request(server)
                        .get('/device/invalid_id')
                        .end((err, res) => {
                            res.should.have.status(404);
                            done();
                        });
                });

                it('should obtain the correct device', (done) => {
                    chai.request(server)
                        .get('/device/' + deviceId)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('_id').eql(deviceId);
                            done();
                        });
                });
            });

            describe('PUT /device/:id', () => {
                it('should update device', (done) => {
                    chai.request(server)
                        .put('/device/' + deviceId)
                        .send({
                            name: 'iPhone-5S'
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('_id').eql(deviceId);
                            done();
                        });
                });

                it('should description property have been updated', (done) => {
                    chai.request(server)
                        .get('/device/' + deviceId)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('name').eql('iPhone-5S');
                            done();
                        });
                });
            });
        });

        describe('Content', () => {

            describe('POST /content', () => {
                it('should reject on POST an empty content', (done) => {
                    let content = ContentData.getEmpty();
                    chai.request(server)
                        .post('/content')
                        .send(content)
                        .end((err, res) => {
                            res.should.have.status(403);
                            res.body.should.be.a('object');
                            res.body.should.have.property('errors');
                            done();
                        });
                });

                it('should POST a content', (done) => {
                    let content = ContentData.getContentData(protectionSystemId);
                    chai.request(server)
                        .post('/content')
                        .send(content)
                        .end((err, res) => {
                            res.should.have.status(201);
                            res.body.should.be.a('object');
                            res.body.should.have.property('_id');
                            contentId = res.body._id;
                            done();
                        });
                });

                it('should fail on POST a content with invalid protection system', (done) => {
                    let content = ContentData.getContentData('58f0e0b23371d846b11e0bef');
                    chai.request(server)
                        .post('/content')
                        .send(content)
                        .end((err, res) => {
                            res.should.have.status(400);
                            res.body.should.be.a('object');
                            res.body.should.have.property('errors');
                            done();
                        });
                });

                it('should handle mongo error on Content Hook', (done) => {
                    let findById = injector.models.ProtectionSystem.findById;
                    injector.models.ProtectionSystem.findById = function (a, b, cb) {
                        cb(new Error('fail'));
                    };
                    let content = ContentData.getContentData(protectionSystemId);
                    chai.request(server)
                        .post('/content')
                        .send(content)
                        .end((err, res) => {
                            res.should.have.status(500);
                            injector.models.ProtectionSystem.findById = findById;
                            done();
                        });
                });
            });

            describe('GET /content/:id', () => {
                it('should gave a 404 on get an empty id', (done) => {
                    chai.request(server)
                        .get('/content/')
                        .end((err, res) => {
                            res.should.have.status(404);
                            done();
                        });
                });

                it('should gave a 404 on get an invalid id', (done) => {
                    chai.request(server)
                        .get('/content/invalid_id')
                        .end((err, res) => {
                            res.should.have.status(404);
                            done();
                        });
                });

                it('should obtain the correct content', (done) => {
                    chai.request(server)
                        .get('/content/' + contentId)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('_id').eql(contentId);
                            done();
                        });
                });
            });

            describe('PUT /content/:id', () => {
                it('should update content', (done) => {
                    chai.request(server)
                        .put('/content/' + contentId)
                        .send({
                            name: 'The quick brown fox'
                        })
                        .end((err, res) => {
                            console.log(res.body);
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('_id').eql(contentId);
                            done();
                        });
                });

                it('should description property have been updated', (done) => {
                    chai.request(server)
                        .get('/content/' + contentId)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('name').eql('The quick brown fox');
                            done();
                        });
                });
            });
        });
    });

    describe('Streaming API', () => {

        it('should give error for invalid device', (done) => {
            chai.request(server)
                .get(`/streaming/device/invalid_id/content/${contentId}`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });

        it('should give error for invalid content', (done) => {
            chai.request(server)
                .get(`/streaming/device/${deviceId}/content/invalid_id`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });

        it('should give error for non-existing device', (done) => {
            chai.request(server)
                .get(`/streaming/device/000000000000/content/${contentId}`)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });

        it('should get decrypted content', (done) => {
            chai.request(server)
                .get(`/streaming/device/${deviceId}/content/${contentId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('payload').eql(ContentData.getDecryptedPayload());
                    done();
                });
        });

        it('should fail on non-matching protection system', (done) => {
            let protectionSystem = ProtectionSystemData.getSecondProtectionSystemData();
            chai.request(server)
                .post('/protectionSystem')
                .send(protectionSystem)
                .end((err, res) => {
                    let deviceData = DeviceData.getSecondDeviceData(res.body._id);
                    chai.request(server)
                        .post('/device')
                        .send(deviceData)
                        .end((err, res) => {
                            chai.request(server)
                                .get(`/streaming/device/${res.body._id}/content/${contentId}`)
                                .end((err, res) => {
                                    res.should.have.status(400);
                                    res.body.should.be.a('object');
                                    res.body.should.have.property('error');
                                    done();
                                });
                        });
                });
        });
    });

    describe('Delete', () => {
        describe('Content', () => {
            it('should delete content', (done) => {
                chai.request(server)
                    .delete('/content/' + contentId)
                    .end((err, res) => {
                        res.should.have.status(204);
                        done();
                    });
            });

            it('device should be deleted', (done) => {
                chai.request(server)
                    .get('/content/' + contentId)
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });
            });
        });

        describe('Device', () => {
            it('should delete device', (done) => {
                chai.request(server)
                    .delete('/device/' + deviceId)
                    .end((err, res) => {
                        res.should.have.status(204);
                        done();
                    });
            });

            it('device should be deleted', (done) => {
                chai.request(server)
                    .get('/device/' + deviceId)
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });
            });
        });

        describe('Protection System', () => {
            it('should delete device', (done) => {
                chai.request(server)
                    .delete('/protectionSystem/' + protectionSystemId)
                    .end((err, res) => {
                        res.should.have.status(204);
                        done();
                    });
            });

            it('Protection System should be deleted', (done) => {
                chai.request(server)
                    .get('/protectionSystem/' + protectionSystemId)
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });
            });
        });
    });

    after(() => {
        injector.mongoose.connection.db.dropDatabase();
    })
});
