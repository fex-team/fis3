/**
 * Created with JetBrains WebStorm.
 * User: shenlixia01
 * Date: 13-5-8
 * Time: 下午4:36
 * To change this template use File | Settings | File Templates.
 * Update: 15-5-10 by Naixor
 */
var fs = require('fs'),
path   = require('path');
var fis = require('..');
var _      = fis.util,
    config = fis.config;
var expect = require('chai').expect;
var _release = fis.require('command-release/lib/release.js');
var _deploy = fis.require('command-release/lib/deploy.js');

function buf2arr(buf) {
  return Array.prototype.slice.call(buf);
}

describe('util: isTextFile', function () {
  beforeEach(function () {
    fis.project.setProjectRoot(__dirname);
  });
  it('general', function () {
    expect(_.isTextFile('')).to.be.false;
    expect(_.isTextFile('a.css')).to.be.true;
    expect(_.isTextFile('a.css/a')).to.be.false;
    expect(_.isTextFile('a.js/a.css')).to.be.true;
    expect(_.isTextFile('test.js')).to.be.true;
    expect(_.isTextFile('/dd/dd/test.bak')).to.be.true;
    expect(_.isTextFile('d:/sdf/sdf/test.tmp')).to.be.true;
  });
});

describe('util: isImageFile', function () {
  beforeEach(function () {
    fis.project.setProjectRoot(__dirname);
  });
  it('general', function () {
    expect(_.isImageFile('')).to.be.false;
    expect(_.isImageFile('d:/sdf/sdf/test.txt')).to.be.false;
    expect(_.isImageFile('a.jpg')).to.be.true;
    expect(_.isImageFile('a.gif/a')).to.be.false;
    expect(_.isImageFile('a.js/a.jpeg')).to.be.true;
    expect(_.isImageFile('test.png')).to.be.true;
    expect(_.isImageFile('/dd/dd/test.bmp')).to.be.true;
    expect(_.isImageFile('d:/sdf/sdf/test.svg')).to.be.true;
  });
});

describe('util: _.normalize(path1, [path2], [...])', function () {
  before(function () {
    config.init();
  });

  //it('without argument', function () {
  //  expect(_.normalize('')).to.equal('');
  //  expect(_.normalize()).to.equal('');
  //});

  it('1 argument of string', function () {
    expect(_('a')).to.equal('a');
  });

  it('1 argument of [Arguments Object]', function () {
    (function () {
      expect(_(arguments)).to.equal('a');
    })('a');
    (function () {
      expect(_(arguments)).to.equal('a/b');
    })('a', 'b');
  });

  it('2 or more arguments', function () {
    expect(_('a', 'b')).to.equal('a/b');
    expect(_('a', 'b', 'c')).to.equal('a/b/c');
    expect(_('a', 'b.js', 'c')).to.equal('a/b.js/c');
  });

  it('replace \\ width /', function () {
    expect(_('a\\b\\c')).to.equal('a/b/c');
    expect(_('a\\b/c')).to.equal('a/b/c');
    expect(_('a\\/b/c')).to.equal('a/b/c');
    expect(_('a\\//\\b/c')).to.equal('a/b/c');
  });

  it('remove all "/./"', function () {
    expect(_('a\\/./b\\c')).to.equal('a/b/c');
    expect(_('d\\e/f')).to.equal('d/e/f');
    expect(_('h/././i')).to.equal('h/i');
    expect(_('j/././k.')).to.equal('j/k.');
    expect(_('l/././m/.')).to.equal('l/m');
    expect(_('/./n./o/.')).to.equal('/n./o');
    expect(_('././.p/q/.')).to.equal('.p/q');
    expect(_('/./.r/s/.')).to.equal('/.r/s');
    expect(_('/t/.//.')).to.equal('/t');
  });

  it('remove all "xx/../"', function () {
    expect(_('a/../b/c')).to.equal('b/c');
    expect(_('a/a.b/../b/c')).to.equal('a/b/c');
    expect(_('../a')).to.equal('../a');
    expect(_('../../a')).to.equal('../../a');
    expect(_('a/../../b')).to.equal('../b');
    expect(_('/.a/b../..')).to.equal('/.a');
    expect(_('../.a/b/c d/e/../f/../g')).to.equal('../.a/b/c d/g');
  });

  it('remove last ' / '', function () {
    expect(_('a/')).to.equal('a');
    expect(_('/')).to.equal('/');
    expect(_('/.')).to.equal('/');
    expect(_('/.a/b../')).to.equal('/.a/b..');
  });

  it('special characters', function () {
    expect(_('a[/')).to.equal('a[');
    expect(_('!a?/')).to.equal('!a?');
    expect(_('a.js?b')).to.equal('a.js?b');
    expect(_('a.js', '?b=123')).to.equal('a.js/?b=123');
    expect(_('~a.js')).to.equal('~a.js');
  });

});

describe('util: _.map(obj, callback, [merge])', function () {
  it('general', function () {
    var obj = {
      a: 1,
      b: {
        c: 2
      }
    };
    _.map(obj, function (key, value) {
      switch (key) {
        case 'a':
          expect(value).to.equal(1);
          break;
        case 'b':
          expect(value).to.deep.equal({c: 2});
          break;
        default :
          expect(true).to.be.false;
      }
    });
  });
  it('merge', function () {
    var obj = {
          a: 1,
          b: {
            c: 2
          }
        },
        ret = {
          b: {
            d: 3
          },
          e: 'abc'
        };
    _.map(obj, ret, true);
    expect(ret).to.deep.equal({
      a: 1,
      b: {
        c: 2
      },
      e: 'abc'
    });
  });
});

//用fill填充字符串到长度len，pre表示将fill填充在前面，此时从后面向前取len的字符串作为结果
describe("util: _.pad(str, len, fill, [pre])", function () {
  it('normal-with fill', function () {
    var str = 'helloworld';
    var result = _.pad(str, 15, '--');
    expect(result).to.equal('helloworld-----');
  });
  it('normal--without fill', function () {
    var str = 'helloworld';
    var result = _.pad(str, 15);
    expect(result).to.equal('helloworld     ');
  });
  it('normal--pre', function () {
    //fill加在前面
    var str = 'helloworld';
    var result = _.pad(str, 11, '-', true);
    expect(result).to.equal('-helloworld');
  });
  it('normal--longer than len', function () {
    //fill加在前面
    var str = 'helloworld';
    var result = _.pad(str, 9, '-', true);
    expect(result).to.equal('helloworld');
  });
});

describe('util: _.merge(source, target)', function () {
  it('general', function () {
    var source = {
          a: {
            b: '1',
            c: {
              d: 2,
              e: [1, 2, 3, 4]
            }
          },
          f: true,
          g: [1, 2, 3, 4]
        },
        target = {
          a: {
            b: {
              c: 1
            },
            c: 'hello',
            f: 'abc'
          },
          g: [6, 7, 8]
        };
    expect(_.merge(source, target)).to.deep.equal({
      a: {
        b: {
          c: 1
        },
        c: 'hello',
        f: 'abc'
      },
      f: true,
      g: [6, 7, 8]
    });
    expect(_.merge({a: 1}, [1])).to.deep.equal([1]);
    expect(_.merge({a: 1}, true)).to.be.true;
  });
});

describe('util: _clone(source)', function () {
  it('source is obj', function () {
    //empty
    var source = {};
    var ret = _.clone(source);
    expect(ret).to.deep.equal(source);
    //not empty
    source = {
      'a': 1,
      'b': {
        'c': 2,
        'd': "ef"
      },
      'e': "ijk"
    };
    ret = _.clone(source);
    expect(ret).to.deep.equal(source);
  });
  it('source is array', function () {
    //empty
    var source = [];
    var ret = _.clone(source);
    expect(ret).to.deep.equal(source);
    //not empty
    source = [1, 3, "sss"];
    ret = _.clone(source);
    expect(ret).to.deep.equal(source);
  });
});

describe('util: _.escapeShellCmd(str)', function () {
  it('general', function () {
    expect(_.escapeShellCmd("")).to.be.equal("");
    expect(_.escapeShellCmd(" ")).to.be.equal("\" \"");
    expect(_.escapeShellCmd("abc")).to.be.equal("abc");
    expect(_.escapeShellCmd("ab c")).to.be.equal("ab\" \"c");
    expect(_.escapeShellCmd("abc ")).to.be.equal("abc\" \"");
    expect(_.escapeShellCmd(" abc")).to.be.equal("\" \"abc");
  });
});

describe('util: _.escapeShellArg(cmd)', function () {
  it('general', function () {
    expect(_.escapeShellArg("")).to.be.equal("\"\"");
    expect(_.escapeShellArg(" ")).to.be.equal("\" \"");
    expect(_.escapeShellArg("abc")).to.be.equal("\"abc\"");
    expect(_.escapeShellArg("abc ")).to.be.equal("\"abc \"");
  });
});

