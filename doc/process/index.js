var util = require('util');
var root = fis.project.getProjectPath();

function markdownParse(settings) {
  var layout = fis.file(root + '/page/layout.html');

  function wrapper(title, content, path) {
    content += util.format(
      '<blockquote class="warning">' + 
      '<p>文档内容有误，可提 PR，文档地址: <i class="fa fa-github"></i><a href="https://github.com/fex-team/fis3/blob/dev/doc%s">/doc%s</a></p>' + 
      '</blockquote>', path, path);
    return layout.getContent()
      .replace('{{content}}', content)
      .replace('{{title}}', title);
  }

  return function(content, file, settings) {
    file.cache.addDeps(layout.realpath); // cache deps layout
    var marked = require('marked');
    var renderer = new marked.Renderer();
    content.match(/##([^#\n]+)/);
    var title = 'FIS3 : ' + (RegExp.$1 || "");

    renderer.heading = function(text, level) {
      var link = {};
      link.text = text;
      link.level = level;
      var escapedText = encodeURI(text);
      if (level != 1) level += 1;
      return util.format(
        '<a name="%s" class="title-anchor"></a><h%s class="%s" %s>%s</h%s>',
        escapedText,
        level,
        (level == 1 ? 'page-header' : ''),
        (level == 3 ? 'id="' + text + '"' : ''),
        text,
        level
      );
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
          href = fis.compile.lang.uri.ld + href + fis.compile.lang.uri.rd + encodeURI(hash);
        } else {
          href = encodeURI(href + hash);
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
    return file.isIndex ? content : wrapper(title, content, file.subpath);
  };
}


function buildNav() {
  return function(ret) {
    fis.util.map(ret.src, function(subpath, file) {
      if (!file.isDoc) return;
      file.setContent(
        file.getContent().replace('{{nav}}', ret.src['/docs/INDEX.md'].getContent())
      );
    });
  };
}

function replaceDefine(defines) {
  return function(ret) {
    fis.util.map(ret.src, function(subpath, file) {
      if (file.isHtmlLike) {
        var content = file.getContent();
        content = content.replace(/\{\{-([^}]+)\}\}/ig, function($0, $1) {
          return (typeof defines[$1.trim()] == 'undefined') ? '' : defines[$1.trim()];
        });
        file.setContent(content);
      }
    });
  };
}

function hackActiveTab() {
  return function(ret) {
    fis.util.map(ret.src, function(subpath, file) {
      if (file.basename !== 'header.html' && file.isHtmlLike) {
        var content = file.getContent();
        // 此处逻辑很 ugly
        content = content.replace(/active-flag\s*=\s*("[^"]+"|'[^']+')/ig, function($0, $1) {
          var info = fis.util.stringQuote($1);
          var paths = subpath.split('/');
          if (info.rest == paths[1]) {
            return 'is-active';
          }
          return '';
        });
        file.setContent(content);
      }
    });
  };
}

module.exports.hackActiveTab = hackActiveTab;
module.exports.markdownParse = markdownParse;
module.exports.buildNav = buildNav;
module.exports.replaceDefine = replaceDefine;