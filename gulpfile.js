var gulp = require('gulp');
var browserSync = require('browser-sync');
var browserSyncReload = browserSync.reload;
var compass = require('gulp-compass');

/*
    * ## TASK compass
    * Compila os arquivos do SASS
*/
gulp.task('compass', function() {
    gulp.src('./sass/**/*.scss')
        .pipe(compass({
            css: 'app/stylesheets',
            sass: 'sass',
            image: 'app/images'
        }));
});


/*
    * ## TASK watch
    * Sobe um servidor para a aplicação e injeta recarrega o browser após
    * alterações (scss, css, html, js)
*/
gulp.task('watch', function () {
    browserSync({
        'server' : { 'baseDir' : 'app'}
    });

    gulp.watch(
        ['*.html', 'stylesheets/**/*.css', '**/*.js'],
        { 'cwd' : 'app'},
        browserSyncReload
    );

    gulp.watch('sass/**/*.scss', ['compass']);
});


/*
    * ## TASK default
    * Executa quando acionado apenas "gulp" no terminal
*/
gulp.task('default', function () {

});