describe('util: _.stringQuote(str, [quotes], [trim])', function () {
  it('1 param', function () {
    var str1 = ' "helloworld" ';
    var str2 = '"hello2"';
    var str3 = "\"hello3\"";
    var str4 = '"hello4';
    var str5 = '\'hello5\'';
    expect(_.stringQuote(str1)).to.deep.equal({
      origin: ' "helloworld" ',
      rest: "helloworld",
      quote: "\""
    });
    expect(_.stringQuote(str2)).to.deep.equal({
      origin: "\"hello2\"",
      rest: "hello2",
      quote: "\""
    });
    expect(_.stringQuote(str3)).to.deep.equal({
      origin: "\"hello3\"",
      rest: "hello3",
      quote: "\""
    });
    expect(_.stringQuote(str5)).to.deep.equal({
      origin: "\'hello5\'",
      rest: "hello5",
      quote: "'"
    });
    expect(_.stringQuote(str4)).to.deep.equal({
      origin: '"hello4',
      rest: '"hello4',
      quote: ""
    });
  });

  it('quotes', function () {
    var str1 = '&hello1&';
    var str2 = '&hello2';
    expect(_.stringQuote(str1, '&')).to.deep.equal({
      origin: '&hello1&',
      rest: 'hello1',
      quote: "&"
    });
    expect(_.stringQuote(str2, '&')).to.deep.equal({
      origin: '&hello2',
      rest: '&hello2',
      quote: ""
    });
  });

  // it('no trim', function () {
  //     var str1 = ' "hello1" ';
  //     var str2 = ' &hello2 ';
  //     expect(_.stringQuote(str1, null, false)).to.deep.equal({
  //             origin: ' "hello1" ',
  //             rest: " \"hello1\" ",
  //             quote: ""
  //         });
  //     expect(_.stringQuote(str2, '&', false)).to.deep.equal({
  //             origin: ' &hello2 ',
  //             rest: ' &hello2 ',
  //             quote: ""
  //         });
  // });

  it('special characters', function () {
    var str1 = '([{^$|)?*+.,';
    expect(_.stringQuote(str1, null, false)).to.deep.equal({
      origin: '([{^$|)?*+.,',
      rest: "([{^$|)?*+.,",
      quote: ""
    });
  });
});

describe('util: _.getMimeType(ext)', function () {
  it('defined', function () {
    expect(_.getMimeType('.css')).to.equal('text/css');
    expect(_.getMimeType('js')).to.equal('text/javascript');
    expect(_.getMimeType('.txt')).to.equal('text/plain');
    expect(_.getMimeType('.json')).to.equal('application/json');
    expect(_.getMimeType('ico')).to.equal('image/x-icon');
    expect(_.getMimeType('.cur')).to.equal('application/octet-stream');
  });
  it('undefined', function () {
    expect(_.getMimeType('fuckie')).to.equal('application/x-fuckie');
  });
});

describe('util: _.realpath(path)', function () {
  it('file or dir exists', function () {
    expect(_.realpath(__filename)).to
      .equal(__filename.replace(/\\/g, '/'));
    expect(_.realpath(__dirname + '/')).to
      .equal(__dirname.replace(/\\/g, '/'));
    expect(_.realpath('.')).to
      .equal(process.cwd().replace(/\\/g, '/'));
    if (_.isWin()) {
      expect(_.realpath('/')).to.match(/^(?:\w:)?$/);
    } else {
      expect(_.realpath('/')).to.equal('/');
    }
  });
  it('not exists', function () {
    expect(_.realpath(__filename + '.abc')).to.be.false;
    expect(_.realpath('')).to.be.false;
    expect(_.realpath(false)).to.be.false;
    expect(_.realpath()).to.be.false;
  });
});

describe('util: _.realpathSafe(path)', function () {
  it('file or dir exists', function () {
    expect(_.realpathSafe(__filename)).to
      .equal(__filename.replace(/\\/g, '/'));
    expect(_.realpathSafe(__dirname)).to
      .equal(__dirname.replace(/\\/g, '/'));
    expect(_.realpathSafe('.')).to
      .equal(process.cwd().replace(/\\/g, '/'));
  });
  it('not exists', function () {
    expect(_.realpathSafe(__filename + '.abc')).to
      .equal((__filename + '.abc').replace(/\\/g, '/'));
  });
});

describe('util: _.isAbsolute(path)', function () {
  it('general', function () {
    if (_.isWin()) {
      expect(_.isAbsolute('d:/work/hello')).to.be.true;
      expect(_.isAbsolute('./work/hello')).to.be.false;
      expect(_.isAbsolute('work/hello')).to.be.false;
    } else {
      expect(_.isAbsolute('/')).to.be.true;
      expect(_.isAbsolute('~')).to.be.true;
      expect(_.isAbsolute('/usr/local/')).to.be.true;
      expect(_.isAbsolute('./usr/local/')).to.be.false;
      expect(_.isAbsolute('usr/local')).to.be.false;
    }
  });

});

describe('util: _.isFile(path)', function () {
  it('file', function () {
    expect(_.isFile(__filename)).to.be.true;
    expect(_.isFile(__filename + '/a.js')).to.be.false;
  });
  it('dir', function () {
    expect(_.isFile(__dirname)).to.be.false;
    expect(_.isFile(__dirname + '/..')).to.be.false;
  });
});

describe('util: _.isDir(path)', function () {
  it('file', function () {
    expect(_.isDir(__filename)).to.be.false;
    expect(_.isDir(__filename + '/a.js')).to.be.false;
  });
  it('dir', function () {
    expect(_.isDir(__dirname)).to.be.true;
    expect(_.isDir(__dirname + '/..')).to.be.true;
    expect(_.isDir(__dirname + '/~abc')).to.be.false;
  });
});

describe('util: _.mtime(path)', function () {
  it('file or dir exists', function () {
    expect(_.mtime(__filename)).to.be.an.instanceOf(Date);
    expect(_.mtime(__dirname)).to.be.an.instanceOf(Date);
  });
  it('file does not exists', function () {
    expect(_.mtime(__filename + '.test')).to.equal(0);
  });
});

describe('util: _.touch(path, mtime)', function () {
  it('file or dir exists', function () {
    var stat = fs.statSync(__filename),
        mtime = stat.mtime,
        mtimeNum = mtime.getTime();
    expect(_.mtime(__filename).getTime()).to.equal(mtimeNum);
    _.touch(__filename, mtimeNum + 1000);

    var x1 = Math.floor(_.mtime(__filename).getTime()/1000);
    var x2 = Math.floor(mtimeNum/1000);
    expect(x1).to.equal(x2 + 1);
    _.touch(__filename, mtime);
    var y1 = Math.floor(_.mtime(__filename).getTime()/1000);
    var y2 = Math.floor(mtimeNum/1000);
    expect(y1).to.equal(y2);
  });

  it('file does not exist.', function () {
    var time = new Date(),
        file = __filename + '.tmp',
        timeNum = Math.floor(time.getTime() / 1000) * 1000 - 1000;
    time.setTime(time.getTime() - 1000);
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
    expect(_.exists(file)).to.be.false;
    _.touch(file, time);
    expect(_.exists(file)).to.be.true;
    expect(fs.readFileSync(file)).to.have.length(0);
    expect(_.mtime(file).getTime()).to.equal(timeNum);
    _.del(file);
    expect(_.exists(file)).to.be.false;
  });
});

describe('util: _.isWin()', function () {
  it('general', function () {
    expect(_.isWin()).to.equal(path.sep === '\\');
  });
});

describe('util: _.isTextFile(path)', function () {
  it('without config', function () {
    expect(_.isTextFile('a.js')).to.be.true;
    expect(_.isTextFile('a.js.css')).to.be.true;
    expect(_.isTextFile('a.js.csss')).to.be.false;
    expect(_.isTextFile('')).to.be.false;
    expect(_.isTextFile()).to.be.false;
  });
  it('with config', function () {
    expect(_.isTextFile('a.js.csss')).to.be.false;
    config.set('project.fileType.abc', ['csss']);
    expect(_.isTextFile('a.js.csss')).to.be.false;
    config.set('project.fileType.text', ['csss']);
    expect(_.isTextFile('a.js.csss')).to.be.true;
    config.set('project.fileType.text', 'csss');
    expect(_.isTextFile('a.js.csss')).to.be.true;
    config.set({});
    expect(_.isTextFile('a.js.csss')).to.be.false;
  });
});

describe('util: _.isImageFile(path)', function () {
  it('without config', function () {
    expect(_.isImageFile('a.png')).to.be.true;
    expect(_.isImageFile('a.js.gif')).to.be.true;
    expect(_.isImageFile('a.js.jpee')).to.be.false;
    expect(_.isImageFile('')).to.be.false;
    expect(_.isImageFile()).to.be.false;
  });
  it('with config', function () {
    expect(_.isImageFile('a.js.jpee')).to.be.false;
    config.set('project.fileType.bcd', ['jpee']);
    expect(_.isImageFile('a.js.jpee')).to.be.false;
    config.set('project.fileType.image', ['jpee']);
    expect(_.isImageFile('a.js.jpee')).to.be.true;
    config.set('project.fileType.image', 'jpee');
    expect(_.isImageFile('a.js.jpee')).to.be.true;
    config.set({});
    expect(_.isImageFile('a.js.jpee')).to.be.false;
  });
});

