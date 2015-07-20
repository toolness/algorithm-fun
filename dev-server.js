var http = require('http');
var path = require('path');
var express = require('express');

var ROOT_DIR = __dirname;

exports.create = function create() {
  var app = express();
  var server = http.createServer(app);

  app.use(express.static(ROOT_DIR));

  return server;
};

if (!module.parent) {
  exports.create().listen(8080, function() {
    console.log("Development server listening on port 8080.");
  });
}
