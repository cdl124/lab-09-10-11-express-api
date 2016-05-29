'use strict';

const debug = require('debug')('peep:server');
const express = require('express');
const peepRouter = require('./route/peep-router');
const port = process.env.PORT || 3000;

const app = express();

app.use('/api/peep', peepRouter);

app.all('*', function(req, res){
  debug('hit 404 route');
  res.status(404).send('not found');
});

const server = app.listen(port, function(){
  console.log('server started on port:', port);
});

server.isRunning = true;
module.exports = server;
