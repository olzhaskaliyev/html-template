//inits
const { src, dest, watch, series, parallel, lastRun } = require('gulp');
const $ = require('gulp-load-plugins')();
const del = require('del');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const isDev = process.env.NODE_ENV === 'development';

//servers
const develop = series(clean, parallel(templatesCached, styles, scripts), function() {
  browserSync.init({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'src'],
      routes: {'/node_modules': 'node_modules'}
    }
  });
  watch('src/*.pug', templatesCached);
  watch('src/templates/**/*.pug', templates);
  watch('src/styles/**/*.scss', styles);
  watch('src/scripts/**/*.js', scripts);
  watch(['src/*.html', 'src/img/**/*', 'src/fonts/**/*']).on('change', browserSync.reload);
});
const build = series(
  clean,
  parallel(
    series(parallel(html, templates, styles, scripts), concat),
    images,
    fonts,
    extras
  )
);
const serveDist = series(build, function() {
  browserSync.init({
    notify: false,
    port: 9000,
    server: {
      baseDir: 'dist',
      routes: {'/node_modules': 'node_modules'}
    }
  });
});

//tasks
function concat() {
  return src('.tmp/*.html')
    .pipe($.useref({searchPath: ['.tmp', '.']}))
    .pipe($.if(/\.css$/, $.postcss([cssnano({safe: true, autoprefixer: false})])))
    .pipe($.if(/\.js$/, $.uglify({compress: {drop_console: true}})))
    // .pipe($.if(/\.css$/, dest('dist')))
    // .pipe($.if(/\.js$/, dest('dist')))
    .pipe(dest('dist'));
}
function html() {
  return src('src/*.html')
    .pipe(dest('.tmp'));
}
function templates() {
  return src('src/*.pug')
    .pipe($.plumber())
    .pipe($.pug({pretty: true}))
    .pipe(dest('.tmp'));
}
function templatesCached() {
  return src('src/*.pug', { since: lastRun(templatesCached) })
    .pipe($.plumber())
    .pipe($.pug({pretty: true}))
    .pipe(dest('.tmp'))
    .pipe(browserSync.reload({stream: true}));
}
function styles() {
  return src('src/styles/*.scss')
    .pipe($.plumber())
    .pipe($.if(isDev, $.sourcemaps.init()))
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.postcss([autoprefixer()]))
    .pipe($.if(isDev, $.sourcemaps.write()))
    .pipe(dest('.tmp/styles'))
    .pipe(browserSync.reload({stream: true}));
}
function scripts() {
  return src('src/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.if(isDev, $.sourcemaps.init()))
    .pipe($.if('main.js', $.babel()))
    .pipe($.if(isDev, $.sourcemaps.write('.')))
    .pipe(dest('.tmp/scripts'))
    .pipe(browserSync.reload({stream: true}));
}
function images() {
  return src('src/images/**/*', { since: lastRun(images) })
    .pipe($.imagemin())
    .pipe(dest('dist/images'));
}
function fonts() {
  return src('src/fonts/**/*')
    .pipe($.if(isDev, dest('.tmp/fonts'), dest('dist/fonts')));
}
function extras() {
  return src(['src/*', '!src/*.html', '!src/*.pug'], {dot: true})
    .pipe(dest('dist'));
}
function clean() {
  return del(['.tmp', 'dist'])
}

//exports
exports.default = develop;
exports.build = build;
exports.serveDist = serveDist;
exports.concat = series(parallel(html, templates, styles, scripts), concat);
exports.html = html;
exports.templates = templates;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.fonts = fonts;
exports.extras = extras;
exports.clean = clean;
