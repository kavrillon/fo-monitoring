import gulp from 'gulp';
import fileinclude from 'gulp-file-include';
import livereload from 'gulp-livereload';
import preprocess from 'gulp-preprocess';
import config from '../config';
import pjson from '../../package.json';
import manifest from '../../src/manifest.json';

function htmlprocess() {
    return gulp.src(`${config.paths.index}`)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(preprocess({
            context: {
                RELEASE_TAG: pjson.version,
                APP_NAME: manifest.name
            }
        }))
        .pipe(gulp.dest(config.paths.dist));
}

gulp.task('htmlprocess', ['clean'], () => {
    return htmlprocess();
});

gulp.task('htmlprocess:watch', () => {
    return htmlprocess().pipe(livereload());
});
