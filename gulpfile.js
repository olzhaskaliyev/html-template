const { src, dest, watch, series, parallel, lastRun } = require('gulp');
const $ = require('gulp-load-plugins')();
const del = require('del');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const port = require('yargs').argv.port || 9000;
const dev = process.env.NODE_ENV === 'development';

// Tasks
function clean() {
  return del(['.tmp', 'dist'])
}

function templates() {
  return src('src/*.pug')
    .pipe($.plumber())
    .pipe($.pug({ pretty: true }))
    .pipe(dest('.tmp'));
}

function templatesCached() {
  return src('src/*.pug', { since: lastRun(templatesCached) })
    .pipe($.plumber())
    .pipe($.pug({ pretty: true }))
    .pipe(dest('.tmp'))
    .pipe(browserSync.reload({ stream: true }));
}

function styles() {
  return src('src/styles/*.scss', { sourcemaps: dev })
    .pipe($.plumber())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.'],
    }).on('error', $.sass.logError))
    .pipe($.postcss([autoprefixer()]))
    .pipe(dest('.tmp/styles', { sourcemaps: dev }))
    .pipe(browserSync.reload({ stream: true }));
}

function scripts() {
  return src('src/scripts/**/*.js', { sourcemaps: dev })
    .pipe($.plumber())
    .pipe($.babel())
    .pipe(dest('.tmp/scripts', { sourcemaps: dev ? '.' : false }))
    .pipe(browserSync.reload({ stream: true }));
}

function minify() {
  return src(['src/*.html', '.tmp/*.html'])
    .pipe($.useref({ searchPath: ['.tmp', 'src', '.'] }))
    .pipe($.if(/\.css$/, $.postcss([cssnano({ safe: true, autoprefixer: false })])))
    .pipe($.if(/\.js$/, $.uglify({ compress: { drop_console: true } })))
    .pipe(dest('dist'));
}

function images() {
  return src('src/images/**/*', { since: lastRun(images) })
    .pipe($.imagemin())
    .pipe(dest('dist/images'));
}

function fonts() {
  return src('src/fonts/**/*')
    .pipe($.if(dev, dest('.tmp/fonts'), dest('dist/fonts')));
}

function files() {
  return src(['src/*', '!src/*.html', '!src/*.pug'], { dot: true })
    .pipe(dest('dist'));
}

// Server
function serve() {
  browserSync.init({
    notify: false,
    port,
    server: {
      baseDir: dev ? ['.tmp', 'src'] : 'dist',
      routes: { '/node_modules': 'node_modules' },
    },
  });

  if (dev) {
    watch('src/*.pug', templatesCached);
    watch('src/templates/**/*.pug', templates)
      .on('change', browserSync.reload);
    watch('src/styles/**/*.scss', styles);
    watch('src/scripts/**/*.js', scripts);
    watch('src/fonts/**/*', fonts);
    watch(['src/*.html', 'src/images/**/*', '.tmp/fonts/**/*'])
      .on('change', browserSync.reload);
  }
}

// Export tasks
exports.default = series(
  clean,
  parallel(templates, styles, scripts),
  serve,
);

exports.build = series(
  clean,
  parallel(
    series(
      parallel(templates, styles, scripts),
      minify,
    ),
    images, fonts, files,
  ),
  serve,
);

exports.clean = clean;
exports.templates = templates;
exports.styles = styles;
exports.scripts = scripts;
exports.minify = minify;
exports.images = images;
exports.fonts = fonts;
exports.files = files;
