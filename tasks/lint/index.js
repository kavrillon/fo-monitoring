import gulp from 'gulp';
import eslint from 'gulp-eslint';
import sassLint from 'gulp-sass-lint';
import config from '../config';

gulp.task('lint:js', () => {
    return gulp.src(config.globs.js.concat([
        'tasks/**/*.js',
        'gulpfile.js'
    ]))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('lint:scss', () => {
    return gulp.src(config.globs.scss.concat([
        // `!${config.paths.app}/_icons.scss`,
        //`!${config.paths.app}/_mixins.scss`   // this should be excluded cause the interpolation doesn't work yet with sass-lint, see : https://github.com/tonyganch/gonzales-pe/issues/115
    ]))
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});
