import gulp from 'gulp';
import originalWiredep from 'wiredep';
const wiredep = originalWiredep.stream;
import config from '../config';

gulp.task('bower:copy', ['clean'], () => {
    return gulp.src(config.globs.bower)
        .pipe(gulp.dest(config.paths.dist + '/bower_components'));
});

gulp.task('bower:wiredep', ['bower:copy'], () => {
    return gulp.src(`${config.base}/index.html`)
        .pipe(wiredep({
            devDependencies: true
        }))
        .pipe(gulp.dest(config.paths.dist));
});

gulp.task('bower', ['bower:copy', 'bower:wiredep']);
