import originalGulp from 'gulp';
import gulpHelp from 'gulp-help';

const gulp = gulpHelp(originalGulp, {
    hideEmpty: true
});

import './tasks/tasks.js';

gulp.task('lint', 'Inspect the code', ['lint:js', 'lint:scss']);
gulp.task('serve', 'Start a server for dev and watch modifications', ['connect:dev', 'watch']);
gulp.task('serve:dist', 'Start a server similar with prod', ['connect:dist']);
gulp.task('build', 'Build prod version', ['build:dist']);
gulp.task('deploy', 'Deploy prod version on gh-pages', ['deploy:release', 'deploy:ghPages']);
gulp.task('default', ['help']);
