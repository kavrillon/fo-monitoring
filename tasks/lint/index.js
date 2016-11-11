import gulp from 'gulp';
import eslint from 'gulp-eslint';
import sassLint from 'gulp-sass-lint';
import config from '../config';

gulp.task('lint:js', () => {
    return gulp.src(
        config.globs.js.concat(config.globs.sw).concat([
            'tasks/**/*.js',
            'gulpfile.babel.js'
        ]))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('lint:scss', () => {
    return gulp.src(config.globs.scss)
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});
