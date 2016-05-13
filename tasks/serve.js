'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    join = require('path').join,
    http = require('http'),
    connect = require('connect'),
    serveStatic = require('serve-static'),
    openResource = require('open'),
    Proxy = require('gulp-connect-proxy'),
    gconnect = require('gulp-connect'),
    util = require('util')
;

var port = 5555;

// --------------
// Serve dev.

var staticPath = join(__dirname, '..', "/");

gulp.task('serve', [/*'build.dev'*/], function() {
  var app;

  watch('./app/**', function() {
    //gulp.start('build.dev');
  });

  app = connect().use( serveStatic(staticPath) );
  
  http.createServer(app).listen(port, function() {
    openResource( util.format('http://localhost:%d/app/autocomplete.html',port));
  });
});

// A local web server for dev convenience
gulp.task("servep", function() {
	gconnect.server({
	  root: staticPath,
	  port: port,
    middleware: function (connect, opt) {
	        opt.route = '/proxy';
	        var proxy = new Proxy.https(opt);
	        return [proxy];
	  }
	});
  openResource( util.format('http://localhost:%d/app/autocomplete.html',port));

});