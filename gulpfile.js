var gulp = require('gulp');
var merge = require('merge-stream');
var sass = require('gulp-sass');
var browser = require('browser-sync');
var sourcemap = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var reload = browser.reload;

gulp.task('statics', function() {
  return gulp
  .src([
    'src/*.html',
    'src/favicon.ico',
    'src/assets/fonts/*',
    'src/assets/js/*',
    'src/assets/css/images/**/*',
    'src/assets/css/font-awesome.min.css',
    'src/images/**/*'
  ], {base: 'src'})
  .pipe(gulp.dest('.tmp'));
});

gulp.task('statics:prod', function() {
  return gulp
  .src([
    'src/*.html',
    'src/favicon.ico',
    'src/assets/fonts/*',
    'src/assets/js/*',
    'src/assets/css/images/**/*',
    'src/assets/css/font-awesome.min.css',
    'src/images/**/*'
  ], {base: 'src'})
  .pipe(gulp.dest('dist'));
});

gulp.task('sass', function() {
  let styles = gulp
  .src('src/*.scss') // lee el archivo sass
  .pipe(sourcemap.init()) // Genera una referencia de los estilos en sass
  .pipe(sass().on('error', sass.logError)) // compila el archivo sass a css y si hay un error, lo muestra en la consola
  .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false})) // Agrega los prefijos de las reglas css por navegador
  .pipe(sourcemap.write()) // Escribe las referencias luego de compilar
  .pipe(gulp.dest('.tmp/assets/css')); // guarda el archivo css compilado en .tmp

  let templateStyes = gulp
  .src('src/assets/sass/**/*.scss') // lee el archivo sass
  .pipe(sourcemap.init()) // Genera una referencia de los estilos en sass
  .pipe(sass().on('error', sass.logError)) // compila el archivo sass a css y si hay un error, lo muestra en la consola
  .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false})) // Agrega los prefijos de las reglas css por navegador
  .pipe(sourcemap.write()) // Escribe las referencias luego de compilar
  .pipe(gulp.dest('.tmp/assets/css')); // guarda el archivo css compilado en .tmp

  return merge(styles, templateStyes)
  .pipe(reload({stream: true}));
});

gulp.task('sass:prod', function() {
  let styles = gulp
  .src(['src/*.scss']) // lee el archivo sass
  .pipe(sass().on('error', sass.logError)) // compila el archivo sass a css y si hay un error, lo muestra en la consola
  .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false})) // Agrega los prefijos de las reglas css por navegador
  .pipe(gulp.dest('dist/assets/css')); // guarda el archivo css compilado en .tmp

  let templateStyes = gulp
  .src('src/assets/sass/*.scss') // lee el archivo sass
  .pipe(sass().on('error', sass.logError)) // compila el archivo sass a css y si hay un error, lo muestra en la consola
  .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false})) // Agrega los prefijos de las reglas css por navegador
  .pipe(gulp.dest('dist/assets/css')); // guarda el archivo css compilado en .tmp

  return merge(styles, templateStyes)
  .pipe(reload({stream: true}));
});

gulp.task('watch', function() {
  gulp.watch('src/*.scss', ['sass']);
  gulp.watch('src/assets/**/*.*', ['statics', 'sass']);
  gulp.watch('src/images/**/*.*', ['statics']);
  gulp.watch('src/**/*.html', ['statics']);
  gulp.watch('.tmp/*html').on('change', reload);
});

gulp.task('serve', ['statics', 'sass'], function() {
  browser({
    server: {
      baseDir: ['.tmp']
    }
  });

  gulp.start('watch');
});

gulp.task('build', ['statics:prod', 'sass:prod']);

gulp.task('default', ['statics', 'sass']);
