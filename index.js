'use strict';

var through = require('through2');
var normalize = require('normalize-path');

function mapFile(mapFn) {

  function transform(file, _, cb) {
    if (!file.sourceMap) {
      return cb(null, file);
    }

    function mapper(filePath) {
      var result = filePath;
      if (typeof mapFn === 'function') {
        result = mapFn(filePath, file);
      }

      return normalize(result);
    }

    file.sourceMap.file = mapper(file.sourceMap.file);

    cb(null, file);
  }

  return through.obj(transform);
}

module.exports = mapFile;
