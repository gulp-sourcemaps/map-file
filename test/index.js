'use strict';

var expect = require('expect');

var miss = require('mississippi');
var File = require('vinyl');
var normalize = require('normalize-path');

var mapFile = require('../');

var pipe = miss.pipe;
var from = miss.from;
var concat = miss.concat;

function makeFile() {
  var file = new File({
    cwd: __dirname,
    base: __dirname + '/assets',
    path: __dirname + '/assets/helloworld.js',
    contents: null,
  });

  file.sourceMap = {
    version: 3,
    file: 'helloworld.js',
    names: [],
    mappings: '',
    sources: ['helloworld.js', 'helloworld2.js'],
  };

  return file;
}

describe('mapFile', function() {

  it('ignores a file without sourceMap property', function(done) {
    var file = makeFile();
    delete file.sourceMap;

    var spy = expect.createSpy();

    function assert(files) {
      expect(files.length).toEqual(1);
      expect(spy).toNotHaveBeenCalled();
    }

    pipe([
      from.obj([file]),
      mapFile(spy),
      concat(assert),
    ], done);
  });

  it('only ignores a file without sourceMap property', function(done) {
    var file = makeFile();
    delete file.sourceMap;
    var file2 = makeFile();

    function mapFn(filePath) {
      return filePath;
    }

    var spy = expect.createSpy().andCall(mapFn);

    function assert(files) {
      expect(files.length).toEqual(2);
      expect(spy.calls.length).toEqual(1);
    }

    pipe([
      from.obj([file, file2]),
      mapFile(spy),
      concat(assert),
    ], done);
  });

  it('calls map function per file', function(done) {
    var file = makeFile();

    function mapFn(filePath) {
      return '/test/' + filePath;
    }

    function assert(files) {
      expect(files.length).toEqual(1);
      expect(files[0].sourceMap.file).toEqual('/test/helloworld.js');
    }

    pipe([
      from.obj([file]),
      mapFile(mapFn),
      concat(assert),
    ], done);
  });

  it('normalizes Windows paths to unix paths', function(done) {
    var file = makeFile();

    function mapFn(filePath) {
      return '\\test\\' + filePath;
    }

    function assert(files) {
      expect(files.length).toEqual(1);
      expect(files[0].sourceMap.file).toEqual('/test/helloworld.js');
    }

    pipe([
      from.obj([file]),
      mapFile(mapFn),
      concat(assert),
    ], done);
  });

  it('does not need a map function', function(done) {
    var file = makeFile();

    function assert(files) {
      expect(files.length).toEqual(1);
      expect(files[0].sourceMap.file).toEqual('helloworld.js');
    }

    pipe([
      from.obj([file]),
      mapFile(),
      concat(assert),
    ], done);
  });

  it('ignores non-function argument', function(done) {
    var file = makeFile();

    function assert(files) {
      expect(files.length).toEqual(1);
      expect(files[0].sourceMap.file).toEqual('helloworld.js');
    }

    pipe([
      from.obj([file]),
      mapFile('invalid argument'),
      concat(assert),
    ], done);
  });

  it('still normalizes without a map function', function(done) {
    var file = makeFile();
    file.sourceMap.file = '\\test\\' + file.sourceMap.file;

    function assert(files) {
      expect(files.length).toEqual(1);
      expect(files[0].sourceMap.file).toEqual('/test/helloworld.js');
    }

    pipe([
      from.obj([file]),
      mapFile(),
      concat(assert),
    ], done);
  });

  it('calls map function with the filePath and the vinyl file', function(done) {
    var file = makeFile();

    function mapFn(filePath, file) {
      expect(File.isVinyl(file)).toEqual(true);

      return file.base + '/' + filePath;
    }

    function assert(files) {
      expect(files.length).toEqual(1);

      var file = files[0];
      var base = normalize(file.base);

      expect(file.sourceMap.file).toEqual(base + '/helloworld.js');
    }

    pipe([
      from.obj([file]),
      mapFile(mapFn),
      concat(assert),
    ], done);
  });

  it('calls map function with undefined if sourceMap.file is undefined', function(done) {
    var file = makeFile();
    delete file.sourceMap.file;

    function mapFn(filePath) {
      expect(filePath).toEqual(undefined);
      return 'test';
    }

    function assert(files) {
      expect(files.length).toEqual(1);
      expect(files[0].sourceMap.file).toEqual('test');
    }

    pipe([
      from.obj([file]),
      mapFile(mapFn),
      concat(assert),
    ], done);
  });
});
