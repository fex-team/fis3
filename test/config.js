/**
 * Update: 15-5-11
 * Editor: qihongye
 */

var fs = require('fs');
var path = require('path');
var fis = require('../lib/fis.js');
var _ = fis.file;
var defaultSettings = (require('../lib/config.js')).DEFALUT_SETTINGS;
var expect = require('chai').expect;
var u = fis.util;
var config = null;


describe('config: config',function(){
  beforeEach(function(){
    fis.project.setProjectRoot(__dirname);
    fis.config.init(defaultSettings);
    process.env.NODE_ENV = 'dev';
  });

  it('set / get', function () {
    fis.set('namespace', 'common');
    expect(fis.get('namespace')).to.equal('common');

    fis.set('obj', {a:'a'});
    fis.set('obj.b', 'b');
    expect(fis.get('obj')).to.deep.equal({a:'a', b:'b'});
    expect(fis.get('obj.c', {c: 'c'})).to.deep.equal({c:'c'});
    expect(fis.get('obj.a')).to.equal('a');
    expect(fis.get('obj.b')).to.equal('b');
  });

  it('media', function () {
    fis.set('a', 'a');
    fis.set('b', 'b');
    fis.media('prod').set('a', 'aa');

    expect(fis.get('a')).to.equal('a');
    expect(fis.media('prod').get('a')).to.equal('aa');
    expect(fis.media('prod').get('b')).to.equal('b');
    expect(fis.media('prod').get('project.charset')).to.equal('utf8');
  });

  it('fis.match',function(){
    fis.match('**', {
      release: 'static/$&'
    }); // fis.config.match

    fis.match('**/js.js', {
      domain: 'www.baidu.com',
      useHash: false
    }, 1);

    path = __dirname+'/file/ext/modular/js.js?__inline';
    var f = _.wrap(path);
    var url = f.getUrl();
    expect(url).to.equal('www.baidu.com/static/file/ext/modular/js.js?__inline');

    //without domain
    // useDomain 已经去除，所以应该不收其影响了
    fis.match('**/js.js', {
      useDomain: false
    }, 2);

    path = __dirname+'/file/ext/modular/js.js?__inline';
    var f = _.wrap(path);
    var url = f.getUrl();
    expect(url).to.equal('www.baidu.com/static/file/ext/modular/js.js?__inline');

    fis.match('**/js.js', {
      release: null
    }, 3);

    //without path
    path = __dirname+'/file/ext/modular/js.js?__inline';
    var f = _.wrap(path);
    var url = f.getUrl();
    expect(url).to.equal('www.baidu.com/file/ext/modular/js.js?__inline');

    // with ()
    fis.match('**/v1.0-(*)/(*).html', {
      release: '/$1/$2'
    });

    path = __dirname+'/file/ext/v1.0-layout/test.html?__inline';
    var f = _.wrap(path);
    var url = f.getUrl();
    expect(url).to.equal('/layout/test.html?__inline');

    fis.match('!**/js.js', {
      release: '/static/$&',
      useHash: true,
      domain: 'www.baidu.com'
    });

    //with !
    path = __dirname+'/file/ext/modular/js.js?__inline';
    var f = _.wrap(path);
    var url = f.getUrl();
    expect(url).to.equal('www.baidu.com/file/ext/modular/js.js?__inline');

    // with ! but not match
    path = __dirname+'/file/ext/modular/js.less?__inline';
    var f = _.wrap(path);
    var url = f.getUrl();
    expect(url).to.equal('www.baidu.com/static/file/ext/modular/js_'+ f.getHash() +'.less?__inline');
  });
  it('match ${}', function() {
    fis.match('**/*.js', {
      release: null,
      useHash: false
    })
    fis.set('coffee', 'js');
    fis.match('**/js.js', {
      release: '/static/$&'
    });

    path = __dirname+'/file/ext/modular/js.js?__inline';
    var f = _.wrap(path);
    var url = f.getUrl();
    expect(url).to.equal('/static/file/ext/modular/js.js?__inline');

    path = __dirname+'/file/ext/modular/j.js?__inline';
    var f = _.wrap(path);
    var url = f.getUrl();
    expect(url).to.equal('/file/ext/modular/j.js?__inline');
  });
  it('match 混合用法', function() {
    fis.set('ROOT', 'js');
    fis.match('**', {
      useHash: false
    });

    fis.match('(**/${ROOT}.js)', {
      release: '/static/js/$1'
    });

    fis.match('(**/${ROOT}.less)', {
      release: '/static/js/$1'
    });

    path = __dirname+'/file/ext/modular/js.js?__inline';
    var f = _.wrap(path);
    var url = f.getUrl();
    expect(url).to.equal('/static/js/file/ext/modular/js.js?__inline');

    path = __dirname+'/file/ext/modular/js.less?__inline';
    var f = _.wrap(path);
    var url = f.getUrl();
    expect(url).to.equal('/static/js/file/ext/modular/js.less?__inline');
  });

  it('del', function(){
    fis.config.del();
    var origin = fis.config.get();

    fis.set('a.b', 'b');
    fis.media('pro').set('a.b', 'b');

    fis.config.del('a.b');

    expect(fis.get('a')).to.deep.equal({});
    expect(fis.media('pro').get('a.b')).to.equal('b');

    fis.config.del('a');
    expect(fis.get()).to.deep.equal(origin);

    fis.media('pro').del('a');
    expect(fis.media('pro').get()).to.deep.equal({});
  });

  it('getSortedMatches', function() {

    fis.media('prod').match('a', {
      name: ''
    });

    var matches = fis.media('prod')._matches.concat();
    var initIndex = matches[matches.length - 1].index;

    fis.match('b', {
      name: ''
    }, 1)
    fis.match('c', {
      name: ''
    }, 2)

    fis.media('prod').match('b', {
      name: 'prod'
    }, 1)
    fis.media('prod').match('c', {
      name: 'prod'
    }, 2);

    var result_gl = [
      {
        raw: 'b',
        reg: u.glob('b'),
        negate: false,
        properties: {name: ''},
        media: 'GLOBAL',
        weight: 1,
        index: initIndex + 1
      },

      {
        raw: 'c',
        reg: u.glob('c'),
        negate: false,
        properties: {name: ''},
        media: 'GLOBAL',
        weight: 2,
        index: initIndex + 2
      }
    ], result_prod = [
      {
        raw: 'a',
        reg: u.glob('a'),
        negate: false,
        properties: {name: ''},
        media: 'prod',
        weight: 0,
        index: initIndex + 0
      },

      {
        raw: 'b',
        reg: u.glob('b'),
        negate: false,
        properties: {name: ''},
        media: 'GLOBAL',
        weight: 1,
        index: initIndex + 1
      },

      {
        raw: 'b',
        reg: u.glob('b'),
        negate: false,
        properties: {name: 'prod'},
        media: 'prod',
        weight: 1,
        index: initIndex + 3
      },

      {
        raw: 'c',
        reg: u.glob('c'),
        negate: false,
        properties: {name: ''},
        media: 'GLOBAL',
        weight: 2,
        index: initIndex + 2
      },

      {
        raw: 'c',
        reg: u.glob('c'),
        negate: false,
        properties: {name: 'prod'},
        media: 'prod',
        weight: 2,
        index: initIndex + 4
      },
    ];

    var xp = fis.config.getSortedMatches();
    expect(xp).to.deep.equal(result_gl);


    var xp2 = fis.media('prod').getSortedMatches();
    expect(xp2).to.deep.equal(result_prod);
  });

  it("hook",function(){
    fis.config.hook("module");
    expect(fis.env().parent.data.modules.hook[1]['__plugin']).to.equal('module');
  });

  it("unhook",function(){
    fis.config.unhook("module");
    expect(fis.env().parent.data.modules.hook.length).to.equal(1);
  });
});
