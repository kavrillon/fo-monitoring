import gulp from 'gulp';
import config from '../config';

gulp.task('fonts', ['clean'], () => {
    return gulp.src(config.globs.fonts)
        .pipe(gulp.dest(`${config.paths.dist}/fonts`));
});
