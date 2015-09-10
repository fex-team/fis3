var expect = require('chai').expect;
var fis = require('..');
var path = require('path');

// describe('Simple release', function () {
//   var root = path.join(__dirname, 'release', 'fixtures');
//   beforeEach(function () {
//     fis.project.setProjectRoot(root);
//     fis.media().init();
//     fis.config.init();
//     fis.compile.setup();
//   });

//   it ('release simple index.html', function () {
//     var ret;

//     fis.release(function(result) {
//       ret = result;

//     });

//     var exists = !!ret.src['/index.html'];

//       expect(ret).to.be.equals(true);
//   });
// });

// describe('Simple release with direved', function () {
//   var root = path.join(__dirname, 'release', 'fixtures');
//   beforeEach(function () {
//     fis.project.setProjectRoot(root);
//     fis.media().init();
//     fis.config.init();
//     fis.compile.setup();
//   });

//   it ('release simple index.html', function () {

//     fis.match('*.html', {
//       useCache: false,
//       parser: function(content, file) {
//         file.derived = file.derived || [];

//         var newfile = fis.file.wrap(path.join(root, 'derived.js'));
//         newfile.setContent('direved');

//         file.derived.push(newfile);

//         return content;
//       }
//     });


//     fis.release(function(ret) {
//       var exists = !!ret.src['/derived.js'];

//       expect(ret.src['/derived.js'].getContent()).to.be.equals('direved');
//       expect(exists).to.be.equals(true);
//     });
//   });
// });
