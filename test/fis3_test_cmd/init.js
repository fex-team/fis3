define(function(require, exports, module) {
      // var $ = require('./module/jquery.js');
      var $ = require("abc");
      var data = require('module');
      var b  = require('module/b');
      require.async('demo', function(m) {
        console.log("123");
      });
      //require.async('demo3', function(m) {
      //  console.log("123");
      //});
      b();
      $('.author').html(data.author);
      $('.blog').attr('href', data.blog);
});
