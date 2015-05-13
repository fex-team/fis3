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
    fis.match('**/js.js', {
      useDomain: false
    }, 2);

    path = __dirname+'/file/ext/modular/js.js?__inline';
    var f = _.wrap(path);
    var url = f.getUrl();
    expect(url).to.equal('/static/file/ext/modular/js.js?__inline');

    fis.match('**/js.js', {
      release: null
    }, 3);

    //without path
    path = __dirname+'/file/ext/modular/js.js?__inline';
    var f = _.wrap(path);
    var url = f.getUrl();
    expect(url).to.equal('/file/ext/modular/js.js?__inline');

    // with ()
    fis.match('**/v1.0-(*)/(*).html', {
      release: '/$1/$2'
    });

    path = __dirname+'/file/ext/v1.0-layout/test.html?__inline';
    var f = _.wrap(path);
    var url = f.getUrl();
    expect(url).to.equal('/layout/test.html?__inline');

    // with ${}
    fis.match('*/${coffee}.js', {
      release: null,
      coffee: 'js'
    });

    path = __dirname+'/file/ext/modular/js.js?__inline';
    var f = _.wrap(path);
    var url = f.getUrl();
    expect(url).to.equal('/file/ext/modular/js.js?__inline');

    fis.match('!**/js.js', {
      release: '/static/$&',
      useHash: true,
      domain: 'www.baidu.com'
    });

    //with !
    path = __dirname+'/file/ext/modular/js.js?__inline';
    var f = _.wrap(path);
    var url = f.getUrl();
    expect(url).to.equal('/file/ext/modular/js.js?__inline');

    // with ! but not match
    path = __dirname+'/file/ext/modular/js.less?__inline';
    var f = _.wrap(path);
    var url = f.getUrl();
    expect(url).to.equal('www.baidu.com/static/file/ext/modular/js_'+ f.getHash() +'.less?__inline');
  });

  it('del', function(){
    fis.config.del();
    var origin = fis.config.get();
    path = __dirname+'/file/ext/modular/js.js?__inline';
    var f = _.wrap(path);
    var url = f.getUrl(false,true);
    expect(url).to.equal('/file/ext/modular/js.js?__inline');

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
    fis.media('pro').match('a', {
      name: ''
    });
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
    }, 2)
    var result_gl = [], result_prod = [];
    ['a', 'b', 'c'].forEach(function(v, i) {
      if (i) {
        result_gl.push({
          reg: u.glob(v),
          negate: false,
          properties: {name: ''},
          media: 'GLOBAL',
          weight: i
        })
        result_gl.push({
          reg: u.glob(v),
          negate: false,
          properties: {name: 'prod'},
          media: 'prod',
          weight: i
        })
        result_prod.push({
          reg: u.glob(v),
          negate: false,
          properties: {name: ''},
          media: 'GLOBAL',
          weight: i
        })
        result_prod.push({
          reg: u.glob(v),
          negate: false,
          properties: {name: 'prod'},
          media: 'prod',
          weight: i
        })
      }else {
        result_gl.push({
          reg: u.glob(v),
          negate: false,
          properties: {name: ''},
          media: 'pro',
          weight: i
        })
      }
    });

    expect(fis.config.getSortedMatches()).to.deep.equal(result_gl);
    expect(fis.media('prod').getSortedMatches()).to.deep.equal(result_prod);
  })
});
