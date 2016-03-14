var gulp = require('gulp');

gulp.task('default', function() {
    gulp.src('node_modules/jquery/**/*')
        .pipe(gulp.dest('public/node_modules/jquery'));

    gulp.src('node_modules/bootstrap/**/*')
        .pipe(gulp.dest('public/node_modules/bootstrap'));

});