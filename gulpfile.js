var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var rename = require('gulp-rename');
var template = require('gulp-template');

gulp.task('template', function(){
	function prep(fnstr) {
		return function() {
			var argString = Array.prototype.join.call(arguments);
			return '~`('+fnstr.toString().replace(/(\r\n|\n|\r|\t)/gm,"")+')('+argString+')`';
		};
	}

	//reload and parse
	var p = path.join(__dirname, 'src', 'functions.js');
	delete require.cache[p];
	var fn = require('./src/functions');
	for(i in fn) {
		fn[i] = prep(fn[i]);
	}

	return gulp.src('src/*.lct')
		.pipe(template(fn))
		.pipe(rename(function (path) {
			path.extname = ".less"
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('less', function(){
	gulp.src('./tests/less/*.less')
		.pipe(less({
			paths: [ path.join(__dirname, 'dist') ]
		}))
		.pipe(gulp.dest('./tests/css'));
});

gulp.task('watch', function(){
	gulp.watch('./src/**/*.*', ['template']);
	gulp.watch(['./dist/**/*.less','./tests/**/*.less'], ['less']);
});

gulp.task('default', ['template', 'less', 'watch']);