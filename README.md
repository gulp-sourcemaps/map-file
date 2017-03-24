# @gulp-sourcemaps/map-file

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![AppVeyor Build Status][appveyor-image]][appveyor-url] [![Coveralls Status][coveralls-image]][coveralls-url]

Gulp plugin for changing the file property of a sourcemap.

## Example

```js
var mapFile = require('@gulp-sourcemaps/map-file');

gulp.src(...)
  .pipe(sourcemaps.init())
  .pipe(sourcemaps.write())
  .pipe(mapFile(function(filePath, file) {
    return '../' + filePath;
  }))
  .pipe(gulp.dest(...))
```

## API

### `mapFile(mapFn)`

Takes a map function as the only argument. Returns an `objectMode` Transform stream.

#### `mapFn(filePath, file)`

The map function is called once per each [`Vinyl`][vinyl-url] object passed through the stream that contains a sourcemap.  The map function is called with the `filePath` string from the `file` property of the sourcemap and the `file` object it originated from.  The return value replaces the original value.

If a `Vinyl` object doesn't have a `sourceMap` property, the file is passed through the stream without having the `mapFn` called. If the `sourceMap.file` property doesn't exist, `filePath` will be undefined.

All `file` properties are normalized to use `/` instead of `\\` as path separators.

## License

MIT

[vinyl-url]: https://github.com/gulpjs/vinyl

[downloads-image]: http://img.shields.io/npm/dm/@gulp-sourcemaps/map-file.svg
[npm-url]: https://npmjs.org/package/@gulp-sourcemaps/map-file
[npm-image]: http://img.shields.io/npm/v/@gulp-sourcemaps/map-file.svg

[travis-url]: https://travis-ci.org/gulp-sourcemaps/map-file
[travis-image]: http://img.shields.io/travis/gulp-sourcemaps/map-file.svg?label=travis-ci

[appveyor-url]: https://ci.appveyor.com/project/phated/map-file
[appveyor-image]: https://img.shields.io/appveyor/ci/phated/map-file.svg?label=appveyor

[coveralls-url]: https://coveralls.io/r/gulp-sourcemaps/map-file
[coveralls-image]: http://img.shields.io/coveralls/gulp-sourcemaps/map-file.svg
