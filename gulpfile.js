var gulp = require('gulp');

gulp.task('default', function() {
    gulp.src('node_modules/**/*')
        .pipe(gulp.dest('public/node_modules'));
});