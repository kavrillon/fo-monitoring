import gulp from 'gulp';
import del from 'del';
import config from '../config';

gulp.task('clean', () => {
    return del([`${config.paths.dist}/`, '.publish'], {
        force: true
    });
});

gulp.task('clean:bigs', ['minify'], () => {
    return del([
        `${config.paths.dist}/bower_components/`,
        `${config.paths.dist}/app.css`,
        `${config.paths.dist}/app.js`
    ], {
        force: true
    });
});

gulp.task('clean:generated', ['usemin'], () => {
    return del([
        `${config.paths.dist}/*.map`
    ], {
        force: true
    });
});
