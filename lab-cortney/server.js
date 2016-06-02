'use strict';

const debug = require('debug')('peep:server');
const express = require('express');
const morgan = require('morgan');
const peepRouter = require('./route/peep-router');
const errorResponse = require('./lib/error-response');
const port = process.env.PORT || 3000;

const app = express();

// enable middleware
app.use(morgan('dev'));
app.use(errorResponse);

// then define routes
app.use('/api/peep', peepRouter);

app.all('*', function(req, res){
  debug('hit 404 route');
  res.status(404).send();
});

const server = app.listen(port, function(){
  console.log('server started on port:', port);
});

server.isRunning = true;
module.exports = server;
