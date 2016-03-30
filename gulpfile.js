var gulp = require('gulp');
var commonPathPrefix = 'public/';   //需要编译的公共目录
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');
var gulpJade  = require('gulp-jade');
var jade = require('jade');


//项目需要用到的库
var commonFils = [
    'node_modules/jquery/dist/jquery.*',
    'node_modules/handlebars/dist/handlebars.*',
    'node_modules/js-cookie/src/*.js',
    'node_modules/moment/*.js',
    'node_modules/spin.js/*.js'
];

//开发环境复件文件
gulp.task('default', function() {
    gulp.src('node_modules/**/*')
        .pipe(gulp.dest('public/node_modules'));
});

//压缩脚本文件
gulp.task('scripts', function() {
    gulp.src(commonPathPrefix + 'js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
    gulp.src(commonFils, {base: '.'})
        .pipe(gulp.dest('dist'));
});

//压缩CSS文件
gulp.task('css', function() {
    return gulp.src(commonPathPrefix + 'css/*')
        .pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(gulp.dest('dist/css'));
});

//压缩图片
gulp.task('images', function() {
    gulp.src(commonPathPrefix + 'images/*')
        .pipe(imagemin({
            optimizationLevel: 2,
            progressive: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/images'));
});

//编译jade
gulp.task('templates',['html'], function() {
    gulp.src('views/**/*.jade')
        .pipe(gulpJade({
            jade: jade,
            pretty: false
        }))
        .pipe(gulp.dest('dist'))
});

//压缩html文件
gulp.task('html', function () {
    gulp.src(commonPathPrefix + 'templates/**/*')
        .pipe(htmlmin({
            collapseWhitespace: true,
            ignoreCustomFragments: [/<.*?>|(\}\} \{\{)/, /<%[\s\S]*?%>/, /<\?[\s\S]*?\?>/]
        }))
        .pipe(gulp.dest('dist/templates'));
});


gulp.task('default', ['css', 'scripts', 'images', 'templates']);