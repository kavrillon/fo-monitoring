import gulp from 'gulp';
import livereload from 'gulp-livereload';
import sourcemaps from 'gulp-sourcemaps';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import browserify from 'browserify';
import watchify from 'watchify';
import babel from 'babelify';
import config from '../config';

function bundle(bundler, sourceFile) {
    return bundler
        .bundle()
        .on('error', function(err) {
            console.error(err); /*eslint no-console: 0*/
            this.emit('end'); /*eslint no-invalid-this: 0*/
        })
        .pipe(source(sourceFile))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.paths.dist));
}

function build(watching, pathFile = config.paths.app, sourceFile = 'app.js') {
    let bundler = browserify(`${pathFile}/${sourceFile}`, {
        debug: true
    }).transform(babel);

    if(watching) {
        bundler = watchify(bundler);
        bundler.on('update', () => {
            bundle(bundler, sourceFile);
        });
    }

    return bundle(bundler, sourceFile);
}

gulp.task('6to5', ['clean'], () => {
    return build(false);
});

gulp.task('6to5:watch', () => {
    return build(true).pipe(livereload());
});

gulp.task('6to5:sw', ['clean'], () => {
    return build(false, config.paths.app, 'sw.js');
});

gulp.task('6to5:sw:watch', () => {
    return build(true, config.paths.app, 'sw.js').pipe(livereload());
});
