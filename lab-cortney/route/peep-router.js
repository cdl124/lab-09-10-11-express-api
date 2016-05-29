'use strict';

const Router = require('express').Router;
const peepRouter = module.exports = new Router();
const debug = require('debug')('peep:peep-router');
const jsonParser = require('body-parser').json();
const AppError = require('../lib/app-error');
const storage = require('../lib/storage');
const Peep = require('../model/peep');

// create a peep
function createPeep(reqBody){
  debug('createPeep');
  console.log('Outside promise:', reqBody);
  return new Promise(function(resolve, reject){
    debugger;
    var peep;
    try {
      peep = new Peep(reqBody.name);
      console.log(reqBody.name);
    } catch (err) {
      reject(err);
    }
    storage.setItem('peep', peep).then(function(peep){
      resolve(peep);
    }).catch(function(err){
      reject(err);
    });
  });
} // end of createPeep

peepRouter.post('/', jsonParser, function(req, res){
  debug('hit endpoint /api/peep POST');
  createPeep(req.body).then(function(peep) {
    res.status(200).json(peep);
  }).catch(function(err){
    console.error('ERROR POSTING:', err.message);
    if (AppError.isAppError(err)){
      res.status(err.statusCode).send(err.responseMessage);
      return;
    }
    res.status(500).send('internal server error');
  });
}); // end of post

peepRouter.get('/:id', function(req, res){
  storage.fetchItem('peep', req.params.id).then(function(peep){
    res.status(200).json(peep);
  }).catch(function(err){
    if (AppError.isAppError(err)){
      res.status(err.statusCode).send(err.responseMessage);
    }
    console.error('ERROR GETTING:', err.message);
  });
});

peepRouter.put('/:id', jsonParser, function(req, res){
  storage.fetchItem('peep', req.params.id).then(function(updatedPeep){
    updatedPeep.name = req.body.name;
    res.status(200).json(updatedPeep);
  }).catch(function(err){
    if (AppError.isAppError(err)){
      res.status(err.statusCode).send('error updating your peep');
    }
    console.error('ERROR PUTTING:', err.message);
  });
});

peepRouter.delete('/:id', function(req, res){
  debug('hit endpoint /api/peep DELETE');
  storage.deleteItem('peep', req.params.id).then(function(){
    res.status(200).send('successfully deleted');
  }).catch(function(err){
    console.error('ERROR DELETING:', err.message);
    if (AppError.isAppError(err)){
      res.status(err.statusCode).send(err.responseMessage);
    }
  });
});
