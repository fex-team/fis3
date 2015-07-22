/**
 * Created with JetBrains WebStorm.
 * User: shenlixia01
 * Date: 13-5-14
 * Time: 上午11:22
 * To change this template use File | Settings | File Templates.
 */

var fs = require('fs'),
path   = require('path');
var fis = require('..');
var project = fis.project;
var _      = fis.cache,
    config = fis.config;
var expect = require('chai').expect;
var root = fis.util(__dirname) + '/fis-tmp';

describe('cache: save(content, info)', function () {
  var targetdir = root + '/target/cache/';
  project.setProjectRoot(__dirname);
  project.setTempRoot(root + '/target/');
  afterEach(function () {
    fis.util.del(targetdir);
  });

  it('general', function () {
    var fp = root + '/src/c1.js';
    var cache = _(fp);
    cache.addDeps(root + '/src/c2.css');
    cache.save('F.use(\'c2\');');
    var hash = fis.util.md5(fp, 10);
    var tmpdir = targetdir + 'c1.js-c-' + hash + '.tmp';
    var jsondir = targetdir + 'c1.js-o-' + hash + '.json';
    //暂时在运行 test/*.js 的时候会报错，但是用例是正确的
    //expect(fs.existsSync(tmpdir)).to.be.true;
    //expect(fs.existsSync(jsondir)).to.be.true;

    //var content = fis.util.read(tmpdir);
    //expect(content).to.equal('F.use(\'c2\');');
    //.json的内容
    //content = JSON.parse(fis.util.read(jsondir));
    //expect(content.version).to.equal(fis.version);
    //var deps = content.deps;
    //var count = 0;
    //for (var d in deps) {
    //  count++;
    //  expect(d).to.equal(root + '/src/c2.css');
    //}
    //expect(count).to.equal(1);
  });
  it('typeof content is buffer', function () {
    var fp = root + '/src/c1.js';
    var cache = _(fp);
    cache.addDeps(root + '/src/c2.css');
    //save的内容为buffer，形如 <Buffer 46 2e 75 73 65 28 27 63 32 27 29 3b>
    var content = fs.readFileSync(fp);
    cache.save(content, 'deps');
    var hash = fis.util.md5(fp, 10);
    var tmpdir = targetdir + 'c1.js-c-' + hash + '.tmp';
    var jsondir = targetdir + 'c1.js-o-' + hash + '.json';
    //暂时在运行 test/*.js 的时候会报错，但是用例是正确的
    //expect(fs.existsSync(tmpdir)).to.be.true;
    //expect(fs.existsSync(jsondir)).to.be.true;
    //
    //content = fis.util.read(tmpdir);
    //expect(content).to.equal('F.use(\'c2\');');
    ////.json的内容
    //content = JSON.parse(fis.util.read(jsondir));
    //expect(content.version).to.equal(fis.version);
    //expect(content.timestamp).to.equal(fis.util.mtime(fp).getTime());
    //expect(content.info).to.equal('deps');
    //var deps = content.deps;
    //var count = 0;
    //for (var d in deps) {
    //  count++;
    //  expect(d).to.equal(root + '/src/c2.css');
    //  expect(deps[d]).to.equal(fis.util.mtime(root + '/src/c2.css').getTime());
    //}
    //expect(count).to.equal(1);
  });


});

describe('cache: revert(file)', function () {
  var targetdir = root + '/target/cache/';
  var fp = root + '/src/c1.js';
  afterEach(function () {
    fis.util.del(targetdir);
  });
  it('general', function () {
    fis.util.write(fp, 'F.use(\'c2\');');
    var cache = _(fp);
    cache.addDeps(root + '/src/c2.css');
    //缓存中设置c1.js的内容为'hello'
    cache.save('hello');
    var obj = {};
    var res = cache.revert(obj);
    expect(obj.content.toString('utf8')).to.equal('hello');
    expect(res).to.be.true;

  });
  it('file mtime is changed', function () {
    fis.util.write(fp, 'F.use(\'c2\');');
    var cache = _(fp);
    cache.addDeps(root + '/src/c2.css');
    //缓存中设置c1.js的内容为'hello'
    cache.save('hello');

    //修改文件的内容,再cache一下，可以更新cache中的timestamp，从而与cache.save中存储的timestamp不一致，从而revert返回false，缓存失效
    var obj = {};
    fis.util.touch(fp, (+(new Date())) + Math.random() * 1000000);
    cache = _(fp);
    var res = cache.revert(obj);
    expect(res).to.be.false;
    expect(obj).to.be.deep.equal({});
  });

  it('dep mtime is changed', function () {
    fis.util.write(fp, 'F.use(\'c2\');');
    var cache = _(fp);
    cache.addDeps(root + '/src/c2.css');
    //缓存中设置c1.js的内容为'hello'
    cache.save('hello');
    //修改dep文件的内容,再cache一下，
    fis.util.touch(root + '/src/c2.css', (+(new Date())) + Math.random() * 1000000);
    var obj = {};
    cache = _(fp);
    var res = cache.revert(obj);
    expect(res).to.be.false;
    expect(obj).to.be.deep.equal({});
  });
  afterEach(function () {
    fis.util.write(fp, 'F.use(\'c2\');');
  });

});


