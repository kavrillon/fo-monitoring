const base = 'src';

const ports = {
    dev: 8080
};

const paths = {
    app: `${base}/`,
    bowerComponents: `${base}/bower_components`,
    dist: 'dist',
    fonts: `${base}/assets/fonts`,
    images: `${base}/assets/images`,
    index: `${base}/index.html`
};

const globs = {
    repo: 'https://github.com/kavrillon/fo-sprints.git',
    bower: `${paths.bowerComponents}/**/*`,
    fonts: `${paths.fonts}/**/*`,
    html: `${paths.app}/**/*.html`,
    manifest: `${paths.app}/manifest.json`,
    images: `${paths.images}/**/*`,
    js: [`${paths.app}/**/*.js`, `!${paths.app}/sw.js`],
    sw: `${paths.app}/sw.js`,
    scss: `${paths.app}/**/*.scss`
};

module.exports = {
    base: base,
    globs: globs,
    paths: paths,
    ports: ports
};
