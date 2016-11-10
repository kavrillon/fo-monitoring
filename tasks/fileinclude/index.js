import gulp from 'gulp';
import fileinclude from 'gulp-file-include';
import livereload from 'gulp-livereload';
import config from '../config';

function include() {
    return gulp.src(`${config.paths.index}`)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(config.paths.dist));
}

gulp.task('fileinclude', ['clean'], () => {
    return include();
});

gulp.task('fileinclude:watch', () => {
    return include().pipe(livereload());
});
