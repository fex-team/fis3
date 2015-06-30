/* global fis */

fis.media('prod').match('*', {
  domain: '/fis3-doc'
});

fis.match('docs/**.md', {
  parser: markdownParse(),
  useDomain: true,
  rExt: '.html'
});

fis.match('docs/INDEX.md', {
  useCache: false,
  release: '/docs/index.html'
});

function markdownParse(settings) {
  var layout = fis.file(__dirname + '/page/layout.html');
  
  function wrapper(content) {
    return layout.getContent().replace('{{content}}', content);
  }

  return function (content, file, settings) {
    var marked = require('marked');
    var renderer = new marked.Renderer();
    var links = [];
  
    renderer.heading = function(text, level) {
      var link = {};
      link.text = text;
      link.level = level;
      var escapedText = encodeURI(text);
  
      links.push(link);
  
      if (level != 1) level += 1;
      return '<h' + level + ' class="' + (level == 1 ? 'page-header' : '') +
        (level == 3 ? '" id="' + text : '') +
        '"><a name="' +
        escapedText +
        '" href="#' +
        escapedText +
        '">'+ text + '</a>' +
        '</h' + level + '>';
    };
  
  
    renderer.link = function(href, title, text) {
      var out = '<a href="' + href + '"';

      if (href.indexOf('http') != 0) {
        var hash = '';
        var p;
        if ((p = href.indexOf('#')) > 0) {
          hash = href.substr(p);
          href = href.substr(0, p);
        }
        if (/\.md$/.test(href)) {
          //console.log(fis.compile.lang.uri.ld);
          href = fis.compile.lang.uri.ld + href + fis.compile.lang.uri.rd + encodeURI(hash);
        } else {
          href = encodeURI(href+hash);
        }
        out = '<a href="' + href + '"';
      }
  
      if (title) {
        out += ' title="' + title + '"';
      }
  
      out += '>' + text + '</a>';
      return out;
    };
  
    marked.setOptions({
      renderer: renderer,
      highlight: function(code) {
        return require('highlight.js').highlightAuto(code).value;
      },
      langPrefix: 'hljs lang-',
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false
    });
  
    content = marked(content);
    
    return wrapper(content);
  };
}
