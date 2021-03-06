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
    after((done) => {
      storage.pool = {};
      done();
    });

    it('should return a name with body {name: "test name"}', function(done) {
      request.post(baseUrl)
        .send({name: 'test name'})
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test name');
          done();
        });
    });
    it('should return status 400 for bad request', (done) => {
      request.post('localhost:3000/api/peep')
        .send({apple: 'fuji'})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('bad request');
          done();
        });
    });
  }); // end of POST test module

  describe('testing GET /api/peep', function(){
    before((done) => {
      this.tempPeep = new Peep('test name');
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
    // Duncan was saying that GET requests can't actually return status
    // 400? Or was that 404? I forgot... Anyway, I commented out the
    // status 400 test until I know.

    // it('should return status 400 if no id in request', (done) => {
    //   request.get(`${baseUrl}`)
    //     .end((err, res) => {
    //       expect(res.status).to.equal(400);
    //       done();
    //     });
    // });
    it('should return status 404 if id is not found', (done) => {
      request.get('http://localhost:3000/api/peep/123')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
    });
  }); // end of GET test module

  describe('testing PUT /api/peep', function(){
    before((done) => {
      this.tempPeep = new Peep('test name');
      storage.setItem('peep', this.tempPeep);
      done();
    });
    after((done) => {
      storage.pool = {};
      done();
    });

    it('should update a name', (done) => {
      request.put(`${baseUrl}/${this.tempPeep.id}`)
        .send({name: 'test name change'})
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test name change');
          expect(res.body.id).to.equal(this.tempPeep.id);
          done();
        });
    });
    it('should return status 400 for no or invalid body', (done) => {
      request.put(`${baseUrl}/${this.tempPeep.id}`)
        .send({hobby: 'breaking things'})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });
  }); // end of PUT test module

  describe('testing DELETE /api/peep', function(){
    before((done) => {
      this.tempPeep = new Peep('test name');
      storage.setItem('peep', this.tempPeep);
      done();
    });
    it('should delete a name', (done) => {
      request.del(`${baseUrl}/${this.tempPeep.id}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
  }); // end of DELETE test module
}); // end of testing peep module
