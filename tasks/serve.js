'use strict';

var PATH = require('./PATH'),
    gulp = require('gulp'),
    watch = require('gulp-watch'),
    join = require('path').join,
    //yargs = require('yargs'),
    http = require('http'),
    connect = require('connect'),
    serveStatic = require('serve-static'),
    openResource = require('open')
;

var port = 5555;

// --------------
// Serve dev.

gulp.task('serve', [/*'build.dev'*/], function() {
  var app;

  watch('./app/**', function() {
    //gulp.start('build.dev');
  });

  app = connect().use(serveStatic(join(__dirname, '..', PATH.dest.all)));
  http.createServer(app).listen(port, function() {
    openResource('http://localhost:' + port);
  });
});