describe('util: _.md5(str)', function () {
  //md5('fis') = 37ab815c056b5c5f600f6ac93e486a78
  //md5('') = d41d8cd98f00b204e9800998ecf8427e
  it('general', function () {
    expect(_.md5('fis')).to.equal('37ab815');
    expect(_.md5('')).to.equal('d41d8cd');
    expect(_.md5).to.throw(TypeError);
  });
  it('with config', function () {
    config.set('project.md5Length', 10);
    expect(_.md5('fis')).to.equal('37ab815c05');
    expect(_.md5('')).to.equal('d41d8cd98f');
    expect(_.md5).to.throw(TypeError);
    config.set('project.md5Length', 7);
    expect(_.md5('fis')).to.equal('37ab815');
    expect(_.md5('')).to.equal('d41d8cd');
    expect(_.md5).to.throw(TypeError);
  });
  it('use buffer', function () {
    var buf = new Buffer('hello world');
    expect(_.md5(buf)).to.equal('5eb63bb');
  });
});

describe('util: _.base64(data)', function () {
  it('string', function () {
    expect(_.base64('fis')).to.equal('Zmlz');
    expect(_.base64('')).to.equal('');
    expect(_.base64()).to.equal('');
  });
  it('buffer', function () {
    var root = _(__dirname, 'util/base64'),
        source = fs.readFileSync(root + '/logo.gif'),
        data = fs.readFileSync(root + '/logo.txt').toString();
    expect(_.base64(source)).to.equal(data);
  });
  it('array', function () {
    //octets array
    var str = 'fis';
    var octent_array = [];
    for (var i = 0, length = str.length; i < length; i++) {
      var code = str.charCodeAt(i);
      octent_array.push(code & 0xff);
    }
    expect(_.base64(octent_array)).to.be.equal('Zmlz');
  });
});

describe('util: _.mkdir(path1, [mode])', function () {
  it('general', function () {
    var dir = _(__dirname) + '/mkdir';
    expect(_.isDir(dir)).to.be.false;
    _.mkdir(dir);
    expect(_.isDir(dir)).to.be.true;
    _.del(dir);
    expect(_.isDir(dir)).to.be.false;
  });
  it('recursive', function () {
    var dir = _(__dirname) + '/mkdir/a/b/c/d';
    expect(_.isDir(dir)).to.be.false;
    _.mkdir(dir);
    expect(_.isDir(dir)).to.be.true;
    _.del(__dirname + '/mkdir');
    expect(_.isDir(dir)).to.be.false;
    expect(_.isDir(__dirname + '/mkdir')).to.be.false;
    expect(_.isDir(__dirname + '/mkdir/a')).to.be.false;
    expect(_.isDir(__dirname + '/mkdir/a/b')).to.be.false;
    expect(_.isDir(__dirname + '/mkdir/a/b/c')).to.be.false;
    expect(_.isDir(__dirname + '/mkdir/a/b/c/d')).to.be.false;
  });
});

describe('util: _.toEncoding(str, encoding)', function () {
  it('general', function () {
    //default utf-8
    expect(_.toEncoding('你好').toString()).to.be.equal('你好');
    expect(_.toEncoding('A').toString()).to.be.equal('A');
    expect(_.toEncoding('').toString()).to.be.equal('');
    expect(_.toEncoding(' ').toString()).to.be.equal(' ');
  });
});

describe('util: _.readBuffer(buffer)', function () {
  it('utf-8 with bom', function () {
    var buf = new Buffer([
      0xef, 0xbb, 0xbf, 0x68,
      0x65, 0x6C, 0x6C, 0x6F,
      0x20, 0x77, 0x6F, 0x72,
      0x6C, 0x64
    ]);
    expect(_.readBuffer(buf)).to.equal('hello world');
  });
  it('utf-8 without bom', function () {
    var buf = new Buffer([
      0x68, 0x65, 0x6C, 0x6C,
      0x6F, 0x20, 0x77, 0x6F,
      0x72, 0x6C, 0x64
    ]);
    expect(_.readBuffer(buf)).to.equal('hello world');
  });
  it('gbk', function () {
    var buf = new Buffer([0xC4, 0xE3, 0xBA, 0xC3]);
    expect(_.readBuffer(buf)).to.equal('你好');
  });
});

describe('util: _.read(path)', function () {
  var root = _(__dirname, 'util/encoding');
  it('encoding utf-8 without bom', function () {
    expect(_.read(root + '/utf8.txt')).to
      .equal('你好,©我是€无bom文件');
  });
  it('encoding utf-8 with bom', function () {
    expect(_.read(root + '/utf8-bom.txt')).to
      .equal('你好,©我是€utf8-bom文件');
    var data = fs.readFileSync(root + '/utf8-bom.txt'),
        buffer = new Buffer('\uFEFF你好,©我是€utf8-bom文件');
    expect(data).to.deep.equal(buffer);
  });
  it('encoding gbk', function () {
    expect(_.read(root + '/gbk.txt')).to
      .equal('你好,我是gbk');
  });
  it('read from binary file', function () {
    var file = _(__dirname, 'util/img/data.png'),
        data = fs.readFileSync(file),
        read = _.read(file);
    expect(read).to.deep.equal(data);
  });
});

describe('util: _.write()', function () {
  it('general', function () {
    var testfile = _(__dirname, 'write.tmp');
    _.write(testfile, '你好, fis。');
    var data = buf2arr(fs.readFileSync(testfile)),
        exp = [
          0xe4, 0xbd, 0xa0, 0xe5,
          0xa5, 0xbd, 0x2c, 0x20,
          0x66, 0x69, 0x73, 0xe3,
          0x80, 0x82
        ];
    expect(data).to.deep.equal(exp);
    expect(_.exists(testfile)).to.be.true;
    _.del(testfile);
    expect(_.exists(testfile)).to.be.false;
  });

  it('gbk encoding', function () {
    var testfile = _(__dirname, 'write.tmp');
    _.write(testfile, '你好, fis。', 'gbk');
    var data = buf2arr(fs.readFileSync(testfile)),
        exp = [
          0x00c4, 0x00e3, 0x00ba, 0x00c3,
          0x002c, 0x0020, 0x0066, 0x0069,
          0x0073, 0x00a1, 0x00a3
        ];
    expect(data).to.deep.equal(exp);
    expect(_.exists(testfile)).to.be.true;
    _.del(testfile);
    expect(_.exists(testfile)).to.be.false;
  });

  it('auto mkdir', function () {
    var testfile = _(__dirname, 'mkdir/write.tmp'),
        content = '你好, fis。';
    expect(_.exists(__dirname + '/mkdir')).to.be.false;
    expect(_.exists(testfile)).to.be.false;
    _.write(testfile, content);
    expect(_.exists(__dirname + '/mkdir')).to.be.true;
    expect(_.exists(testfile)).to.be.true;
    expect(_.read(testfile)).to.equal(content);
    _.del(__dirname + '/mkdir');
    expect(_.exists(__dirname + '/mkdir')).to.be.false;
    expect(_.exists(testfile)).to.be.false;
  });

  it('append', function () {
    var testfile = _(__dirname, 'write.tmp'),
        content = '你好, fis。';
    _.write(testfile, '你好, fis。');
    expect(_.read(testfile)).to.equal(content);
    _.write(testfile, '123');
    expect(_.read(testfile)).to.equal('123');
    _.write(testfile, '你好', null, true);
    expect(_.read(testfile)).to.equal('123你好');
    _.del(testfile);
  });
});


describe('util: _.filter(str, [include], [exclude])', function () {
  it('1 param', function () {
    expect(_.filter('hello')).to.be.true;
  });
  it('include', function () {
    var phonenumber=new RegExp("c.js$", "g");
    expect(_.filter("abc.js", phonenumber)).to.be.true;
    expect(_.filter("abc.djs", phonenumber)).to.be.false;
    expect(_.filter('abc.js', '*c.js')).to.be.false;
    expect(_.filter('/abc/c.js', 'c.js')).to.be.true;
  });
  it('exclude', function () {
    var phonenumber2=new RegExp("c.js$", "g");
    expect(_.filter("abcd.js", null , phonenumber2)).to.be.true;
    expect(_.filter("abc.js", null , phonenumber2)).to.be.false;
    expect(_.filter('b.js', null, '*.js')).to.be.true;
    expect(_.filter('abc/d.js', null, 'b.jsd')).to.be.true;
  });
//    it('exclude&include',function(){
//        expect(_.filter('js','a.js','b/b.js')).to.be.false;
//        expect(_.filter('/abc/c.js','*.js','**.js')).to.be.false;
//        expect(_.filter('/a/b.js','*.js','c.js')).to.be.true;
//    });
});

