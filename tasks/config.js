const base = 'src';

const ports = {
    dev: 8080
};

const paths = {
    app: `${base}/`,
    bowerComponents: `${base}/bower_components`,
    dist: 'dist',
    fonts: `${base}/fonts`,
    images: `${base}/images`,
    index: `${base}/index.html`,
    scripts: `${base}/scripts`
};

const globs = {
    repo: 'https://github.com/kavrillon/pwa-monitoring.git',
    bower: `${paths.bowerComponents}/**/*`,
    fonts: `${paths.fonts}/**/*`,
    html: `${paths.app}/**/*.html`,
    manifest: `${paths.app}/manifest.json`,
    images: `${paths.images}/**/*`,
    js: `${paths.app}/**/*.js`,
    scss: `${paths.app}/**/*.scss`
};

module.exports = {
    base: base,
    globs: globs,
    paths: paths,
    ports: ports
};
