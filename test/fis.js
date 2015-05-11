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
	it('general', function() {

	})
});