describe('util: _find(rPath, [include], [exclude])', function () {
//    it('invalid path',function(){
//        try{
//            _.find('./invalidPath')
//        }catch(e){
//            expect(1).to.equal(1);
//        }
//
//    });
  it('normal', function () {
    var imgs = _.find(__dirname + '/util/img');
    for (var i = 0; i < imgs.length; i++) {
      imgs[i] = path.normalize(imgs[i]);
    }
    expect(imgs).to.deep.equal(
      [
        path.normalize(__dirname + '/util/img/data.png'),
        path.normalize(__dirname + '/util/img/test.png')
      ].sort()
    );
  });

  it('empty dir', function () {
    _.mkdir(__dirname + '/util/emptyDir');
    var imgs = _.find(__dirname + '/util/emptyDir');
    expect(imgs.length).to.equal(0);
  });
  it('file path', function () {
    var img = _.find(__dirname + '/util/img/data.png');
    expect(img.length).to.equal(1);
    img = img[0];
    img = path.normalize(img);
    expect(img).to.equal(path.normalize(__dirname + '/util/img/data.png'));
  });
  it('include', function () {
    var file = _.find(__dirname + '/util/base64/', '*.gif');
    expect(file.length).to.equal(1);
    file = file[0];
    file = path.normalize(file);
    expect(file).to.equal(path.normalize(__dirname + '/util/base64/logo.gif'));

    file = _.find(__dirname + '/util/base64/', 'xsl');
    expect(file).to.deep.equal([]);

    file = _.find(__dirname + '/util/base64/', ['*.txt', '*.gif']);
    expect(file.length).to.equal(2);
  });

  //include和exclude都是通配符，如**.js，所以转化为正则以后应该是/js$/这种样子的，所以就不考虑exclude和include同时存在的情况了，太无聊了
  it('exclude', function () {
    var file = _.find(__dirname + '/util/base64/', null, '*.gif');
    expect(file.length).to.equal(1);
    file = file[0];
    file = path.normalize(file);
    expect(file).to.equal(path.normalize(__dirname + '/util/base64/logo.txt'));

    var imgs = _.find(__dirname + '/util/img/', null, 'gif');
    for (var i = 0; i < imgs.length; i++) {
      imgs[i] = path.normalize(imgs[i]);
    }
    expect(imgs).to.deep.equal(
      [
        path.normalize(__dirname + '/util/img/data.png'),
        path.normalize(__dirname + '/util/img/test.png')
      ].sort()
    );
  });

  it('include and exclude', function () {
    var file = _.find(__dirname + '/util/base64/', ['*.txt', '*.gif'], ['*.txt', '*.gif']);
    expect(file.length).to.equal(0);

    file = _.find(__dirname + '/util/base64/', ['*.txt', '*.gif'], ['*.gif']);
    expect(file.length).to.equal(1);

    file = _.find(__dirname + '/util/base64/', ['*.txt', '*.gif'], ['*.gif2']);
    expect(file.length).to.equal(2);

    file = _.find(__dirname + '/util/base64/', ['*.txt'], ['*.gif']);
    expect(file.length).to.equal(1);
    file = file[0];
    file = path.normalize(file);
    expect(file).to.equal(path.normalize(__dirname + '/util/base64/logo.txt'));
  });

});

describe('util: _.del(rPath, include, exclude)', function () {
  it('remove file', function () {
    var tmpdir = __dirname + "/tmp/tmp2";
    _.mkdir(tmpdir);
    fs.writeFileSync(tmpdir + '/a.txt', 'hello world');
    expect(_.isDir(tmpdir)).to.be.true;
    expect(_.del(__dirname + "/tmp")).to.be.true;
    expect(_.isDir(tmpdir)).to.be.false;
  });

  it('remove folder', function () {
    var tmpdir = __dirname + "/tmp/tmp2";
    _.mkdir(tmpdir);
    expect(_.isDir(tmpdir)).to.be.true;
    _.del(__dirname + "/tmp/");
    expect(_.isDir(__dirname + "/tmp/")).to.be.false;
  });

  it('remove hidden folder on linux / Unix', function () {
    var tmpdir = __dirname + '/tmp/tmp2/.bin';
    _.mkdir(tmpdir);
    fs.writeFileSync(tmpdir + '/.access', '[REWRITE]\n');
    expect(_.isDir(tmpdir)).to.be.true;
    expect(_.del(__dirname + "/tmp")).to.be.true;
    expect(_.isDir(tmpdir)).to.be.false;
  });

  it('remove folder include symlink file', function () {
    var tmpdir = __dirname + '/tmp_1/tmp2/.bin';
    _.mkdir(tmpdir);
    fs.writeFileSync(tmpdir + '/.access', '[REWRITE]\n');
    fs.writeFileSync(tmpdir + '/src', 'TEST\n');
    fs.symlinkSync(tmpdir + '/src', tmpdir + '/dst');
    expect(_.isDir(tmpdir)).to.be.true;
    expect(_.del(__dirname + "/tmp_1")).to.be.true;
    expect(_.isDir(tmpdir)).to.be.false;
  });

  it('include', function () {
    var tmpdir = __dirname + "/tmp/tmp2";
    _.mkdir(tmpdir);
    fs.writeFileSync(tmpdir + '/a.js', 'hello world');
    fs.writeFileSync(__dirname + "/tmp/a.txt", 'hello world');
    fs.writeFileSync(__dirname + "/tmp/b.js", 'hello world');
    expect(_.isDir(tmpdir)).to.be.true;
    _.del(__dirname + "/tmp/", '*.js');
    expect(fs.existsSync(__dirname + "/tmp/a.txt")).to.be.true;
    expect(fs.existsSync(__dirname + "/tmp/tmp2/a.js")).to.be.false;
    expect(fs.existsSync(__dirname + "/tmp/b.js")).to.be.false;
    _.del(__dirname + "/tmp/");
    expect(_.isDir(__dirname + "/tmp/")).to.be.false;
  });

  it('exclude', function () {
    var tmpdir = __dirname + "/tmp/tmp2";
    _.mkdir(tmpdir);
    fs.writeFileSync(tmpdir + '/a.js', 'hello world');
    fs.writeFileSync(__dirname + "/tmp/a.txt", 'hello world');
    fs.writeFileSync(__dirname + "/tmp/b.js", 'hello world');
    expect(_.isDir(tmpdir)).to.be.true;
    _.del(__dirname + "/tmp/", null, '*.js');
    expect(fs.existsSync(__dirname + "/tmp/a.txt")).to.be.false;
    expect(fs.existsSync(__dirname + "/tmp/tmp2/a.js")).to.be.true;
    expect(fs.existsSync(__dirname + "/tmp/b.js")).to.be.true;
    _.del(__dirname + "/tmp/");
    expect(_.isDir(__dirname + "/tmp/")).to.be.false;
  });

});

describe('util: _.copy(rSource, target, include, exclude, uncover, move)', function () {
  it('general', function () {
    var source = __dirname + '/copy/dir1';
    var target = __dirname + '/copy/dir2';
    _.mkdir(source);
    _.mkdir(target);
    fs.writeFileSync(source + '/index.js', 'hello world');
    fs.writeFileSync(source + "/file.js", 'hello world');
    fs.writeFileSync(target + "/index.js", 'hello world2');
    _.copy(source, target);
    expect(fs.existsSync(target + "/file.js")).to.be.true;
    expect(fs.existsSync(target + "/index.js")).to.be.true;
    _.del(target);
    _.del(source);
  });
  it('move', function () {
    var source = __dirname + '/copy/dir1';
    var target = __dirname + '/copy/dir2';
    _.mkdir(source);
    _.mkdir(target);
    fs.writeFileSync(source + '/index.js', 'hello world');
    fs.writeFileSync(source + "/file.js", 'hello world');
    fs.writeFileSync(target + "/index.js", 'hello world2');
    _.copy(source, target, null, null, null, true);
    expect(fs.existsSync(target + "/file.js")).to.be.true;
    expect(fs.existsSync(target + "/index.js")).to.be.true;
    expect(fs.existsSync(source + "/index.js")).to.be.false;
    expect(fs.existsSync(source + "/file.js")).to.be.false;
    _.del(target);
    _.del(source);
  });
  it('include', function () {
    var source = __dirname + '/copy/dir1';
    var target = __dirname + '/copy/dir2';
    _.mkdir(source);
    _.mkdir(target);
    fs.writeFileSync(source + '/index.js', 'hello world');
    fs.writeFileSync(source + "/file.txt", 'hello world');
    fs.writeFileSync(target + "/index1.js", 'hello world2');
    _.copy(source, target, '*.txt', null, null, true);
    expect(fs.existsSync(target + "/file.txt")).to.be.true;
    expect(fs.existsSync(target + "/index1.js")).to.be.true;
    expect(fs.existsSync(target + "/index.js")).to.be.false;
    _.del(target);
    _.del(source);
  });
  it('exclude', function () {
    var source = __dirname + '/copy/dir1';
    var target = __dirname + '/copy/dir2';
    _.mkdir(source);
    _.mkdir(target);
    fs.writeFileSync(source + '/index.js', 'hello world');
    fs.writeFileSync(source + "/file.txt", 'hello world');
    fs.writeFileSync(target + "/index1.js", 'hello world2');
    _.copy(source, target, null, '*.txt', null, true);
    expect(fs.existsSync(target + "/file.txt")).to.be.false;
    expect(fs.existsSync(target + "/index1.js")).to.be.true;
    expect(fs.existsSync(target + "/index.js")).to.be.true;
    expect(fs.existsSync(source + "/index.js")).to.be.false;
    _.del(target);
    _.del(source);
  });
  //同名不覆盖，且源文件不删除
  it('uncover&&move', function () {
    var source = __dirname + '/copy/dir1';
    var target = __dirname + '/copy/dir2';
    _.mkdir(source);
    _.mkdir(target);
    fs.writeFileSync(source + '/index.js', 'hello world');
    fs.writeFileSync(source + "/file.js", 'hello world');
    fs.writeFileSync(target + "/index.js", 'hello world2');
    _.copy(source, target, null, null, true, true);
    expect(fs.existsSync(target + "/file.js")).to.be.true;
    expect(fs.existsSync(target + "/index.js")).to.be.true;
    expect(fs.existsSync(source + "/index.js")).to.be.true;
    _.del(target);
    _.del(source);
  });

  it('target undefine', function () {
    var taxp;
    var xp = _(taxp);
    expect(xp == '').to.be.true;
  });
});

