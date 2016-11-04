import gulp from 'gulp';
import connect from 'gulp-connect';
import history from 'connect-history-api-fallback';
import config from '../config';

function connectServer(conf) {
    return connect.server(Object.assign({
        root: config.paths.dist,
        port: config.ports.dev,
        livereload: false,
        middleware: () => {
            return [history()];
        }
    }, conf));
}

gulp.task('connect:dev', ['build:dev'], () => {
    return connectServer({
        livereload: true
    });
});

gulp.task('connect:dist', ['build:dist'], () => {
    return connectServer();
});
