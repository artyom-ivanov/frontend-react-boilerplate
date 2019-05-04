'use strict';

const gulp = require('gulp'),
	browserSync = require('browser-sync').create(),
	reload = browserSync.reload,
	autoprefixer = require('gulp-autoprefixer'),
	babel = require('gulp-babel'),
	clean = require('gulp-clean'),
	concatCss = require('gulp-concat-css'),
	concatJs = require('gulp-concat'),
	minCss = require('gulp-clean-css'),
	notify = require('gulp-notify'),
	plumber = require('gulp-plumber'),
	pug = require('gulp-pug'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	imgmin = require('gulp-imagemin'),
	mozjpeg = require('imagemin-mozjpeg'),
	pngquant = require('imagemin-pngquant'),
	svgo = require('imagemin-svgo');

// Html
gulp.task('html', () => (
	gulp.src('src/pug/*.pug')
		.pipe(plumber({
			errorHandler: notify.onError('👻 <%= error.message %>')
		}))
		.pipe(pug({ pretty: true }))
		.pipe(gulp.dest('dist/'))
		.pipe(reload({ stream: true }))
));

// Css
gulp.task('css', () => (
	gulp.src('src/scss/main.scss')
		.pipe(plumber({
			errorHandler: notify.onError('👻 <%= error.message %>')
		}))
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 6 versions']
		}))
		.pipe(minCss())
		.pipe(rename('style.min.css'))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('dist/static/css/'))
		.pipe(reload({ stream: true }))
));

// Js
gulp.task('js', () => (
	gulp.src(['src/js/*.js', '!src/js/index.js', '!src/js/router.js'])
		.pipe(plumber({
			errorHandler: notify.onError('👻 <%= error.message %>')
		}))
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(gulp.dest('dist/static/js'))
		.pipe(reload({ stream: true }))
));

// Watch for react changes
gulp.task('react-watch', () => (
	gulp.src('src/react/**/*.*')
		.pipe(reload({ stream: true }))
));

// Fonts
gulp.task('fonts', () => (
	gulp.src('src/fonts/**/*.*')
		.pipe(gulp.dest('dist/static/fonts'))
));

// Images
gulp.task('images', () => (
	gulp.src('src/img/**/*.*')
		.pipe(plumber({
			errorHandler: notify.onError('👻 <%= error.message %>')
		}))
		.pipe(gulp.dest('dist/static/img'))
		.pipe(reload({ stream: true }))
));

// Min images 
gulp.task('min-images', () => (
	gulp.src(['src/img/**/*.*', '!src/img/**/icons.svg'])
		.pipe(plumber({
			errorHandler: notify.onError('👻 <%= error.message %>')
		}))
		.pipe(imgmin([
			pngquant(),
			mozjpeg(),
			svgo({ removeViewBox: false })
		], {
			verbose: true
		}))
		.pipe(gulp.dest('dist/static/img'))
		.pipe(reload({ stream: true }))
));

// Svg sprite to dist
gulp.task('svg-sprite', () => (
	gulp.src('src/img/**/icons.svg')
		.pipe(gulp.dest('dist/static/img'))
		.pipe(reload({ stream: true }))
));

// Assets
gulp.task('assets', ['assets-css', 'assets-js', 'assets-js-exc']);

// Assets css
gulp.task('assets-css', () => (
	gulp.src('src/assets/**/*.css')
		.pipe(concatCss('assets.css'))
		.pipe(minCss())
		.pipe(gulp.dest('./dist/static/assets'))
		.pipe(reload({ stream: true }))
));

// Assets js
gulp.task('assets-js', () => (
	gulp.src(['src/assets/**/*.js', '!src/assets/svgxuse.min.js'])
		.pipe(concatJs('assets.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/static/assets'))
		.pipe(reload({ stream: true }))
));

// Assets js exc
gulp.task('assets-js-exc', () => (
	gulp.src('src/assets/svgxuse.min.js')
		.pipe(gulp.dest('dist/static/assets'))
		.pipe(reload({ stream: true }))
));

// Dev build
gulp.task('dev-build', ['html', 'css', 'js', 'fonts', 'images', 'assets']);

// Build 
gulp.task('build', ['html', 'css', 'js', 'fonts', 'min-images', 'svg-sprite', 'assets']);

// Clean
gulp.task('clean', () => (
	gulp.src('dist/', { read: false })
		.pipe(clean())
));

// Connect
gulp.task('browser-sync', () => {
	browserSync.init({
		server: {
			baseDir: './dist'
		},
		port: 3000,
		notify: false
	})
});

// Watch
gulp.task('watch', () => {
	// html
	gulp.watch('src/pug/**/*.pug', ['html']);

	// sass
	gulp.watch('src/scss/**/*.scss', ['css']);

	// js
	gulp.watch('src/js/*.js', ['js']);

	// React changes
	gulp.watch('src/react/**/*.*', ['react-watch']);

	// img
	gulp.watch('src/img/**/*.*', ['images']);
});

// Default
gulp.task('default', ['browser-sync', 'watch']);
