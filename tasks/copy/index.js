import gulp from 'gulp';
import livereload from 'gulp-livereload';
import config from '../config';

function build() {
    return gulp.src(config.globs.html)
        .pipe(gulp.dest(config.paths.dist));
}

gulp.task('copy:html', ['clean'], () => {
    return build();
});

gulp.task('copy:html:watch', () => {
    return build().pipe(livereload());
});
