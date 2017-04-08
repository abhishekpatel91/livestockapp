/*Required Modeules*/
var gulp = require('gulp'),
	compass = require('gulp-compass'),
	plumber = require('gulp-plumber'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
    connect = require('gulp-connect-multi') (),
    browserify = require('browserify'),
    babelify = require('babelify'),
    buffer = require('vinyl-buffer'),
    sourceStream = require('vinyl-source-stream');

/*Gulp task to create server*/
gulp.task('connect', connect.server({
    root: ['source'],
    port: 8005,
    livereload: true,
    open: {}
}));

/*Gulp task for sass*/
gulp.task('compass', function() {
	gulp.src('source/sass/**/*.scss')
	.pipe(plumber())
	.pipe(compass({
		css: 'source/css',
		sass: 'source/sass'
	}))
	.pipe(connect.reload())
});

/*Gulp HTMl task*/
gulp.task('html', function() {
	gulp.src(['source/*.html', 'source/**/*.html'])
	.pipe(plumber())
	.pipe(connect.reload())
});

/*Gulp scripts task*/
gulp.task('scripts', function() {
	browserify('source/js/main.js')	
	.transform('babelify', {
		presets: ['es2015'],
		plugins: ["transform-react-jsx"]
	})
	.bundle()
	.on('error', function(err) {
		console.log(err.stack);
	})
	.pipe(sourceStream('compiled.js'))
	.pipe(buffer())
	.pipe(rename({suffix: '.min'}))
	.pipe(uglify())
	.pipe(gulp.dest('source/dist'))
	.pipe(connect.reload());
});

/* minify uglify vendor.js*/
gulp.task('vendor', function() {
	gulp.src(['source/bower_components/react/react.min.js', 'source/bower_components/react/react-dom.min.js', 'source/bower_components/jquery/dist/jquery.min.js', 'source/bower_components/jquery-sparkline/dist/jquery.sparkline.min.js'])
	.pipe(plumber())
	.pipe(concat('vendor.js'))
	.pipe(gulp.dest('source/dist/vendor'));
})

/*Gulp task to watch html/scss/js*/
gulp.task('watch', function() {
	gulp.watch(['source/js/**/*.js', '!source/dist/*.js'], ['scripts']);
	gulp.watch('source/sass/**/*.scss', ['compass']);
	gulp.watch(['source/*.html', 'source/**/*.html'], ['html']);
});

/*Gulp default task*/
gulp.task('default', ['connect', 'compass', 'vendor', 'scripts', 'watch']);
