var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');
var tar = require('gulp-tar');
var replace = require('gulp-replace');
var zip = require('gulp-zip');

gulp.task('concat', function() {
  return gulp.src(['src/classes.js', 'src/statics.js', 'src/ui.js', 'src/index.js'])
    .pipe(replace('global.', ''))
    .pipe(concat('game.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./'));
});

gulp.task('gzip', function() {
    gulp.src(['index.html', 'game.min.js'])
    .pipe(gzip())
    .pipe(gulp.dest('./dist.gz'));
});

gulp.task('tar', function() {
  return gulp.src(['index.html', 'game.min.js'])
    .pipe(tar('dist.tar'))
    .pipe(gzip())
    .pipe(gulp.dest('./'));
});

gulp.task('zip', function() {
  return gulp.src(['index.html', 'game.min.js'])
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('./'));
});

gulp.task('compress', ['concat', 'zip']);