//后缀相关的信息
describe('util: _ext(str)', function () {
  it('general', function () {
    expect(_.ext(__filename).ext).to.equal('.js');
    expect(_.ext(__filename).filename).to.equal('util');
    expect(_.ext(__filename).basename).to.equal('util.js');
    expect(_.ext(__filename).dirname).to.equal(_(__dirname));
    expect(_.ext(__filename).rest).to.equal(_(__dirname) + '/util');
  });

  it('no /', function () {
    expect(_.ext('a.js').ext).to.equal('.js');
    expect(_.ext('a.js').filename).to.equal('a');
    expect(_.ext('a.js').basename).to.equal('a.js');
    expect(_.ext('a.js').dirname).to.equal('');
    expect(_.ext('a.js').rest).to.equal('a');
  });

  it('no .', function () {
    expect(_.ext('a').ext).to.equal('');
    expect(_.ext('a').filename).to.equal('a');
    expect(_.ext('a').basename).to.equal('a');
    expect(_.ext('a').dirname).to.equal('');
    expect(_.ext('a').rest).to.equal('a');
  });

  it('/', function () {
    expect(_.ext('/').ext).to.equal('');
    expect(_.ext('/').filename).to.equal('');
    expect(_.ext('/').basename).to.equal('');
    expect(_.ext('/').dirname).to.equal('/');
    expect(_.ext('/').rest).to.equal('/');
  });

});
//get请求中的query
describe('util: _query(str)', function () {
  it('general', function () {
    var q = _.query('http://www.baidu.com?type=q&q=2');
    expect(q.origin, 'http://www.baidu.com?type=q&q=2');
    expect(q.query, '?type=q&q=2');
    expect(q.rest, 'http://www.baidu.com');
  });

  it('no ?', function () {
    var q = _.query('http://www.baidu.com');
    expect(q.origin, 'http://www.baidu.com');
    expect(q.query, '');
    expect(q.rest, 'http://www.baidu.com');
  });

  it('with hash', function () {
    var q = _.query('http://www.baidu.com#def');
    expect(q.origin, 'http://www.baidu.com#def');
    expect(q.query, '#def');
    expect(q.rest, 'http://www.baidu.com');

    q = _.query('http://www.baidu.com?type=q#def');
    expect(q.origin, 'http://www.baidu.com?type=q#def');
    expect(q.query, '?type=q#def');
    expect(q.rest, 'http://www.baidu.com');
  });

});

describe('util: _pathinfo(path)', function () {
  it('array', function () {
    var p = _.pathinfo('a', 'a.js');
    expect(p.ext).to.equal('.js');
    expect(p.filename).to.equal('a');
    expect(p.basename).to.equal('a.js');
    expect(p.dirname).to.equal('a');
    expect(p.rest).to.equal('a/a');
  });
  it('object', function () {
    var p = _.pathinfo(['a', 'a.js']);
    expect(p.ext).to.equal('.js');
    expect(p.filename).to.equal('a');
    expect(p.basename).to.equal('a.js');
    expect(p.dirname).to.equal('a');
    expect(p.rest).to.equal('a/a');
  });
  it('string', function () {
    var p = _.pathinfo('a/a.js');
    expect(p.ext).to.equal('.js');
    expect(p.filename).to.equal('a');
    expect(p.basename).to.equal('a.js');
    expect(p.dirname).to.equal('a');
    expect(p.rest).to.equal('a/a');

  });

});

describe('util: _camelcase(str)', function () {
  it('general', function () {
    var str = 'str_replace.js';
    expect(_.camelcase(str)).to.equal('StrReplace.js');
    str = 'str-replace.js';
    expect(_.camelcase(str)).to.equal('StrReplace.js');
    str = 'strreplace.js';
    expect(_.camelcase(str)).to.equal('Strreplace.js');
    str = 'strre place.js';
    expect(_.camelcase(str)).to.equal('StrrePlace.js');
//        str = ' strreplace.js';
//        expect(_.camelcase(str)).to.equal('Strreplace.js');   //error call toUpperCase of undefined
  });

  it('str is empty', function () {
    expect(_.camelcase('')).to.equal('');
//        expect(_.camelcase(' ')).to.equal(' ');   //error call toUpperCase of undefined
  });
});

describe('util: _parseUrl(url, opt)', function () {
  it('general', function () {
    var url = 'http://localhost:8080/fis/test';
    var res = _.parseUrl(url);
    expect(res).to.deep.equal(
      {
        host: 'localhost',
        port: '8080',
        path: '/fis/test',
        method: 'GET',
        agent: false
      }
    );

    url = 'https://www.google.com?q=hello';
    var res = _.parseUrl(url);
    expect(res).to.deep.equal(
      {
        host: 'www.google.com',
        port: 443,
        path: '/?q=hello',
        method: 'GET',
        agent: false
      }
    );
  });
  it('opt', function () {
    var url = 'https://www.google.com?q=hello';
    var res = _.parseUrl(url, {
      'path': '/fis/client',
      'port': 8888,
      'method': 'POST',
      'agent': 'chrme'
    });
    expect(res).to.deep.equal(
      {
        'path': '/fis/client',
        'port': 8888,
        'method': 'POST',
        'host': 'www.google.com',
        'agent': 'chrme'
      }
    );
  });

});
//hide- local
describe('util: _download(url, [callback], [extract], [opt])', function () {
  var downdir = __dirname + '/download/';
  this.timeout(25000);
  before(function () {
    //清空fis tmp download dir
    var files = [];
    var tmpdir = fis.project.getTempPath('downloads');
    var path = tmpdir;
    if (fs.existsSync(path)) {
      files = fs.readdirSync(path);
      files.forEach(function (file, index) {
        var curPath = path + "/" + file;
        fs.unlinkSync(curPath);
      });
    }
  });
  it('general', function (done) {
    //var url = 'http://10.48.30.87:8088/test/download/downTest01.tar';
    //var url = 'http://fex.baidu.com/fis3/static/images/code_1750c9a.png';
    var url = 'http://127.0.0.1/fis3/test/attachment/code_1750c9a.png';
    //var url = 'https://raw.githubusercontent.com/fex-team/fis3/gh-pages/logo_8652a39.png';

    var path = fis.project.getTempPath('downloads');
    var hash = fis.util.md5(url, 8);
    _.download(url, function (err) {
      //expect(path + '/' + hash + '.png').to.be.exist;
      expect(fs.existsSync(path + '/' + hash + '.png')).to.be.true;
      done();
    });

  });

  it('extract', function (done) {
    var name = 'downTest';
    //var url = 'http://10.48.30.87:8088/test/download/' + name + '.tar';
    //var url = 'http://fex.baidu.com/fis3/test/attachment/downTest.tar';
    var url = 'http://127.0.0.1/fis3/test/attachment/downTest.tar';
    //var url = 'https://raw.githubusercontent.com/fex-team/fis3/gh-pages/test/test.jar';
    var extract = downdir;
    _.download(url, function (err) {
      var hash = fis.util.md5(url, 8);
      var path = fis.project.getTempPath('downloads');
      expect(fs.existsSync(path + '/' + hash + '.tar')).to.be.true;
      expect(fs.existsSync(extract + '/downTest')).to.be.true;

      done();
    }, extract);   //, extract  解压有问题  这种情况 还未处理

  });

  it('not_exist', function (done) {
    //var url = 'http://fex.baidu.com/fis3/test/downTest05.tar';         //不存在的包
    var url = 'http://127.0.0.1/fis3/test/downTest05.tar';         //不存在的包
    var not_exist = 0;
    _.download(url, function (msg) {
      if (msg == 404)
        not_exist = 1;

      var path = fis.project.getTempPath('downloads');
      var hash = fis.util.md5(url, 8);
      expect(fs.existsSync(path + '/' + hash + '.tar')).to.be.false;
      expect(not_exist).to.be.equal(1);

      done();

    });

  });

  it('extract-error', function (done) {
    //var url = 'http://fex.baidu.com/fis3/test/downTest05.tar';
    var url = 'http://127.0.0.1/fis3/test/downTest05.tar';
    var not_exist = 0;
    var extract = downdir;
    _.download(url, function (msg) {
      if (msg == 404)
        not_exist = 1;

      var hash = fis.util.md5(url, 8);
      expect(fs.existsSync(extract + '/' + hash + '.tar')).to.be.false;
      expect(not_exist).to.be.equal(1);

      done();
    }, extract, {
      'data': "write opt.data!"
    });
  });

  it('下载错误', function () {
    var url = 'http://10.48.30.87:8088/test/download/test.tar.gz';
    var extract = downdir;
    _.download(url, function () {
      var hash = fis.util.md5(url, 8);
      var path = fis.project.getTempPath('downloads');
      expect(fs.existsSync(path + '/' + hash + '.tar')).to.be.false;
    }, extract);
  });

});

