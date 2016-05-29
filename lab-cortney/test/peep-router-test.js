'use strict';

const server = require('../server');
const Peep = require('../model/peep');
const storage = require('../lib/storage');

const expect = require('chai').expect;
const request = require('superagent');

const port = process.env.PORT || 3000;
const baseUrl = `localhost:${port}/api/peep`;

describe('testing module peep-router', function(){
  before((done) => {
    if (!server.isRunning){
      server.listen(port, () => {
        server.isRunning = true;
        console.log('server running on port', port);
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    if (server.isRunning){
      server.close(() => {
        console.log('server is shut down');
        done();
      });
      return;
    }
    done();
  });

  describe('testing POST /api/peep', function(){
    describe('with body {name: "test name"}', function(){
      after((done) => {
        storage.pool = {};
        done();
      });

      it('should return a name', function(done){
        request.post(baseUrl)
          .send({name: 'test name'})
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.name).to.equal('test name');
            expect(!res.body.id);
            done();
          });
      });
    });

    describe('with no body', function(done){
      request.post(baseUrl)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.test).to.equal('bad request');
          done();
        });
    });
  }); // end of POST test module

  describe('testing GET /api/peep', function(){
    before((done) => {
      this.tempPeep = new Peep('test data');
      storage.setItem('peep', this.tempPeep);
      done();
    });
    after((done) => {
      storage.pool = {};
      done();
    });

    it('should return a name', (done) => {
      request.get(`${baseUrl}/${this.tempPeep.id}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(this.tempPeep.name);
          expect(res.body.id).to.equal(this.tempPeep.id);
          done();
        });
    });
  }); // end of GET test module

  describe('testing PUT /api/peep', function(){
    before((done) => {
      this.tempPeep = new Peep('test data');
      storage.setItem('peep', this.tempPeep);
      done();
    });
    after((done) => {
      storage.pool = {};
      done();
    });

    it('should update a name', (done) => {
      request.get(`${baseUrl}/${this.tempPeep.id}`)
        .send({name: 'test name changed'})
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test name changed');
          expect(res.body.id).to.equal(this.tempPeep.id);
          done();
        });
    });
  }); // end of PUT test module

  // describe('testing DELETE /api/peep', function(){
  //   // delete it!
  // });
  // end of DELETE test module
}); // end of testing peep module
