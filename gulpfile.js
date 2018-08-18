var gulp = require('gulp');
var sass = require('gulp-sass');
var browser = require('browser-sync');
var sourcemap = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var reload = browser.reload;

gulp.task('html', function() {
  return gulp
  .src('src/index.html')
  .pipe(gulp.dest('.tmp'));
});

gulp.task('html:prod', function() {
  return gulp
  .src('src/index.html')
  .pipe(gulp.dest('dist'));
});

gulp.task('sass', function() {
  return gulp
  .src('src/styles.scss') // lee el archivo sass
  .pipe(sourcemap.init()) // Genera una referencia de los estilos en sass
  .pipe(sass().on('error', sass.logError)) // compila el archivo sass a css y si hay un error, lo muestra en la consola
  .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false})) // Agrega los prefijos de las reglas css por navegador
  .pipe(sourcemap.write()) // Escribe las referencias luego de compilar
  .pipe(gulp.dest('.tmp')) // guarda el archivo css compilado en .tmp
  .pipe(reload({stream: true})); // recarga el navegador
});

gulp.task('sass:prod', function() {
  return gulp
  .src('src/styles.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false}))
  .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch('src/styles.scss', ['sass']);
  gulp.watch('src/*.html', ['html']);
  gulp.watch('.tmp/*html').on('change', reload);
});

gulp.task('serve', ['html', 'sass'], function() {
  browser({
    server: {
      baseDir: ['.tmp']
    }
  });

  gulp.start('watch');
});

gulp.task('build', ['html:prod', 'sass:prod']);

gulp.task('default', ['sass']);