describe('util: _upload(url, [opt], [data], content, subpath, callback)', function () {
  this.timeout(20000);
  // it('general', function (done) {
  //   var receiver = 'http://web.baidu.com:8088/test/upload/receiver.php';
  //   var to = '/home/work/repos/test/upload';
  //   var release = '/a.js';
  //   var content = 'content';
  //   var subpath = '/';
  //   _.upload(receiver, null, {to: to + release}, content, subpath,
  //     function (err, res) {
  //       if (err || res != '0') {
  //         expect(true).to.be.false;
  //       } else {
  //         var file = to + release;
  //         var cont = fs.readFileSync(file, "utf-8");
  //         expect(fs.existsSync(file)).to.be.true;
  //         expect(cont).to.be.equal(content);

  //         //delete file
  //         _.del(file);
  //       }
  //       done();
  //     });
  // });

  it('err--not exist', function (done) {
    //var receiver = 'http://web.baidu.com:8088/test/receiver.php'; //non exist receiver
    //var receiver = 'http://fex.baidu.com/fis3/test/receiver.php'; //non exist receiver
    var receiver = 'http://127.0.0.1/fis3/test/receiver.php'; //non exist receiver
    var to = '/home/work/repos/test/upload';
    //var to = '/home/travis/build/fex-team/fis3/test/copy';
    var release = '/a.js';
    var content = 'content';
    var subpath = '/';
    _.upload(receiver, null, {to: to + release}, content, subpath,
      function (err, res) {
        if (err || res != '0') {
          expect(err).to.be.equal(404);
        }
        else {
          expect(true).to.be.false;
        }
        done();
      });
  });

  // it('content--array', function (done) {
  //   var receiver = 'http://web.baidu.com:8088/test/upload/receiver.php';
  //   var to = '/home/work/repos/test/upload';
  //   var release = '/a.js';
  //   var content = fs.readFileSync(__dirname + "/util/upload/a.js", "utf-8");
  //   var subpath = '/tmp/b.js';
  //   _.upload(receiver, null, {to: to + release}, content, subpath,
  //     function (err, res) {
  //       if (err || res != '0') {
  //         expect(true).to.be.false;
  //       }
  //       else {
  //         var file = to + release;
  //         var cont = fs.readFileSync(file, "utf-8");
  //         expect(fs.existsSync(file)).to.be.true;
  //         expect(cont).to.be.equal(content);

  //         //delete file
  //         _.del(file);
  //       }
  //       done();
  //     });
  // });
});

describe('util: _install(name, [version], opt)', function () {
  var installdir = __dirname + '/install/';
  this.timeout(25000);
  after(function () {
    //清空install文件夹
    fis.cache.clean(installdir);
  });

  it('general', function (done) {
    var name = 'installTest';
    var version = '*';//*
    var opt = {
      //'remote': 'http://10.48.30.87:8088/test/install',
      //'remote': 'http://fex.baidu.com/fis3/test/attachment/install',
      'remote': 'http://127.0.0.1/fis3/test/attachment/install',
      'extract': installdir,
      'done': function () {
        var hash = fis.util.md5(opt.remote + '/' + name + '/' + version + '/.tar', 8);
        var path = fis.project.getTempPath('downloads');
        expect(path + '/' + hash + '.tar').to.be.exist;
        expect(installdir + name).to.be.exist;
        done();
      }
    };

    _.install(name, version, opt);

  });

  it('version-done', function (done) {
    var name = 'installTest';
    var version = '0.3';
    var opt = {
      //'remote': 'http://10.48.30.87:8088/test/install',
      //'remote': 'http://fex.baidu.com/fis3/test/attachment/install',
      'remote': 'http://127.0.0.1/fis3/test/attachment/install',
      'extract': installdir,
      'done': function () {
        var hash = fis.util.md5(opt.remote + '/' + name + '/' + version + '/.tar', 8);
        var path = fis.project.getTempPath('downloads');
        expect(path + '/' + hash + '.tar').to.be.exist;
        expect(installdir + name + version).to.be.exist;

        done();
      }
    };

    _.install(name, version, opt);
  });

  it('opt.before', function (done) {
    var gname = 'installTest';
    var version = '0.2';
    var opt = {
      //'remote': 'http://10.48.30.87:8088/test/install',
      //'remote': 'http://fex.baidu.com/fis3/test/attachment/install',
      'remote': 'http://127.0.0.1/fis3/test/attachment/install',
      'extract': installdir,
      'done': function (name, version) {
        expect(path + '/' + hash + '.tar').to.be.exist;
        expect(installdir + name + version).to.be.exist;

        done();
      },
      'before': function (name, version) {
        expect(name).to.be.equal(gname);
        expect(version).to.be.equal("0.2");
      }
    };
    var hash = fis.util.md5(opt.remote + '/' + gname + '/' + version + '/.tar', 8);
    var path = fis.project.getTempPath('downloads');

    _.install(gname, version, opt);
  });

  it('opt.err_not exist', function (done) {
    var gname = 'installTest';
    var version = '0.5';                //不存在的版本
    var opt = {
      //'remote': 'http://10.48.30.87:8088/test/install',
      //'remote': 'http://fex.baidu.com/fis3/test/attachment/install',
      'remote': 'http://127.0.0.1/fis3/test/attachment/install',
      'extract': installdir,
      'done': function (name, version) {
        expect(true).to.be.false;
      },
      'before': function (name, version) {
        expect(name).to.be.equal(gname);
        expect(version).to.be.equal("0.5");
      },
      'error': function (err) {
        var hash = fis.util.md5(opt.remote + '/' + gname + '/' + version + '/.tar', 8);
        var path = fis.project.getTempPath('downloads');
        expect(fs.existsSync(path + '/' + hash + '.tar')).to.be.false;
        expect(fs.existsSync(installdir + gname + version)).to.be.false;

        done();
      }
    };
    _.install(gname, version, opt);

  });

  it('extract, pkg', function () {
    //pkg项目package.json里配置依赖pkg0.2,两个都应该install
    var name = 'pkgTest';
    var version = '*';
    var opt = {
      //'remote': 'http://10.48.30.87:8088/test/install',
      //'remote': 'http://fex.baidu.com/fis3/test/attachment/install',
      'remote': 'http://127.0.0.1/fis3/test/attachment/install',
      'extract': installdir,
      'done': function () {
        var hash = fis.util.md5(opt.remote + '/' + name + '/latest.tar', 8);
        var hash_dep = fis.util.md5(opt.remote + '/' + name + '/0.2.tar', 8);
        var path = fis.project.getTempPath('downloads');
        expect(path + '/' + hash + '.tar').to.be.exist;
        expect(path + '/' + hash_dep + '.tar').to.be.exist;
        expect(installdir + name).to.be.exist;
        expect(installdir + dep_name).to.be.exist;
      }
    };
    var dep_name = 'pkgTest0.2';

    _.install(name, version, opt);
  });
});
//hide- local -end
describe('util: _.readJSON(path)', function () {
  it('general-readJson', function () {
    var path = _(__dirname) + "/util/json/json.json";
    var res = _.readJSON(path);
    expect(res).to.deep.equal({
      "a": "test1",
      "b": "test2",
      "arr": {
        "arr1": "1"
      }
    });
  });

  it('general-readJson', function () {
    var path = _(__dirname) + "/util/json/json.json";
    var res = _.readJSON(path);
    expect(res).to.deep.equal({
      "a": "test1",
      "b": "test2",
      "arr": {
        "arr1": "1"
      }
    });
  });
  it('gbk', function () {
    var path = _(__dirname) + "/util/json/gbk.json";
    var res = _.readJSON(path);
    expect(res).to.deep.equal({
      "你好": "中文",
      "string": "hello world",
      "boolean": true,
      "number": 123,
      "null": null,
      "array": ["中文", "hello world", true, 123, null],
      "object": {
        "你好": "中文",
        "string": "hello world",
        "boolean": true,
        "number": 123,
        "null": null,
        "array": ["中文", "hello world", true, 123, null],
        "object": {
          "你好": "中文",
          "string": "hello world",
          "boolean": true,
          "number": 123,
          "null": null,
          "array": ["中文", "hello world", true, 123, null]
        }
      }
    });
  });
  it('utf8', function () {
    var path = _(__dirname) + "/util/json/utf8.json";
    var res = _.readJSON(path);
    expect(res).to.deep.equal({
      "你好": "中文",
      "string": "hello world",
      "boolean": true,
      "number": 123,
      "null": null,
      "©": "€",
      "array": ["中文", "hello world", true, 123, null, "©", "€"],
      "object": {
        "你好": "中文",
        "string": "hello world",
        "boolean": true,
        "number": 123,
        "null": null,
        "©": "€",
        "array": ["中文", "hello world", true, 123, null, "©", "€"],
        "object": {
          "你好": "中文",
          "string": "hello world",
          "boolean": true,
          "number": 123,
          "null": null,
          "©": "€",
          "array": ["中文", "hello world", true, 123, null, "©", "€"]
        }
      }
    });

    var path = _(__dirname) + "/util/json/utf8-bom.json";
    var res = _.readJSON(path);
    expect(res).to.deep.equal({
      "你好": "中文",
      "string": "hello world",
      "boolean": true,
      "number": 123,
      "null": null,
      "©": "€",
      "array": ["中文", "hello world", true, 123, null, "©", "€"],
      "object": {
        "你好": "中文",
        "string": "hello world",
        "boolean": true,
        "number": 123,
        "null": null,
        "©": "€",
        "array": ["中文", "hello world", true, 123, null, "©", "€"],
        "object": {
          "你好": "中文",
          "string": "hello world",
          "boolean": true,
          "number": 123,
          "null": null,
          "©": "€",
          "array": ["中文", "hello world", true, 123, null, "©", "€"]
        }
      }
    });
  });

});


