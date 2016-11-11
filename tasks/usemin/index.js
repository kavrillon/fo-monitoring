import gulp from 'gulp';
import usemin from 'gulp-usemin';
import minifyCss from 'gulp-cssnano';
import minifyHtml from 'gulp-minify-html';
import uglify from 'gulp-uglify';
import rev from 'gulp-rev';
import revReplace from 'gulp-rev-replace';
import config from '../config';

gulp.task('minify', ['clean', 'sass', /*'bower',*/ '6to5', '6to5:sw'], () => {
    const manifest = `${config.paths.dist}/rev-manifest.json`;

    return gulp.src(`${config.paths.dist}/index.html`)
        .pipe(usemin({
            cssVendor: [minifyCss({zindex: false}), rev()],
            html: [minifyHtml({ empty: true })],
            cssApp: [minifyCss({zindex: false}), rev()],
            jsVendor: [uglify(), rev()],
            jsApp: [uglify(), rev()]
        }))
        .pipe(gulp.dest('dist'))
        .pipe(rev.manifest({
            manifest: manifest
        }))
        .pipe(gulp.dest(config.paths.dist));
});

gulp.task('revreplace', ['minify'], () => {
    const manifest = gulp.src(`${config.paths.dist}/rev-manifest.json`);

    return gulp.src(`${config.paths.dist}/sw.js`)
    .pipe(revReplace({
        manifest: manifest
    }))
    .pipe(gulp.dest(`${config.paths.dist}`));
});

gulp.task('usemin', ['minify', 'revreplace', 'clean:bigs']);
