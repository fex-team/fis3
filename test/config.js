// fis.baidu.com

var fs = require('fs');
var path = require('path');
var fis = require('../lib/fis.js');
var  _ = fis.file;
var defaultSettings = (require('../lib/config.js')).DEFAULT_SETTINGS;
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
    expect(fis.get('obj')).to.deep.equal({a:'a'});
    expect(fis.get('obj.a')).to.equal('a');
  });

  it('media', function () {
    fis.set('a', 'a');
    fis.set('b', 'b');
    fis.media('prod').set('a', 'aa');

    expect(fis.get('a')).to.equal('a');
    expect(fis.get('b')).to.equal('b');

    expect(fis.media('prod').get('a')).to.equal('aa');
    expect(fis.media('prod').get('b')).to.equal('b');
  });

  it('fis.match',function(){
    fis.match('**', {
      release: 'static/$&'
    }); // fis.config.match

    fis.match('**/js.js', {
      domain: 'www.baidu.com',
      useHash: false
    });

    path = __dirname+'/file/ext/modular/js.js?__inline';
    var f = _.wrap(path);
    var url = f.getUrl();
    expect(url).to.equal('www.baidu.com/static/file/ext/modular/js.js?__inline');

    //without domain
    fis.match('**/js.js', {
      useDomain: false
    });

    path = __dirname+'/file/ext/modular/js.js?__inline';
    var f = _.wrap(path);
    var url = f.getUrl();
    expect(url).to.equal('/static/file/ext/modular/js.js?__inline');

    fis.match('**/js.js', {
      release: null
    });

    //without path
    path = __dirname+'/file/ext/modular/js.js?__inline';
    var f = _.wrap(path);
    var url = f.getUrl();
    expect(url).to.equal('/file/ext/modular/js.js?__inline');
  });
  
  it('del null', function(){
    fis.config.del();
    path = __dirname+'/file/ext/modular/js.js?__inline';
    var f = _.wrap(path);
    var url = f.getUrl(false,true);
    expect(url).to.equal('/file/ext/modular/js.js?__inline');

    fis.config.del('roadmap');
    fis.config.del('system');
    fis.config.del('project');
    fis.config.set();
    expect(fis.get()).to.deep.equal({});
  });
});
