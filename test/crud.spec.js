process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');

let injector = require('route-injector');
let server = undefined;

let should = chai.should();

chai.use(chaiHttp);

describe('API CRUD', () => {

    before((done) => {
        injector.start(() => {
            server = injector.app;
            done();
        })
    });

    describe('Protection System CRUD', () => {
        let protectionSystemId = undefined;
        describe('POST /protectionSystem', () => {
            it('it should reject on POST an empty protection system', (done) => {
                chai.request(server)
                    .post('/protectionSystem')
                    .send({})
                    .end((err, res) => {
                        res.should.have.status(403);
                        res.body.should.be.a('object');
                        res.body.should.have.property('errors');
                        done();
                    });
            });

            it('it should POST a protection system', (done) => {
                let protectionSystem = {
                    description: 'AES-CBC',
                    algorithm: 'aes-256-cbc'
                };
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

    });

});