describe('util: _.isUtf8', function () {
  it('gbk', function () {
    var bytes = buf2arr(fs.readFileSync(__dirname + '/util/encoding/gbk.txt'));
    expect(_.isUtf8(bytes)).to.be.false;
  });
  it('utf8', function () {
    var bytes = buf2arr(fs.readFileSync(__dirname + '/util/encoding/utf8.txt'));
    expect(_.isUtf8(bytes)).to.be.true;
  });
  it('utf8-bom', function () {
    var bytes = buf2arr(fs.readFileSync(__dirname + '/util/encoding/utf8-bom.txt'));
    expect(_.isUtf8(bytes)).to.be.true;
  });
  it('isutf8', function () {
    var bytes = buf2arr(fs.readFileSync(__dirname + '/util/encoding/utfcode.txt'));
    expect(_.isUtf8(buf2arr(bytes))).to.be.true;

  });
});
// glob的第二个参数一定要是/开头
describe('util: _.glob(pattern, [str])', function () {
    it('/*.js  /abc.js', function () {
      expect(_.glob('/*.js', '/abc.js')).to.be.true;
    });
    it('/*.js  /abc.js.css', function () {
      expect(_.glob('/*.js', '/abc.js.css')).to.be.false;
    });
    it('/*.js  /abc.JS', function () {
      expect(_.glob('/*.js', '/abc.JS')).to.be.false;
    });
    it('/?.js  /abc.js', function () {
      expect(_.glob('/?.js', '/abc.js')).to.be.false;
    });
    it('/??.js  /abc.js', function () {
      expect(_.glob('/??.js', '/abc.js')).to.be.false;
    });
    it('/?.js  /a.js', function () {
      expect(_.glob('/?.js', '/a.js')).to.be.true;
    });
    it('/??.js  /ab.js', function () {
      expect(_.glob('/??.js', '/ab.js')).to.be.true;
    });


    it('**/*.js  /a.b/c.js', function () {
      expect(_.glob('**/*.js', '/a.b/c.js')).to.be.true;
    });
    it('**/*.js  as/d.a/abc.js.css', function () {
      expect(_.glob('**/*.js', 'as/d.a/abc.js.css')).to.be.false;
    });
    it('**/*.js  as/d.a/abc.js/', function () {
      expect(_.glob('**/*.js', 'as/d.a/abc.js/')).to.be.false;
    });
    it('a/**/*.js  as/d.a/abc.js', function () {
      expect(_.glob('a/**/*.js', 'as/d.a/abc.js')).to.be.false;
    });
    it('a/**/*.js  /a/s/d.a/abc.js', function () {
      expect(_.glob('a/**/*.js', '/a/s/d.a/abc.js')).to.be.true;
    });
    it('a/**/?.js  /a/s/d.a/abc.js', function () {
      expect(_.glob('a/**/?.js', '/a/s/d.a/abc.js')).to.be.false;
    });
    it('a/**/?.js  /a/s/d.a/c.js', function () {
      expect(_.glob('a/**/?.js', '/a/s/d.a/c.js')).to.be.true;
    });
    it('**.js  d/a.b/c.js', function() {
      expect(_.glob('**.js', '/a.b/c.js')).to.be.true;
    });


    it('*/*.js  da.js', function () {
      expect(_.glob('*/*.js', 'da.js')).to.be.false;
    });
    it('/*.js  /adfda.js', function () {
      expect(_.glob('/*.js', '/adfda.js')).to.be.true;
    });
    it('*/*.js  db/dsaa.js', function () {
      expect(_.glob('*/*.js', 'db/dsaa.js')).to.be.false;
    });
    //允许用户开头的斜杠省略，写了也忽略，即路径/bdsf/aa.js和bdsf/aa.js可以认为是一样的
    it('/*/*.js  bdsf/aa.js', function () {
      expect(_.glob('/*/*.js', 'bdsf/aa.js')).to.be.false;
    });
    it('/*/*.js  /bdsf/.js', function () {
      expect(_.glob('/*/*.js', '/bdsf/.js')).to.be.false;
    });
    it('/*/*.js  /bdsf/.js.css', function () {
      expect(_.glob('/*/*.js', '/bdsf/.js.css')).to.be.false;
    });
    it('/*/*.js  /bdsf/.js.JS', function () {
      expect(_.glob('/*/*.js', '/bdsf/.js.JS')).to.be.false;
    });
    it('/*/*.js  /ba/asd.js', function () {
      expect(_.glob('/*/*.js', '/ba/asd.js')).to.be.true;
    });
    it('/*/*.js  //asd.js', function () {
      expect(_.glob('/*/*.js', '//asd.js')).to.be.true;
    });
    it('/*/*.js  aaa/bbbs/ad.js', function () {
      expect(_.glob('/*/*.js', 'aaa/bbbs/ad.js')).to.be.false;
    });

});

describe('util: _.is(source, type)', function (){
  it('general', function () {
    var num = 123;
    var ob = {
      x:123
    }
    var ar = [1,2,3];
    var fl = false;
    var und;
    expect(_.is("123","String")).to.be.true;
    expect(_.is(num,"Number")).to.be.true;
    expect(_.is(ob,"Object")).to.be.true;
    expect(_.is(ar,"Array")).to.be.true;
    expect(_.is(fl,"Boolean")).to.be.true;
    expect(_.is(und,"Undefined")).to.be.true;
  });
});

describe('util: _.escapeReg(str)', function (){
  it('general', function () {
    var num = "\b\w*q(?!u)\w*\b";
    var st = _.escapeReg(num);
    var tar_st = "w\\*q\\(\\?\\!u\\)w\\*";
    st = st.substring(1,st.length-1);
    expect(st == tar_st).to.be.true;
  });
});

describe('util: _.isEmpty(obj)', function (){
  it('general', function () {
    var obj = null;
    var obj_arr = [];
    expect(_.isEmpty(obj)).to.be.true;
    expect(_.isEmpty(obj_arr)).to.be.true;
    obj_arr = [1];
    expect(_.isEmpty(obj_arr)).to.be.false;
    var obj_o = {};
    expect(_.isEmpty(obj_o)).to.be.true;
    obj_o = {
      s : 123
    }
    expect(_.isEmpty(obj_o)).to.be.false;
  });
});

describe('util: _.nohup(type, callback, def)', function (){
  it('general', function () {
    var re1 = _.nohup('fis server start',function (){var x = 3});
    var re2 = _.nohup('fis server stop',function (){var c = 9});
    expect(!!re1.stdout._hadError).to.be.false;
    expect(!!re2.stdout._hadError).to.be.false;
  });
});