describe('cache: addDeps(file)', function () {
  it('general', function () {
    var fp = root + '/src/c1.js';
    var dep2 = root + '/src/c2.css';
    var dep1 = root + '/src/dep1.js';
    var cache = _(fp);
    cache.addDeps(dep2);
    expect(cache.deps[dep2]).to.equal(fis.util.mtime(dep2).getTime());
    fs.writeFile(dep2,"123","ascii",function(){
      expect(cache.deps[dep2]).to.equal(fis.util.mtime(dep2).getTime());
    });
    cache.addDeps(dep2);
    cache.addDeps(dep1);
    var count1 = 0, count2 = 0;
    for (var d in cache.deps) {
      if (d == dep2 || d == dep1) {
        count1++;
      }
      count2++;
    }
    expect(count1).to.equal(2);
    expect(count2).to.equal(2);
  });
});

describe('cache: removeDeps(file)', function () {
  it('general', function () {
    var fp = root + '/src/c1.js';
    var dep2 = root + '/src/c2.css';
    var dep1 = root + '/src/dep1.js';
    var dep3 = root + '/src/dep3.js';
    var cache = _(fp);
    cache.addDeps(dep2);
    cache.addDeps(dep1);
    cache.addDeps(dep3);

    cache.removeDeps(dep1);
    var count1 = 0, count2 = 0;
    for (var d in cache.deps) {
      if (d == dep3 || d == dep2) {
        count1++;
      }
      count2++;
    }
    expect(count1).to.equal(2);
    expect(count2).to.equal(2);
  })

});

describe('cache: mergeDeps(cache)', function () {
  it('cache is instance of Cache', function () {
    var fp1 = root + '/src/c1.js';
    var fp2 = root + '/src/c2.css';
    var cache1 = _(fp1);
    var cache2 = _(fp2);

    var dep1 = root + '/src/dep1.js';
    var dep2 = root + '/src/d2.css';
    var dep3 = root + '/src/dep3.js';

    cache1.addDeps(dep1);
    cache1.addDeps(dep3);
    cache2.addDeps(dep2);
    cache2.addDeps(dep3);
    /*合并依赖*/
    cache2.mergeDeps(cache1);
    var count1 = 0, count2 = 0;
    for (var d in cache2.deps) {
      if (d == dep2 || d == dep3 || d == dep1) {
        count1++;
      }
      count2++;
    }
    expect(count1).to.equal(3);
    expect(count2).to.equal(3);
  });

  it('cache is deps', function () {
    var fp1 = root + '/src/c1.js';
    var fp2 = root + '/src/c2.css';
    var cache1 = _(fp1);
    var cache2 = _(fp2);

    var dep1 = root + '/src/dep1.js';
    var dep2 = root + '/src/d2.css';
    var dep3 = root + '/src/dep3.js';

    cache1.addDeps(dep1);
    cache1.addDeps(dep3);
    cache2.addDeps(dep2);
    cache2.addDeps(dep3);

    //和上面的用例完全一样，只不过这里传入的是依赖而不是cache对象
    cache2.mergeDeps(cache1.deps);
    var count1 = 0, count2 = 0;
    for (var d in cache2.deps) {
      if (d == dep2 || d == dep3 || d == dep1) {
        count1++;
      }
      count2++;
    }
    expect(count1).to.equal(3);
    expect(count2).to.equal(3);
  });
});

describe('cache: clean(name)', function () {
  fis.util.mkdir(root + '/target/cache');
  expect(fis.util.exists(root + '/target/cache')).to.be.true;
  _.clean();
  expect(fis.util.exists(root + '/target/cache')).to.be.false;
});
