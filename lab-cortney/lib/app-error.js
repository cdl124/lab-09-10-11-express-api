'use strict';

const debug = require('debug')('peep:app-error');

var AppError = module.exports = function(message, statusCode, responseMessage){
  debug('creating app error');
  Error.call(this);
  this.message = message;
  this.statusCode = statusCode,
  this.responseMessage = responseMessage;
};

AppError.prototype = Object.create(Error.prototype);

AppError.isAppError = function(err){
  debug('isAppError');
  return err instanceof AppError;
};

AppError.error400 = function(message){
  debug('error400');
  return new Error(message, 400, 'bad request');
};

AppError.error404 = function(message){
  debug('error400');
  return new Error(message, 404, 'not found');
};

AppError.error500 = function(message){
  debug('error500');
  return new Error(message, 400, 'server error');
};
