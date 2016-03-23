'use strict';

var gulp = require('gulp');

var requireDir = require('require-dir');

var cfg = requireDir('./tasks');

gulp.task('default', ['serve']);
