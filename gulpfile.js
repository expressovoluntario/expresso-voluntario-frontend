var gulp = require('gulp');
var browserSync = require('browser-sync');
var browserSyncReload = browserSync.reload;
var compass = require('gulp-compass');
var concat = require('gulp-concat');


/*
    * ## TASK compass
    * Compila os arquivos do SASS
*/
gulp.task('compass', function() {
    gulp.src('./app/sass/**/*.scss')
        .pipe(compass({
            css: 'app/assets-generated/css',
            sass: 'app/sass',
            image: 'app/images'
        }));
});


/*
    * ## TASK js-concat
    * Concatena todos os arquivos de app/components e app/modules em scripts.js
*/
gulp.task('js-concat', function() {
    gulp.src(['app/app.js', 'app/components/**/*.js', 'app/modules/**/*.js'])
       .pipe(concat('scripts.js'))
       .pipe(gulp.dest('app/assets-generated/js'));
});


/*
    * ## TASK build
    * Compila o compass e concatena os javascripts
*/
gulp.task('build', ['compass', 'js-concat']);


/*
    * ## TASK watch
    * Sobe um servidor para a aplicação e recarrega o browser após
    * alterações (scss, css, html, js)
*/
gulp.task('watch', function () {
    browserSync({
        'server' : { 'baseDir' : '.'}
    });

    gulp.watch(['app/**/*.html', 'app/assets/css/*.css'], { 'cwd' : '.'}, browserSyncReload);
    gulp.watch('app/**/*.js', ['js-concat', browserSyncReload]);
    gulp.watch(['app/sass/**/*.scss', 'app/**/*.scss'], ['compass']);
});


/*
    * ## TASK default
    * Executa quando acionado apenas "gulp" no terminal
*/
gulp.task('default', ['build', 'watch']);
