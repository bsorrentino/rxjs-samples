

'use strict';

var PATH = require('./PATH'),
    gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    tsc = require('gulp-typescript'),
    Builder = require('systemjs-builder');

;

var appProdBuilder = new Builder({
  baseURL: 'file:./tmp',
});

var tsProject = tsc.createProject('tsconfig.json', {
  typescript: require('typescript')
});


gulp.task('build.lib.dev', function() {
  return gulp.src(PATH.src.lib.js.concat(PATH.src.lib.css))
    .pipe(gulp.dest(PATH.dest.dev.lib));
});

gulp.task('build.html.dev', [], function() {
  var result = gulp.src(PATH.src.html.all)

    return result
      .pipe(gulp.dest(PATH.dest.dev.all));
  });

gulp.task('build.dev', ['build.html.dev', 'build.lib.dev'], function() {
  var result = gulp.src(PATH.src.app.dev)
    //.pipe(plumber())
    .pipe(tsc(tsProject));

    return result.js
      .pipe(gulp.dest(PATH.dest.dev.all));
  });
