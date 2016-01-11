var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var webpack = require('gulp-webpack');

gulp.task('default', ['webpack', 'autoprefixer', 'move-images'], function () {
    gulp.watch('./js/*.js', ['webpack']);
    gulp.watch('./css/*.css', ['autoprefixer']);
    gulp.watch(['./css/*.png', './css/*.jpg', './css/*.jpeg'], ['move-images']);
});
/**
 * webpack
 */
gulp.task('webpack', function () {
    return gulp.src('./js/app.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('./build/js'))
});
/**
 * auto-prefixer
 */
gulp.task('autoprefixer', function () {
    return gulp.src('./css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./build/css'))
});

/**
 * move images to build folder
 */

gulp.task('move-images', function () {
    return gulp.src(['./css/*.png', './css/*.jpg', './css/*.jpeg'])
        .pipe(gulp.dest('./build/css'))
});