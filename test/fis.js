/**
 * Create By Sublime
 * Author: qihongye
 * Date: 15-5-11
 */

var fs = require('fs');
var fis = require('..');
var expect = require('chai').expect;

describe('fis: derive', function() {
	it('derive(constructor, proto)', function() {
		var cons = function() {
			return this.name
		}
		cons.prototype.name = 'a';
		var Class = Object.derive({
			constructor: cons
		}, {name: 'class'});

		var classA = new Class();

		expect(classA.name).to.equal('a');
		expect(classA.__proto__.name).to.equal('a')
	});
});

describe('fis: require', function() {
	it('general without cache', function() {
		expect(fis.require('command', 'init')).to.deep.equal(require('fis3-command-init'));
	});

	it('general with cache', function() {
		var init = fis.require('command', 'release');
		expect(fis.require('command', 'release')).to.deep.equal(require('fis3-command-release'));
	});
});

describe('fis: plugin', function() {
	it('general', function() {
    var x = fis.plugin('sass', {
      include_paths: [
        './static/scss/libaray'
      ]
    },'123');
    var y = fis.plugin('b', null, 'append');
		expect(x).to.deep.equal({ __name: 'sass', __plugin: 'sass',include_paths: ["./static/scss/libaray"],__pos: "123"});
		expect(y).to.deep.equal({ __name: 'b', __plugin: 'b',__pos: "append"});
    fis.time("123");
	});
});
