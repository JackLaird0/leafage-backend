const environment = process.env.NODE_ENV = 'test';
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const configuration = require('../knexfile')[environment];
const knex = require('knex')(configuration);
const jwt = require('jsonwebtoken');
const jswtKey = require('../json-key');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return a 404 status code for and endpoint that doesn\'t exist', done => {
    chai.request(server)
      .get('/plantzones')
      .end((err, resp) => {
        resp.should.have.status(404);
        done();
      });
  });
});

describe('API Routes', () => {
  let webToken;
  let user;
  before( done => {
    user = {user: { email: 'jake.statefarm@gmail.com', username: 'jakefromstatefarm'} };
    webToken = jwt.sign(user, jswtKey);
    done();
  });

  beforeEach( done => {
    knex.migrate.rollback()
      .then(() => {
        knex.migrate.latest()
          .then(() => {
            return knex.seed.run()
              .then(() => {
                done();
              });
          });
      });
  });

  describe('POST /authenication', () => {
    it('should return a token object', done => {
      chai.request(server)
        .post('/authentication')
        .send(user)
        .end((err, resp) => {
          resp.should.have.status(201);
          resp.should.be.json;
          resp.body.should.be.a('object');
          resp.body.should.have.property('token');
          done();
        });
    });

    it('should return an error if there are missing params from the body', done => {
      chai.request(server)
        .post('/authentication')
        .send({ user: {} })
        .end((err, resp) => {
          resp.should.have.status(422)
          resp.body.error.should.equal('Expected format: { user: { email: <String>, username: <String>} }. You\'re missing a email property.' )
          done();
        })
    });
  });

  describe('GET /api/v1/zones', () => {
    it('should return an array of zone objects', done => {
      chai.request(server)
        .get('/api/v1/zones')
        .end((err, resp) => {
          const zoneIndex = resp.body.findIndex(zone => zone.name === '1');
          resp.should.have.status(200);
          resp.should.be.json;
          resp.body.should.be.a('array');
          resp.body.length.should.equal(13);
          resp.body[zoneIndex].should.have.property('id');
          resp.body[zoneIndex].id.should.equal(1);
          resp.body[zoneIndex].should.have.property('name');
          resp.body[zoneIndex].name.should.equal('1');
          resp.body[zoneIndex].should.have.property('lowTemp');
          resp.body[zoneIndex].lowTemp.should.equal('-60');
          resp.body[zoneIndex].should.have.property('highTemp');
          resp.body[zoneIndex].highTemp.should.equal('-50');
          done();
        });
    });
  });

  describe('GET /api/v1/zones/:id', () => {
    it('should return one zone object', done => {
      chai.request(server)
        .get('/api/v1/zones/2')
        .end((err, resp) => {
          resp.should.have.status(200);
          resp.should.be.json;
          resp.body.should.be.a('object');
          resp.body.should.have.property('id');
          resp.body.id.should.equal(2);
          resp.body.should.have.property('name');
          resp.body.should.have.property('lowTemp');
          resp.body.should.have.property('highTemp');
          done();
        });
    });

    it('should return an error if given invalid id', done => {
      chai.request(server)
        .get('/api/v1/zones/212345')
        .end((err, resp) => {
          resp.should.have.status(404);
          resp.should.be.json;
          resp.body.should.be.a('object');
          resp.body.should.have.property('error');
          resp.body.error.should.equal('Unable to find zone with matching id. Use /api/v1/zones/ endpoint to view all zones, or a valid ID at /api/v1/zones/:id to view one.')
          done()
        })
    })
  });

  describe('GET /api/v1/plants/', () => {
    it('should return an array of plant objects', done => {
      chai.request(server)
        .get('/api/v1/plants/')
        .end((err, resp) => {
          const plantIndex = resp.body.findIndex(plant => plant.name === 'Aloe');
          resp.should.have.status(200);
          resp.should.be.json;
          resp.body.should.be.a('array');
          resp.body.length.should.equal(2);
          resp.body[plantIndex].should.have.property('id');
          resp.body[plantIndex].id.should.equal(1);
          resp.body[plantIndex].should.have.property('name');
          resp.body[plantIndex].name.should.equal('Aloe');
          resp.body[plantIndex].should.have.property('scientificName');
          resp.body[plantIndex].scientificName.should.equal('sciAloe');
          resp.body[plantIndex].should.have.property('care');
          resp.body[plantIndex].care.should.equal('dont let it die');
          resp.body[plantIndex].should.have.property('moisture');
          resp.body[plantIndex].moisture.should.equal('not dry');
          resp.body[plantIndex].should.have.property('light');
          resp.body[plantIndex].light.should.equal('bright');
          resp.body[plantIndex].should.have.property('maintenance');
          resp.body[plantIndex].maintenance.should.equal('often');
          resp.body[plantIndex].should.have.property('zone_id');
          resp.body[plantIndex].zone_id.should.equal(1);
          done();
        });
    });
  });

  describe('POST /api/v1/plants/', () => {
    it('should add a plant', done => {
      chai.request(server)
        .post('/api/v1/plants')
        .set('x-token', webToken)
        .send({
          plant: { name: 'cacti', scientificName: 'cactAPi', care: 'dont', 
          moisture: 'almost none', light: 'lots', maintenance: 'none', zone_id: 1 }
        })
        .end((err, resp) => {
          resp.should.have.status(201);
          resp.body.should.be.a('object');
          resp.body.should.have.property('id');
          resp.body.id.should.equal(3);
          done();
        });
    });

    it('should return an error if the body is incorrect', done => {
      chai.request(server)
        .post('/api/v1/plants')
        .set('x-token', webToken)
        .send({
          plant: {}
        })
        .end((err, resp) => {
          resp.should.have.status(422);
          resp.body.error.should.equal('Expected format: { plant: { name: <String>, scientificName: <String>, care: <String>, moisture: <String>, light: <String>, maintenance: <String>, zone_id: <Number>}}. You\'re missing a "name" property.');
          done();
        });
    });
  });

  describe('GET /api/v1/plants/:id', () => {
    it('should return one plant object', done => {
      chai.request(server)
        .get('/api/v1/plants/2')
        .end((err, resp) => {
          resp.should.have.status(200);
          resp.should.be.json;
          resp.body.should.be.a('object');
          resp.body.should.have.property('id');
          resp.body.id.should.equal(2);
          resp.body.should.have.property('name');
          resp.body.name.should.equal('Cactus');
          resp.body.should.have.property('scientificName');
          resp.body.scientificName.should.equal('sciCactus');
          resp.body.should.have.property('care');
          resp.body.care.should.equal('dont put in closet');
          resp.body.should.have.property('moisture');
          resp.body.moisture.should.equal('dry');
          resp.body.should.have.property('light');
          resp.body.light.should.equal('DARK');
          resp.body.should.have.property('maintenance');
          resp.body.maintenance.should.equal('never');
          resp.body.should.have.property('zone_id');
          resp.body.zone_id.should.equal(1);
          done();
        });
    });
  
    it('should return an error if given invalid id', done => {
      chai.request(server)
        .get('/api/v1/plants/212345')
        .end((err, resp) => {
          resp.should.have.status(404);
          resp.should.be.json;
          resp.body.should.be.a('object');
          resp.body.should.have.property('error');
          resp.body.error.should.equal('Unable to find plant with matching id. Use /api/v1/plants/ endpoint to view all plants, or a valid ID at /api/v1/plants/:id to view one.')
          done()
        })
    })
  });
});
