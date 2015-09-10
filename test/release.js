var expect = require('chai').expect;
var fis = require('..');
var path = require('path');

describe('Simple release', function () {
  var root = path.join(__dirname, 'release', 'fixtures');
  beforeEach(function () {
    fis.project.setProjectRoot(root);
    fis.media().init();
    fis.config.init();
    fis.compile.setup();
  });

  it ('release simple index.html', function (done) {
    fis.release(function(ret) {
      var exists = !!ret.src['/index.html'];

      expect(exists).to.be.equals(true);
      done();
    });
  });
});

describe('Simple release with direved', function () {
  var root = path.join(__dirname, 'release', 'fixtures');
  beforeEach(function () {
    fis.project.setProjectRoot(root);
    fis.media().init();
    fis.config.init();
    fis.compile.setup();
  });

  it ('release simple index.html', function (done) {

    fis.match('*.html', {
      useCache: false,
      parser: function(content, file) {
        file.derived = file.derived || [];

        var newfile = fis.file.wrap(path.join(root, 'derived.js'));
        newfile.setContent('direved');

        file.derived.push(newfile);

        return content;
      }
    });


    fis.release(function(ret) {
      var exists = !!ret.src['/derived.js'];

      expect(exists).to.be.equals(true);
      expect(ret.src['/derived.js'].getContent()).to.be.equals('direved');
      done();
    });
  });
});
