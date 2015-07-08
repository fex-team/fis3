var expect = require('chai').expect;
var fis = require('..');
var path = require('path');

describe('compile: build single file', function () {
  var root = path.join(__dirname, 'compile');
  beforeEach(function () {
    fis.project.setProjectRoot(root);
    fis.media().init();
    fis.config.init();
    fis.compile.setup();
  });

  it ('build a empty .js file', function () {
    var file = fis.file.wrap(path.join(root, 'files', 'empty.js'));
    fis.compile(file);
    expect(file.getContent()).to.be.equal('');
  });
});

describe('compile: build a virtual file', function () {
  var root = path.join(__dirname, 'compile');
  beforeEach(function () {
    fis.project.setProjectRoot(root);
    fis.media().init();
    fis.config.init();
    fis.compile.setup();
  });

  it('compile a .js file', function () {
    var file = fis.file.wrap('a.js');
    file.setContent('alert("fis");');
    fis.compile(file);
    expect(file.getContent()).to.be.equal('alert("fis");');
    expect(file.getHash()).to.be.equal(fis.util.md5('alert("fis");'));
  });

  it('compile a .css file', function () {
    var file = fis.file.wrap('a.css');
    file.setContent('body {\n color: #FCFCFC; \n }');
    fis.compile(file);
    expect(file.getContent()).to.be.equal('body {\n color: #FCFCFC; \n }');
  });
});

describe('compile: builtin require', function () {
  var root = path.join(__dirname, 'compile', 'proj', 'require');
  beforeEach(function () {
    fis.project.setProjectRoot(root);
    fis.media().init();
    fis.config.init();
    fis.compile.setup();
  });

  //__require();
  it ('compile .js file', function () {
    var file = fis.file.wrap(path.join(root, 'main.js'));
    file.useCache = false;
    fis.compile(file);
    expect(file.requires).to.be.deep.equal(['comp_a.js', 'comp_b.js']);
    expect(file.getContent()).to.be.equal(fis.util.read(path.join(root, 'expect', 'main.js')));
  });

  it ('compile .css file', function () {
    var file = fis.file.wrap(path.join(root, 'main.css'));
    file.useCache = false;
    fis.compile(file);
    expect(file.requires).to.be.deep.equal(['comp_a.css']);
    expect(file.getContent()).to.be.equal(fis.util.read(path.join(root, 'expect', 'main.css')));
  });

  it ('compile .html file', function () {
    var file = fis.file.wrap(path.join(root, 'main.html'));
    file.useCache = false;
    fis.compile(file);
    expect(file.requires).to.be.deep.equal(['comp_a.css', 'comp_a.js']);
    expect(file.getContent()).to.be.equal(fis.util.read(path.join(root, 'expect', 'main.html')));
  });
});


describe('compile: builtin uri', function () {
  var root = path.join(__dirname, 'compile', 'proj', 'uri');
  beforeEach(function () {
    fis.project.setProjectRoot(root);
    fis.media().init();
    fis.config.init();
    fis.compile.setup();
  });

  it('compile .js file', function () {
    var file = fis.file.wrap(path.join(root, 'main.js'));

    fis.match('comp_**.css', {
      useHash: false
    });

    fis.match('comp_*.js', {
      useHash: false
    });

    fis.compile(file);
    expect(file.getContent()).to.be.equal(fis.util.read(path.join(root, 'expect', 'main.js')));
  });

  it('compile .css file', function () {
    var file = fis.file.wrap(path.join(root, 'main.css'));

    fis.match('comp_**.css', {
      useHash: false
    });

    //@TODO glob
    fis.match('*.png', {
      useHash: false
    });

    fis.compile(file);
    expect(file.getContent()).to.be.equal(fis.util.read(path.join(root, 'expect', 'main.css')));

    fis.cache.clean();
    setTimeout(function(){
      fis.match('comp_**.css', {
        useHash: false,
        release: '/static/$0'
      });

      fis.match('*.png', {
        useHash: false,
        release: '/static/img/$0'
      });

      fis.compile(file);
      expect(file.getContent()).to.be.equal(fis.util.read(path.join(root, 'expect', 'main_release.css')));
    },1000);

  });
});
