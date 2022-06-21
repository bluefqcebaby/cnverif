let project_folder = "dist"
let source_folder = "#src"
let path = {
  build: {
    php: project_folder + "/",
    pug: project_folder + "/",
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    img: project_folder + "/img/",
  },
  src: {
    php: source_folder + "/*.php",
    pug: source_folder + "/*.pug",
    html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
    css: source_folder + "/scss/style.scss",
    js: source_folder + "/js/script.js",
    img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
  },
  watch: {
    php: source_folder + "/**/*.php",
    pug: source_folder + "/**/*.pug",
    html: source_folder + "/**/*.html",
    css: source_folder + "/scss/**/*.scss",
    js: source_folder + "/js/**/*.js",
    img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
  },
  clean: "./" + project_folder + "/",
}

let { src, dest } = require("gulp"),
  gulp = require("gulp"),
  browsersync = require("browser-sync").create(),
  del = require("del"),
  scss = require("gulp-sass")(require("sass")),
  autoPrefixer = require("gulp-autoprefixer"),
  cleanCss = require("gulp-clean-css"),
  rename = require("gulp-rename"),
  uglify = require("gulp-uglify-es").default,
  imagemin = require("gulp-imagemin"),
  webp = require("gulp-webp"),
  webpHTML = require("gulp-webp-html"),
  webpcss = require("gulp-webpcss"),
  pug = require("gulp-pug")

function browserSync(params) {
  browsersync.init({
    server: {
      baseDir: path.clean,
    },
    port: 3000,
    notify: false,
  })
}

function html() {
  return src(path.src.html)
    .pipe(webpHTML())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

function Pug() {
  return (
    src(path.src.pug)
      .pipe(
        pug({
          pretty: true,
        })
      )
      // .pipe(webpHTML())
      .pipe(dest(path.build.html))
      .pipe(browsersync.stream())
  )
}

function css() {
  return (
    src(path.src.css)
      .pipe(
        scss({
          outputStyle: "expanded",
        }).on("error", scss.logError)
      )
      .pipe(
        autoPrefixer({
          overrideBrowserslist: ["last 5 versions"],
          cascade: true,
        })
      )
      // .pipe(webpcss({webpClass: '.webp',noWebpClass: '.no-webp'}))
      .pipe(dest(path.build.css))
      .pipe(cleanCss())
      .pipe(
        rename({
          extname: ".min.css",
        })
      )
      .pipe(dest(path.build.css))
      .pipe(browsersync.stream())
  )
}

function scripts() {
  return src(path.src.js)
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(
      rename({
        extname: ".min.js",
      })
    )
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}

function images() {
  return src(path.src.img)
    .pipe(
      webp({
        quality: 80,
      })
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [
          {
            removeViewBox: false,
          },
        ],
        interPlaced: true,
        optimizationLevel: 1, // 0 to 7
      })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}

function php() {
  return src(path.src.php).pipe(dest(path.build.php)).pipe(browsersync.stream())
}

function watchFiles(params) {
  gulp.watch([path.watch.pug], Pug)
  // gulp.watch([path.watch.html], html)
  gulp.watch([path.watch.css], css)
  gulp.watch([path.watch.js], scripts)
  gulp.watch([path.watch.img], images)
  gulp.watch([path.watch.php], php)
}

function clean(params) {
  return del(path.clean)
}

let build = gulp.series(clean, gulp.parallel(Pug, css, scripts, images, php))
let watch = gulp.parallel(build, watchFiles, browserSync)

exports.php = php
exports.images = images
exports.scripts = scripts
exports.css = css
exports.html = html
exports.build = build
exports.watch = watch
exports.default = watch
