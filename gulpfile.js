/**
 * gulp文件
 * Created by yinfxs on 16-9-3.
 */

const gulp = require('gulp');
const gutil = require('gulp-util');
const assign = require('object-assign');
const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require("webpack-dev-server");
const config = require('./webpack.config');
const htmlmin = require('gulp-htmlmin');

// minify-html
gulp.task('minify-html', function () {
    const dest = (process.env.NODE_ENV == 'production') ? 'dist/page' : 'build/page';
    fs.emptyDirSync(dest);
    return gulp.src('src/page/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(dest))
});
// html
gulp.task('html', function () {
    const dest = (process.env.NODE_ENV == 'production') ? 'dist/page' : 'build/page';
    fs.emptyDirSync(dest);
    return gulp.src('src/page/*.html')
        .pipe(gulp.dest(dest))
});

// webpack
gulp.task('webpack', function (callback) {
    assign(config, {devtool: 'sourcemap', debug: true});
    webpack(config, function (err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            color: true
        }));
        fs.copySync('src/page', path.resolve(__dirname, config.output.path, 'page'));
        callback();
    });
});

// webpack-dev-server
gulp.task('webpack-dev-server', function (callback) {
    assign(config, {devtool: 'eval', debug: true});
    config.entry.app.unshift("webpack-dev-server/client?http://localhost:1220", "webpack/hot/dev-server");
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    const compiler = webpack(config);
    new WebpackDevServer(compiler, {
        contentBase: config.output.path,
        hot: true,
        stats: {
            color: true
        }
    }).listen(1220, function (err) {
        if (err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]");
        callback();
    });
});


// 生产环境构建任务
gulp.task('webpack-deploy', function (callback) {
    fs.ensureDirSync('dist');
    fs.emptyDirSync('dist');
    webpack(config, function (err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            color: true
        }));
        callback();
    });
});

gulp.task("build", ['webpack']);
gulp.task("hot", ['webpack', 'webpack-dev-server']);
gulp.task("deploy", ['webpack-deploy', 'minify-html']);

// 文档临听任务
gulp.task('watch', ['build'], function () {
    gulp.watch('src/page/*\.html', ['html']);//监听html变化
});

// 注册默认任务
gulp.task('default', ['build']);