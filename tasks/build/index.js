import gulp from 'gulp';

gulp.task('build:dev', [
    'clean',
    'copy:html',
    'sass',
    'fonts',
    'image:dev',
    'bower',
    '6to5'
]);

gulp.task('build:dist', [
    'clean',
    'copy:html',
    'sass',
    'fonts',
    'image:dist',
    'bower',
    '6to5',
    'usemin',
    'clean:generated'
]);
