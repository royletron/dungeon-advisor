var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');

gulp.task('compress', function() {
  return gulp.src('./src/*.js')
    .pipe(concat('game.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./'));
});
