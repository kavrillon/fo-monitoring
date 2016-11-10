import gulp from 'gulp';
import fileinclude from 'gulp-file-include';
import config from '../config';

gulp.task('fileinclude', ['clean'], () => {
    return gulp.src(`${config.paths.index}`)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(config.paths.dist));
});
