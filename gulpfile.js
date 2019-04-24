const { src, dest, watch, series, parallel, lastRun } = require('gulp');
const $ = require('gulp-load-plugins')();
const del = require('del');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const postcssNormalize = require('postcss-normalize');
const browserSync = require('browser-sync').create();

const dev = process.env.NODE_ENV === 'development';

const develop = series(clean, parallel(styles, scripts, fonts), function startAppServer() {
  browserSync.init({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'src'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  });

  watch('src/styles/**/*.scss', styles);
  watch('src/scripts/**/*.js', scripts);
  watch('src/fonts/**/*', fonts);
  watch(['src/*.html', 'src/images/**/*', '.tmp/fonts/**/*']).on('change', browserSync.reload);
});

const build = series(
  clean,
  parallel(
    series(parallel(styles, scripts), concat),
    images,
    fonts,
    extras
  ),
  measureSize
);

const serveDist = series(build, function startDistServer() {
  browserSync.init({
    notify: false,
    port: 9000,
    server: {
      baseDir: 'dist',
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  });
});

function clean() {
  return del(['.tmp', 'dist'])
}

function concat() {
  return src('src/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'src', '.']}))
    .pipe($.if(/\.js$/, $.uglify({compress: {drop_console: true}})))
    .pipe($.if(/\.css$/, $.postcss([cssnano({safe: true, autoprefixer: false})])))
    .pipe(dest('dist'));
}

function styles() {
  return src('src/styles/*.scss')
    .pipe($.plumber())
    .pipe($.if(dev, $.sourcemaps.init()))
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.postcss([
      postcssNormalize(),
      autoprefixer()
    ]))
    .pipe($.if(dev, $.sourcemaps.write()))
    .pipe(dest('.tmp/styles'))
    .pipe(browserSync.reload({stream: true}));
}

function scripts() {
  return src('src/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.if(dev, $.sourcemaps.init()))
    .pipe($.babel())
    .pipe($.if(dev, $.sourcemaps.write('.')))
    .pipe(dest('.tmp/scripts'))
    .pipe(browserSync.reload({stream: true}));
}

function images() {
  return src('src/images/**/*', { since: lastRun(images) })
    .pipe($.imagemin())
    .pipe(dest('dist/images'));
}

function fonts() {
  return src('src/fonts/**/*.{eot,svg,ttf,woff,woff2}')
    .pipe($.if(dev, dest('.tmp/fonts'), dest('dist/fonts')));
}

function extras() {
  return src(['src/*', '!src/*.html'], {dot: true})
    .pipe(dest('dist'));
}

function measureSize() {
  return src('dist/**/*')
    .pipe($.size({title: 'build', gzip: true}));
}

exports.default = develop;
exports.build = build;
exports.serveDist = serveDist;
exports.clean = clean;
exports.concat = concat;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.fonts = fonts;
exports.extras = extras;
