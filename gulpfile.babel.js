import gulp from "gulp";
import gpug from "gulp-pug";
import del from "del";
import ws from "gulp-webserver";
import gimage from "gulp-image";
import sass from "gulp-sass";
import auto from "gulp-autoprefixer";
import minicss from "gulp-csso";
import bro from "gulp-bro";
import babel from "babelify";
import ghPages from "gulp-gh-pages";


sass.compiler = require("node-sass");

const routes = {
  pug: {
    src: "src/*.pug",
    dest: "build",
    watch: "src/**/*.pug"
  },
  img: {
    src: "src/img/*",
    dest:"build/img"
  },
  scss:{
    watch: "src/scss/**/*.scss",
    src:"src/scss/style.scss",
    dest : "build/css"
  },
  js: {
    watch:"src/js/**/*.js",
    src:"src/js/main.js",
    dest:"build/js"
  }
}

const pug = ()=> 
  gulp
    .src(routes.pug.src)
    .pipe(gpug())
    .pipe(gulp.dest(routes.pug.dest));


const clean =() => del(["build/", ".publish"]);

const webserver = () => gulp.src("build").pipe(ws({livereload: true, open: true}));

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.img.src, img);
  gulp.watch(routes.scss.watch, styles);
  gulp.watch(routes.js.watch, js);
};

const img = () => 
    gulp
    .src(routes.img.src)
    .pipe(gimage())
    .pipe(gulp.dest(routes.img.dest));

const styles = () => 
  gulp
    .src(routes.scss.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(auto({
      browsers:['last 2 versions'],
    }))
    .pipe(minicss())
    .pipe(gulp.dest(routes.scss.dest));

const js = () => gulp.src(routes.js.src).pipe(bro({
  transform: [babel.configure({ presets: ['@babel/preset-env'] }),
  [ 'uglifyify', { global: true } ]]
})).pipe(gulp.dest(routes.js.dest));

const gh = () => gulp.src("build/**/*").pipe(ghPages());

const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug, styles, js]);

const postDev = gulp.parallel([webserver, watch]);

export const build = gulp.series([prepare, assets]);
export const dev= gulp.series([build, postDev]);
export const deploy = gulp.series([build, gh, clean]);
