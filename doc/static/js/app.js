var F = (function() {

  var _ = {};

  _.invert = function(obj) {
    var result = {};
    var keys = Object.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };

  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + Object.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  var noMatch = /(.)^/;

  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  _.template = function(text) {

    var settings = _.templateSettings;

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':F.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', 'F', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  return _;

})();


var View = (function() {
  // main
  function render(target, tmplId, data, isAppend) {
    var tmpl = $(tmplId).html();
    var html = F.template(tmpl)(data || {});
    if (isAppend) {
      $(target).append(html);
    } else {
      $(target).html(html);
    }
  }

  function fetch(url, params, onSuccess, onFail) {
    $.ajax(url, {
        type: 'GET',
        data: params
      })
      .done(onSuccess)
      .fail(onFail);
  }

  return {
    render: render,
    fetch: fetch
  };

})();

function showList(query, from) {
  query = query.trim();
  View.fetch(
    'http://npmsearch.com/query?fields=name,keywords,description,rating,author,version', {
      q: (query ? query + ' and ' : '') + 'keywords:fis',
      from: from,
      size: 2000
    },
    function(data) {

      data = JSON.parse(data);

      $('#search').attr('placeholder', '检索到插件 ' + data.total + ' 个');

      View.render('#plugin-list-body', '#_tmpl_id_0', {
        lists: data.results.filter(function (item) {
          if (item.name.indexOf('fis-config') !== -1) {
            return false;
          }
          return true;
        })
      }, !!from);

    },
    function(err) {
      throw err;
    }
  );
}

var step = 0;
var DEFAULT = '';
var timer;

$('#search').on('keyup', function() {
  var val = $('#search').val();
  clearTimeout(timer);
  timer = setTimeout(function() {
    Array.prototype.slice.call($('.plugin-name')).forEach(function (nameElm) {
      var toElm = $(nameElm).parents('li');
      if (nameElm.innerHTML.indexOf(val) !== -1) {
        toElm.show();
      } else {
        toElm.hide();
      }
    });
  }, 100);
});

$('#search').val(DEFAULT);
showList(DEFAULT, 0);