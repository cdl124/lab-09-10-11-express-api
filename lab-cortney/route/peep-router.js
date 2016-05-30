'use strict';

const Router = require('express').Router;
const peepRouter = module.exports = new Router();
const debug = require('debug')('peep:peep-router');
const jsonParser = require('body-parser').json();
const AppError = require('../lib/app-error');
const storage = require('../lib/storage');
const Peep = require('../model/peep');

peepRouter.post('/', jsonParser, function(req, res){
  // debug('hit endpoint /api/peep POST');
  try {
    var newPeep = new Peep(req.body.name);
    storage.setItem('peep' , newPeep).then( (peep) => {
      res.status(200).send(peep);
    });
  } catch (err) {
    if (AppError.isAppError(err)) {
      console.log(err.message);
      res.status(err.statusCode).send(err.responseMessage);
    } else {
      res.status(400).send('bad request');
    }
  }
}); // end of post

peepRouter.get('/:id', function(req, res){
  storage.fetchItem('peep', req.params.id).then(function(peep){
    res.status(200).json(peep);
  }).catch(function(err){
    if (AppError.isAppError(err)){
      res.status(err.statusCode).send(err.responseMessage);
    }
    res.status(400).send('bad request');
    console.error('ERROR GETTING:', err.message);
  });
});

peepRouter.put('/:id', jsonParser, function(req, res){
  storage.fetchItem('peep', req.params.id).then(function(updatedPeep){
    if (!req.body.name){
      res.status(400).send('put in a name!');
    }
    updatedPeep.name = req.body.name;
    res.status(200).json(updatedPeep);
  }).catch(function(err){
    if (AppError.isAppError(err)){
      res.status(err.statusCode).send('error updating your peep');
    }
    res.status(400).send('bad request');
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