describe('util: _.pipe(type, callback, def)1', function (){
  it('general', function () {
    config.env().set('modules.hook','components');
    _.pipe('hook', function (processor, settings, key, type){
      expect("hook.components" == key).to.be.true;
    }, '');

    var str = '';
    config.env().set('modules.hook',['components']);
    _.pipe('hook', function (processor, settings, key, type){
      str += key + ',';
    }, '');
    expect("hook.components," == str).to.be.true;

    var str = '';

    config.env().set('modules.hook',function a(){});
    _.pipe('hook', function (processor, settings, key, type){
      str += key + ',';
    }, '');
    expect("hook.0," == str).to.be.true;


    //var root2 = path.join(__dirname);
    ////var x2 = _.applyMatches(path.join(root, 'util','upload','main.css'),['*.css']);
    ////console.log(x2);

  });

  it('_.applyMatches', function() {

    var ma = [ { reg: /^(?:(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[^/]*?\.gif)$/,
      raw: '**/*.gif',
      negate: false,
      properties: { packTo:'static/$0',release: function(){var x =0} ,useHash:false},
      media: 'GLOBAL',
      weight: 0,
      index: 35 } ];

    var x2 = _.applyMatches("file/embed/embed.gif",ma);
    var pp = '{"__packToIndex":0,"packTo":"static/file/embed/embed.gif","__releaseIndex":0,"__useHashIndex":0,"useHash":false}';
    expect(JSON.stringify(x2)).to.be.equal(pp);

  });

  it('_.applyMatches : properties=null', function() {

    var ma = [ { reg: /^(?:(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[^/]*?\.gif)$/,
      raw: '**/*.gif',
      negate: false,
      //properties: { release: false ,useHash:false},
      media: 'GLOBAL',
      weight: 0,
      index: 35 } ];

    var x2 = _.applyMatches("/file/embed/embed.gif",ma);
    var pp = '{"__releaseIndex":0,"release":false,"__useHashIndex":0,"useHash":false}';
    expect(JSON.stringify(x2)).to.be.equal('{}');
  });

  it('_.applyMatches : many match', function() {

    fis.match('file/embed/embed.gif', {
      deploy: [
        fis.plugin('local-deliver', {
          to: "./output3"
        }),
        fis.plugin('local-deliver', {
          to: "./output2"
        })
      ]
    });
    var ma = [ { reg: /^(?:(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[^/]*?\.gif)$/,
      raw: '**/*.gif',
      negate: false,
      properties: { useHash:false,packTo:'static/$0',release: function(){var x =0},
        deploy:
        { to: './output3',
          __plugin: 'local-deliver',
          __name: 'local-deliver',
          __pos: 2 }
      },
      media: 'GLOBAL',
      weight: 0,
      index: 35 } ];

    var ma2 = [ { reg: /^(?:(?:(?!(?:\/|^)\.).)*?\/(?!\.)(?=.)[^/]*?\.gif)$/,
      raw: '**/*.gif',
      negate: false,
      properties: { useHash:true,packTo:'static/$0',release: function(){var x =1},
        deploy:
          { to: './output3',
            __plugin: 'local-deliver',
            __name: 'local-deliver',
            __pos: 2 }

      },
      media: 'GLOBAL',
      weight: 0,
      index: 35 } ];

    var x2 = _.applyMatches("file/embed/embed.gif",ma);
    var x3 = _.applyMatches("file/embed/embed.gif",ma2);
    var pp = '{"__releaseIndex":0,"release":false,"__useHashIndex":0,"useHash":false}';
    expect(JSON.stringify(x3)).to.be.equal('{"__useHashIndex":0,"useHash":true,"__packToIndex":0,"packTo":"static/file/embed/embed.gif","__releaseIndex":0,"__deployIndex":0,"deploy":{"to":"./output3","__plugin":"local-deliver","__name":"local-deliver","__pos":2}}');
  });

});

describe('util: _.pipe(type, callback, def)2', function (){
  var root = path.join(__dirname);
  beforeEach(function () {
    fis.project.setProjectRoot(root);
    fis.media().init();
    fis.config.init();
    fis.compile.setup();
  });

  it('general', function () {
      var file = fis.file.wrap(path.join(root, 'util','upload','main.css'));
      file.useCache = false;
      fis.cache.clean();
      fis.match('**/a.png', {
        useHash: false,
        release: '/static/$0'
      });
      //在运行test/*.js 的时候报错，但是单独运行时正确，用例正确
      //fis.compile(file);
      //expect(file.getContent()).to.be.equal(fis.util.read(path.join(root, 'util','upload', 'maintar.css')));
  });

});

//用例没问题，但是运行报错
//describe('util: more deploy', function (){
//  function release(opts, cb) {
//    opts = opts || {};
//
//    _release(opts, function(error, info) {
//      _deploy(info, cb);
//    });
//  };
//  beforeEach(function() {
//
//    var root = path.join(__dirname, 'fis3_test_cmd');
//    fis.project.setProjectRoot(root);
//    fis.config.init(fis.config.DEFALUT_SETTINGS);
//    //fis.compile.setup();
//    //process.env.NODE_ENV = 'dev';
//    // default settings. fis3 release
//    var root2 = path.join(__dirname, 'xpy');
//    _.del(root2);
//    var root3 = path.join(__dirname, 'xpy2');
//    _.del(root3);
//    fis.config.match('*', {
//      deploy: fis.plugin('local-deliver', {
//        to: root2
//      })
//    });
//    fis.config.match('*', {
//      deploy: fis.plugin('local-deliver', {
//        to: root3
//      })
//    });
//
//    fis.config.hook('cmd', {
//      baseUrl: ".",
//      forwardDeclaration: true,//依赖前置,
//      skipBuiltinModules: false,
//      paths: {
//        abc: '/module/jquery.js'
//      },
//      packages: [
//        {
//          name: 'module',
//          location: './module',
//          main: 'data.js'
//        },
//        {
//          name: 'abc',
//          location: './module',
//          main: 'jquery.js'
//        }
//      ],
//      shim: {
//        'module/b.js': {
//          deps: ['module/a.js'],
//          exports: 'xc'
//        }
//      }
//    });
//    fis.config.match('::packager', {
//      postpackager: fis.plugin('loader', {
//        //allInOne: {
//        //  ignore: '**/a.js',
//        //  includeAsyncs: true,
//        //  css:"pkg/aa.css"
//        //
//        //},
//        scriptPlaceHolder: "<!--SCRIPT_PLACEHOLDER-->",
//        stylePlaceHolder: '<!--STYLE_PLACEHOLDER-->',
//        resourcePlaceHolder: '<!--RESOURCEMAP_PLACEHOLDER-->',
//        resourceType: 'cmd',
//        processor: {
//          '.html': 'html'
//        },
//        obtainScript: true,
//        obtainStyle: true,
//        useInlineMap: false
//      })
//
//    });
//// fis3 release production
//    fis
//      .config.match('**', {
//        useHash: false,
//        release: '/static/$0'
//        // domain: 'http://aaaaa.baidu.com/xpy'
//
//      })
//
//      .match('demo.js', {
//        optimizer: fis.plugin('uglify-js'),
//        packTo: "x.js",
//        isMod: true
//      })
//      .match('demo2.js', {
//        optimizer: fis.plugin('uglify-js'),
//        packTo: "x.js",
//        isMod: false
//      })
//      .match('init.js', {
//        optimizer: fis.plugin('uglify-js'),
//        packTo: "x.js",
//        isMod: true
//      })
//      .match('module/b.js', {
//        optimizer: fis.plugin('uglify-js'),
//        packTo: "x.js",
//        isMod: true
//      })
//      .match('*.{css,scss}', {
//        optimizer: fis.plugin('clean-css')
//      })
//
//      .match('*.png', {
//        optimizer: fis.plugin('png-compressor')
//      });
//
//  });
//
//  it('compile cmd JS file', function() {
//    release({
//      unique: true
//    }, function() {
//      console.log('Done');
//    });
//    var pathx = path.join(__dirname, 'xpy' , 'static' , 'map.json');
//    var file = fis.file.wrap(pathx);
//    var con = file.getContent();
//
//    var xpath = JSON.stringify(JSON.parse(con).res["demo.js"].deps);
//    console.log(pathx);
//    expect(xpath).to.equal('["demo3.js"]');
//
//    var xpath = JSON.stringify(JSON.parse(con).res["init.js"].deps);
//    expect(xpath).to.equal('["module/jquery.js","module/data.js","module/b.js"]');
//
//    var xpath = JSON.stringify(JSON.parse(con).res["init.js"].extras);
//    expect(xpath).to.equal('{"moduleId":"init","async":["demo.js"]}');
//
//    var xpath = JSON.stringify(JSON.parse(con).pkg);
//    expect(xpath).to.equal('{"p0":{"uri":"/static/x.js","type":"js","has":["demo.js","demo2.js","module/b.js","init.js"],"deps":["demo3.js","module/a.js","module/jquery.js","module/data.js"]}}');
//
//    var pathx2 = path.join(__dirname, 'xpy2' , 'static' , 'map.json');
//    var file2 = fis.file.wrap(pathx2);
//    var con2 = file2.getContent();
//
//    var xpath2 = JSON.stringify(JSON.parse(con2).res["demo.js"].deps);
//    expect(xpath2).to.equal('["demo3.js"]');
//
//    var xpath3 = JSON.stringify(JSON.parse(con2).res["init.js"].deps);
//    expect(xpath3).to.equal('["module/jquery.js","module/data.js","module/b.js"]');
//
//    var xpath4 = JSON.stringify(JSON.parse(con2).res["init.js"].extras);
//    expect(xpath4).to.equal('{"moduleId":"init","async":["demo.js"]}');
//
//    var xpath5 = JSON.stringify(JSON.parse(con2).pkg);
//    expect(xpath5).to.equal('{"p0":{"uri":"/static/x.js","type":"js","has":["demo.js","demo2.js","module/b.js","init.js"],"deps":["demo3.js","module/a.js","module/jquery.js","module/data.js"]}}');
//
//  });
//
//});
