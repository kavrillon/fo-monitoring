import gulp from 'gulp';
import livereload from 'gulp-livereload';
import sourcemaps from 'gulp-sourcemaps';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import browserify from 'browserify';
import watchify from 'watchify';
import babel from 'babelify';
import config from '../config';

function bundle(bundler) {
    return bundler
        .bundle()
        .on('error', function(err) {
            console.error(err); /*eslint no-console: 0*/
            this.emit('end'); /*eslint no-invalid-this: 0*/
        })
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.paths.dist));
}

function build(watching) {
    let bundler = browserify(config.paths.scripts + '/app.js', {
        debug: true
    }).transform(babel);

    if(watching) {
        bundler = watchify(bundler);
        bundler.on('update', () => {
            bundle(bundler);
        });
    }

    return bundle(bundler);
}

gulp.task('6to5', ['clean', /*'bower',*/ 'copy:html'], () => {
    return build(false);
});

gulp.task('6to5:watch', () => {
    return build(true).pipe(livereload());
});
