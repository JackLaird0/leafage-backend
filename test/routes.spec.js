const environment = process.env.NODE_ENV = 'test';
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const configuration = require('../knexfile')[environment];
const knex = require('knex')(configuration);

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
    it('should return an array of one zone object', done => {
      chai.request(server)
        .get('/api/v1/zones/2')
        .end((err, resp) => {
          const zoneIndex = resp.body.findIndex(zone => zone.name === '2');
          resp.should.have.status(200);
          resp.should.be.json;
          resp.body.should.be.a('array');
          resp.body.length.should.equal(1);
          resp.body[zoneIndex].should.have.property('id');
          resp.body[zoneIndex].id.should.equal(2);
          resp.body[zoneIndex].should.have.property('name');
          resp.body[zoneIndex].name.should.equal('2');
          resp.body[zoneIndex].should.have.property('lowTemp');
          resp.body[zoneIndex].lowTemp.should.equal('-50');
          resp.body[zoneIndex].should.have.property('highTemp');
          resp.body[zoneIndex].highTemp.should.equal('-40');
          done();
        });
    });
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
});