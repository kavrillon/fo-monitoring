import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';
import config from '../config';

gulp.task('image:dist', ['clean'], () => {
    return gulp.src(config.globs.images)
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest(`${config.paths.dist}/images`));
});

gulp.task('image:dev', ['clean'], () => {
    return gulp.src(config.globs.images)
        .pipe(gulp.dest(`${config.paths.dist}/images`));
});
