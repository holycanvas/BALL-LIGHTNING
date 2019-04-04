/***************************************************************************
MIT License

Copyright (c) 2019 Santy-Wang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*****************************************************************************/

const gulp = require('gulp');
const rollup = require('rollup');
const uglifyjs = require('uglify-js');
const del = require('del');
const resolve = require('rollup-plugin-node-resolve');
const fs = require('fs');

var srcFile = 'core/index.js';
var outputFile = 'build/bundle.js';
var sourcemap = false;

gulp.task('clear', async function (done) {
    del.sync('./build/**/*');
    done();
});

gulp.task('compile', async function (done) {
    var inputOptions = {
        input: srcFile,
        plugins: [resolve()]
    },
    outputOptions = {
        format: 'iife',
        name: 'BallLightning',
        file: outputFile,
        indent: '\t',
        sourcemap: true
    };
    const bundle = await rollup.rollup(inputOptions);
    await bundle.generate(outputOptions);
    await bundle.write(outputOptions);
    done();
});

gulp.task('copy-deps', async function (done) {
    gulp.src('./libs/**/*').pipe(gulp.dest('./build/libs/'))
    done();
});

gulp.task('compile:min', async function (done) {
    var code = fs.readFileSync(outputFile, 'utf8');
    var result = uglifyjs.minify(code, {
        toplevel: true,
    });
    if (result.error) {
        console.log("errorline:" + result.error.line);
        return done(result.error);
    }
    fs.writeFileSync('./build/bundle.min.js', result.code, 'utf8');
    done();
});

gulp.task('build-debug', async function (done) {
    done();
});