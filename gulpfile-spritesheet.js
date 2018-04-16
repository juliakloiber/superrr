var basePaths = {
    src: 'assets/svg-build/',
    dest: 'assets/svg-build/'
};
var paths = {
    images: {},
    sprite: {
        src: basePaths.src + 'sprite/*',
        svg: 'spritesheet.svg',
        css: '../../' + basePaths.src + 'sass/src/_sprite.scss'
    },
    templates: {
        src: basePaths.src + 'tpl/'
    }
};

/*
 Let the magic begin
 */
var gulp = require('gulp');

var $ = {
    gutil: require('gulp-util'),
    svgSprite: require('gulp-svg-sprite'),
    size: require('gulp-size')
};

var changeEvent = function(evt) {
    $.gutil.log('File', $.gutil.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + basePaths.src + ')/'), '')), 'was', $.gutil.colors.magenta(evt.type));
};

gulp.task('sprite', function () {
    return gulp.src(paths.sprite.src)
        .pipe($.svgSprite({
            shape: {
                spacing: {
                    padding: 5
                }
            },
            mode: {
                css: {
                    dest: "./",
                    layout: "diagonal",
                    sprite: paths.sprite.svg,
                    bust: false,
                    render: {
                        scss: {
                            dest: "sass/_sprite.scss",
                            template: basePaths.src + "/tpl/sprite-template.scss"
                        }
                    }
                }
            },
            variables: {
                mapname: "icons"
            }
        }))
        .pipe(gulp.dest(basePaths.dest));
});

gulp.task('watch', function(){
    gulp.watch(paths.sprite.src, ['sprite']).on('change', function(evt) {
        changeEvent(evt);
    });
});

gulp.task('default', ['sprite']);
