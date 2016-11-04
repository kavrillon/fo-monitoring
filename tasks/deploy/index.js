import gulp from 'gulp';
import ghPages from 'gulp-gh-pages';
import config from '../config';

gulp.task('deploy:ghPages', ['build:dist'], () => {
    return gulp.src(`${config.paths.dist}/**/*`)
        .pipe(ghPages());
});
