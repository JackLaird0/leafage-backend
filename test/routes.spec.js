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
          resp.should.have.status(200);
          resp.should.be.json;
          resp.body.should.be.a('array');
          resp.body.length.should.equal(5);
          resp.body[0].should.have.property('id');
          resp.body[0].id.should.equal(1);
          resp.body[0].should.have.property('name');
          resp.body[0].name.should.equal('5');
          resp.body[0].should.have.property('lowTemp');
          resp.body[0].lowTemp.should.equal('-20');
          resp.body[0].should.have.property('highTemp');
          resp.body[0].highTemp.should.equal('-10');
          done();
        })
    })
  });
});