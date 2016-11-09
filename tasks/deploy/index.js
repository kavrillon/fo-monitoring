import gulp from 'gulp';
import ghPages from 'gulp-gh-pages';
import release from 'gulp-git-release';
import config from '../config';

gulp.task('deploy:ghPages', ['build:dist'], () => {
    return gulp.src(`${config.paths.dist}/**/*`)
        .pipe(ghPages());
});

gulp.task('deploy:release', ['build:dist'], () => {
    return gulp.src(`${config.paths.dist}/**/*`)
        .pipe(release({
            prefix: config.paths.dist,
            release: true,
            debug: false,
            repository: config.globs.repo
        }));
});
