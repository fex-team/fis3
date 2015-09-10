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

describe('compile check cache revierted', function () {
  var root = path.join(__dirname, 'compile');
  beforeEach(function () {
    fis.project.setProjectRoot(root);
    fis.media().init();
    fis.config.init();
    fis.compile.setup();
  });

  it ('build a empty .js file', function () {
    var linted = false;

    fis.match('**', {
      lint: function() {
        linted = true;
      }
    })

    var file = fis.file.wrap(path.join(root, 'files', 'empty.js'));
    var cachedRevierted = false;

    var origin = fis.compile.settings.beforeCacheRevert;
    file.useCache = true;
    fis.compile.settings.useLint = true;
    fis.compile.settings.unique = true;
    fis.compile.settings.beforeCacheRevert = function() {
      cachedRevierted = true;
    };
    fis.compile(file);
    fis.emit('release:end');
    file = fis.file.wrap(path.join(root, 'files', 'empty.js'));
    fis.compile(file);
    fis.compile.settings.beforeCacheRevert = origin;

    expect(cachedRevierted).to.be.equal(true);
    expect(linted).to.be.equal(true);
  });
});

describe('check parser', function () {
  var root = path.join(__dirname, 'compile');
  beforeEach(function () {
    fis.project.setProjectRoot(root);
    fis.media().init();
    fis.config.init();
    fis.compile.setup();
  });

  it ('build a empty .js file', function () {
    fis.match('*.js', {
      useCache: false,
      parser: function(content, file) {
        return 'hello world';
      }
    });

    var file = fis.file.wrap(path.join(root, 'files', 'empty.js'));
    fis.compile(file);
    expect(file.getContent()).to.be.equal('hello world');
  });
});

describe('check parser postion', function () {
  var root = path.join(__dirname, 'compile');
  beforeEach(function () {
    fis.project.setProjectRoot(root);
    fis.media().init();
    fis.config.init();
    fis.compile.setup();
  });

  it ('build a empty .js file', function () {
    var date1, date2;
    var count = 0;

    fis.match('*.js', {
      useCache: false,
      parser: function(content, file) {
        date1 = count++;
        return 'hello world';
      }
    });

    fis.match('*.js', {
      parser: fis.plugin(function() {
        date2 = count++;
        return 'hello world2'
      }, {}, 'append')
    });

    var file = fis.file.wrap(path.join(root, 'files', 'empty.js'));
    fis.compile(file);
    expect(date2 - date1 >= 0).to.be.equal(true);
    expect(file.getContent()).to.be.equal('hello world2');
  });
});

describe('use dep', function () {
  var root = path.join(__dirname, 'compile');
  beforeEach(function () {
    fis.project.setProjectRoot(root);
    fis.media().init();
    fis.config.init();
    fis.compile.setup();
  });

  it ('build a empty .js file', function () {
    fis.match('*.js', {
      useCache: false,
      parser: function(content, file) {
        var lang = fis.compile.lang;
        return lang.dep.wrap('./index.js');
      }
    });

    var file = fis.file.wrap(path.join(root, 'files', 'empty.js'));
    fis.compile(file);

    var exists = !!file.cache.deps[fis.file.wrap(path.join(root, 'files', 'index.js')).realpath];
    expect(exists).to.be.equal(true);
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
    console.log(file.getContent());
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

  it('compile .html file', function () {
    var file = fis.file.wrap(path.join(root, 'main.html'));

    fis.match('comp_**.css', {
      useHash: false
    });

    fis.match('comp_*.js', {
      useHash: false
    });

    fis.match('*.html:template', {
      isHtmlLike: true
    });

    fis.compile(file);
    expect(file.getContent()).to.be.equal(fis.util.read(path.join(root, 'expect', 'main.html')));
  });

  it('compile .html file', function () {

    fis.match('*.html', {
      useCache: false,
      pipeEmbed: false
    })

    fis.match('comp_**.css', {
      useHash: false
    });

    fis.match('comp_*.js', {
      useHash: false
    });

    fis.match('*.html:template', {
      isHtmlLike: true
    });

    var file = fis.file.wrap(path.join(root, 'main.html'));
    fis.compile(file);
    expect(file.getContent()).to.be.equal(fis.util.read(path.join(root, 'expect', 'main2.html')));
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
    file.useCache = false;
    fis.match('comp_**.css', {
      useHash: false
    });

    //@TODO glob
    fis.match('*.png', {
      useHash: false
    });

    fis.match('*.scss', {
      parser: fis.plugin('sass',null,'append')
    });
    fis.compile(file);
    expect(file.getContent()).to.be.equal(fis.util.read(path.join(root, 'expect', 'main.css')));
    fis.compile.clean(file);
    fis.compile.clean();

    fis.cache.clean();
    //setTimeout(function(){
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
    //},1000);

  });
});
