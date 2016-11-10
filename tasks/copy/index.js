import gulp from 'gulp';
import livereload from 'gulp-livereload';
import config from '../config';

function html() {
    return gulp.src(config.globs.html)
        .pipe(gulp.dest(config.paths.dist));
}

function manifest() {
    return gulp.src(config.globs.manifest)
        .pipe(gulp.dest(config.paths.dist));
}

gulp.task('copy:manifest', ['clean'], () => {
    return manifest();
});

gulp.task('copy:manifest:watch', ['clean'], () => {
    return manifest().pipe(livereload());
});

gulp.task('copy:html', ['clean'], () => {
    return html();
});

gulp.task('copy:html:watch', () => {
    return html().pipe(livereload());
});
