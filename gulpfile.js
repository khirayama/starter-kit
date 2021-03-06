'use strict';
var gulp = require('gulp');
var browserSync = require('browser-sync');
var plumber = require('gulp-plumber');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var please = require('gulp-pleeease');
var browserify = require('gulp-browserify');
var notify = require('gulp-notify');
var rimraf = require('rimraf');

var options = {
  plumber: {
    errorHandler: notify.onError({
      message: 'Error: <%= error.message %>',
      sound: false,
      wait: true
    })
  }
};

var src = 'src/';
var dest = 'dist/';
var release = 'prod/';
var test = 'test/';

gulp.task('markups:develop', function() {
  return gulp.src(src + '**/*.jade')
    .pipe(plumber(options.plumber))
    .pipe(jade())
    .pipe(gulp.dest(dest))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('markups:build', function() {
  return gulp.src(src + '**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest(release));
});

gulp.task('styles:develop', function() {
  return gulp.src(src + 'styles/app.scss')
    .pipe(plumber(options.plumber))
    .pipe(sass({
      errLogToConsole: true,
      sourceComments: 'normal'
    }))
    .pipe(please({
      'minifier': false,
      'autoprefixer': {'browsers': ['last 4 version', 'ie 8', 'iOS 4', 'Android 2.3']}
    }))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('styles:build', function() {
  return gulp.src(src + 'styles/app.scss')
    .pipe(sass({
      errLogToConsole: true,
      sourceComments: 'normal'
    }))
    .pipe(please({
      'minifier': true,
      'autoprefixer': {'browsers': ['last 4 version', 'ie 8', 'iOS 4', 'Android 2.3']}
    }))
    .pipe(gulp.dest(release));
});

gulp.task('scripts:develop', function() {
  return gulp.src([src + 'scripts/app.js'])
    .pipe(plumber(options.plumber))
    .pipe(browserify({
      outfile: 'bundle.js',
      transform: ['babelify'],
      debug: true,
      extensions: ['.jsx', '.js']
    }))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts:build', function() {
  return gulp.src([src + 'scripts/app.js'])
    .pipe(browserify({
      outfile: 'bundle.js',
      transform: ['babelify'],
      debug: false,
      extensions: ['.jsx', '.js']
    }))
    .pipe(gulp.dest(release));
});

gulp.task('images:develop', function() {
  return gulp.src([src + '**/*.+(png|jpg|gif)'])
    .pipe(plumber(options.plumber))
    .pipe(gulp.dest(dest));
});

gulp.task('images:build', function() {
  return gulp.src([src + '**/*.+(png|jpg|gif)'])
    .pipe(gulp.dest(release));
});

gulp.task('files:develop', function() {
  return gulp.src([src + '**/*.+(csv|json)'])
    .pipe(gulp.dest('public/'));
});

gulp.task('files:build', function() {
  return gulp.src([src + '**/*.+(csv|json)'])
    .pipe(gulp.dest('public/'));
});

gulp.task('test', function() {
  return gulp.src([test + '**/*.test.js'])
    .pipe(mocha({
	    compilers: 'js:babel/register'
    }));
});

gulp.task('server', function() {
  return browserSync.init(null, {
    server: {baseDir: dest},
    notify: false,
    open: 'external'
  });
});

gulp.task('watch', function() {
  gulp.watch([src + '**/*.jade'], ['markups:develop']);
  gulp.watch([src + '**/*.scss'], ['styles:develop']);
  gulp.watch([src + '**/*.js', src + '**/*.jsx'], ['scripts:develop']);
  gulp.watch([src + '**/*.+(png|jpg|gif)'], ['images:develop']);
  gulp.watch([src + '**/*.+(csv|json)'], ['files:develop']);
});

gulp.task('clean', function (cb) {
  rimraf('./prod', cb);
});

gulp.task('develop', ['markups:develop', 'styles:develop', 'scripts:develop', 'images:develop', 'files:develop', 'watch', 'server']);
gulp.task('build', ['clean', 'markups:build', 'styles:build', 'scripts:build', 'images:build', 'files:build']);
