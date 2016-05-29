'use strict';

const debug = require('debug')('peep:peep');
const AppError = require('../lib/app-error');
const uuid = require('node-uuid');

module.exports = function(name){
  debug('creating peep');
  if (!name) throw AppError.error400('peep constructor requires a name');
  this.id = uuid.v4();
  this.name = name;
  this.creationDate = new Date();
};
