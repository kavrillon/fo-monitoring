import gulp from 'gulp';

gulp.task('build:dev', [
    'clean',
    'htmlprocess',
    'copy:manifest',
    'sass',
    'fonts',
    'image:dev',
    // 'bower',
    '6to5',
    '6to5:sw'
]);

gulp.task('build:dist', [
    // 'lint',
    'clean',
    'htmlprocess',
    'copy:manifest',
    'sass',
    'fonts',
    'image:dist',
    // 'bower',
    '6to5',
    '6to5:sw',
    'usemin',
    'clean:generated'
]);
