/*
TODO:

 - name it
 - AMD wrapper
 - web worker

Get value:

表达式处理

来源可能

1. 普通表达式 
{{hello + 123 + "123"}}

2. 赋值语句的后半部分
{{$asd = name.title}}

3. if语句后半部分
{{#if name === 1}}

解析过程
1. 获取表达式
2. 抽出引号并保存
3. 变量识别并替换为带引号字符串

合法变量
$name name.name name[0].name




问题：
js 关键字，允许，一致按数据匹配结果过滤
没有对应数据(undefined) ==> ""


3. eval (严格模式下避免变量污染)

{{name}} ==> data["name"]
{{name.aa.aa.aa[0]}} ==> data["name"]["aa"]["aa"]["aa"][0]


{{hi || "default"}}
{{hi?1:2}}

1. 变量 带 $ {{for $item in children}}

2. 赋值 ???
{{$xx=$item}}

3. 运算 eval, 支持js 数据类型

{{"prefix" + $item | xx}}
{{$item+100}}
{{if @index==true}}
{{if @index===100}}{{break}}{{/if}}
for: {{break}} / {{contiue}}

{{#if $item = name}} 赋值 + 判断
    <span>{{$item}}</span>
{{/if}}

4. filter 管道
filter: {{name | slice(0, 3) | replace("a","b") | unescape}}


5. 索引 或 内置项

@key | @index | @total | @first | @last

 */

/*
// Global extend
tpl.helper["with"] = function() {
}

// 
tpl("", {a:1}, {

 // Private extend
 , util: {}
 , helper: {} 
 , filter: {} 
})
*/

/*
ie issue: eval("(function(){})") 
return Function.apply(null, []
"use strict";
var x = 2;
console.info(eval("var x = 5; x")); // 5
console.info(x); // 2
 */

"use strict";


var UNDEF

// util
, util = {

    /**
     * noop
     * @return {[Undefined]} [description]
     */
    noop: function() {}

    /**
     * Boolean of any data type
     * @param  {[Object]} obj any data type
     * @return {[Bool]} boolean result
     * @example "true" || true || 1 || "1" ==> true
     * @example "false" || false || 0 || "0" || {} || [] ==> false
     */
    , toBool: function(obj) {
        if(obj === "undefined" || obj === UNDEF || obj === null) return !1;

        var type = util.type(obj)
            , len = !!obj.length;
            
        if(type === "boolean") return obj;
        if(type === "array") return len;
        if(type === "number") return obj !== 0;

        // TODO
        if(type === "string") return !(obj === "0" || obj === "");
        if(type === "object") return !!util.keys(obj).length;
        return !!obj;
    }

    /**
     * Return define data type
     * @param  {[Object]} obj 
     * @return {[String]} data type, like: "array"
     */
    , type: function(obj) {
        return ({}).toString.call(obj).replace(/^\[object (\w+)\]$/, "$1").toLowerCase();
    }

    /**
     * Basic iterator
     * @param  {[Object | Array]} obj
     * @param  {[Function]} iterator
     * @param  {[Object]} context
     * @return {[Undefined]}
     */
    , each: function(obj, iterator, context) {
        if(util.type(obj) === "array")
            for(var i = 0, l = obj.length; i < l; i++) {
                if(iterator.call(context || obj[i], obj[i], i, obj) === false) break;
            }
        else 
            for(var key in obj) {
                if(obj.hasOwnProperty(key) && iterator.call(context || obj[key], obj[key], key, obj) === false) break;
            }
    }

    /**
     * Multi-Object extend
     * @param  {[Object]} target
     * @return {[Object]}
     */
    , extend: function(target) {
        util.each([].slice.call(arguments, 1), function(source) {
            source && util.each(source, function(val, key) {
                target[key] = val;
            });
        });
        return target;
    }

    /**
     * Transform array into object
     * @param  {[Array]}
     * @return {[Object]}     [description]
     */
    , arrTobj: function(arr) {
        var result = {};
        util.each(arr, function(li) {
            result[li] = li;
        });
        return result;
    }

    /**
     * Object.keys-shim
     * @param  {[Object]} obj [description]
     * @return {[Array]}     [description]
     */
    , keys: Object.keys || function(obj) {
        var keys = [];
        util.each(obj, function(key) {
            keys.push(key);
        });
        return keys;
    }

    /**
     * tap
     * @param  {[type]} obj       [description]
     * @param  {[type]} path      "children[0].list"
     * @param  {[type]} overwrite [description]
     * @return {[type]}           [description]
     */
    , tap: function(obj, path, overwrite) {
        var result = obj
            , l = path.length;
        if(!l) return obj;
        if(path === path + "") path = path.replace(/\[([^\]])+\]/g, function($0, $1, i) {
            return (i ? "." : "") + $1;
        }).split(".");
        util.each(path, function(li, i) {
            if(UNDEF === result) return false;
            else if(i === l - 1 && overwrite !== UNDEF) {
                result[li] = overwrite;
                return false;
            }
            result = result[li];
        });
        return overwrite !== UNDEF ? obj : result;
    }

    /**
     * Replace by id
     * @param  {[type]} tpl [description]
     * @param  {[type]} val [description]
     * @return {[type]}     [description]
     */
    , replace: function(tpl, val) {

        var ids = [].slice.call(arguments, 2)
            , startReg = "\\{\\{" + ids[0]
            , endReg = "\\}\\}";

        if(ids[1]) {
            startReg = startReg + endReg;
            endReg = "\\{\\{" + ids[1] + endReg;
        }

        return tpl.replace(new RegExp(startReg + "(((?!" + endReg + ")[\\s\\S])*)" + endReg), function() {
            return val(arguments[1]);
        });
    }

    /**
     * Fetch template form differents way
     * @param  {[Object | String | Function]} source
     * @return {[String]} template string
     *
     * way 1: String
     *
     * way 2: from HTML
     * 
     * <textarea>
     * <!doctype html>
     * <html>
     *     <body>
     *         <h1>{{name}}</h1>
     *     </body>
     * </html>
     * </textarea>
     * 
     * <script type="text/template">
     * <h1>{{title}}</h1>
     * <p>I am {{name}}...</p>
     * </script>
     * 
     */
    
    // way 3: from javascript
    // 
    // var tpl = function(){/*!@preserve
    // <!doctype html>
    // <html>
    //    <body>
    //        <h1>{{name}}</h1>
    //    </body>
    // </html>
    // */0}

    , fetchTpl: function(obj) {
        return obj.value || obj.innerHTML || (util.type(obj) === "function"
            ? (obj.toString().match(/\/\*!?(?:\@preserve)?\s*(?:\r\n|\n)([\s\S]*?)(?:\r\n|\n)\s*\*\//) || ["", ""])[1]
            : obj + "");
    }

    /**
     * Parse original data
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    , parseData: function(data) {
        if(data !== data + "") return data;
        return JSON && JSON.parse
            ? JSON.parse(data)
            : (new Function("return " + data))();
    }

    /**
     * Filter string
     * @param  {[String]} str     [description]
     * @param  {[Array]} filters ["slice(1, 2)", "trim"]
     * @return {[type]}         [description]
     */
    , filter: function(str, filters) {
        var unescape = false;
        util.each(filters, function(fn) {
            var params = [];
            fn = fn.replace(/\s*\(([^)]*)\)/g, function($0, $1) {
                params = params.concat($1.split(/\s*,\s*/));
                return "";
            });
            if(fn === "unescape") unescape = true;
            else if(str[fn]) str = str[fn].apply(str, params);
            else if(filter[fn]) str = filter[fn].apply(str, [str].concat(params));
        });
        return unescape ? str : filter.escape(str);
    }

    /**
     * [exec description]
     * @param  {[type]} str [description]
     * @return {[type]}     [description]
     */
    , exec: function(str) {
        
    }
}

// filter
, filter = {

    /**
     * Trim-shim
     * @param  {[String]} str
     * @return {[String]}
     */
    trim: function(str) {
        return (str = str + "").trim
        ? str.trim.call(str)
        : str.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, "");
    }

    /**
     * HTML escape
     * @param  {[String]} s [description]
     * @return {[String]}   [description]
     */
    , escape: function(str){
        return (str + "").replace(/[&<>'"]/g, function($0){
            return "&" + {
                "&"   : "amp"
                , "<" : "lt"
                , ">" : "gt"

                // IE not supported &apos;
                , "'" : "#39"
                , "\"" : "quot"
            }[$0] + ";"
        });
    }

    /**
     * RegExp escape
     * @param  {[type]} str [description]
     * @return {[type]}     [description]
     */
    , regescape: function(str) {
        return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }

    /**
     * Remove line breaks
     * @param  {[String]} str [description]
     * @return {[String]}     [description]
     */
    , unwrap: function(str) {
        return str.replace(/\r?\n|\r|\t/g, "");
    }
}

// Recursion flattening
, helper = {

    "ROUTE": function(ast, data, tpl) {

        util.each(ast, function(token, key) {

            // parser block
            if(token.mark === "block") {
                token.mark = (token.mark = token.content.match(/#\s*([^\s]+)/)) ? token.mark[1] : "NULL";
            }
            tpl = util.replace(tpl, function(tpl) {
                return (helper[token.mark] || helper.NULL)(token, data, tpl);
            }, token.id, token.end);
        });
        return tpl;
    }

    , "exp": function(ast, data, tpl) {
        var filters = []
            , quotes = []
            , result
            , tmp;

        // pre-fix: quotes
        result = ast.content.replace(/"(?:[^\\"\r\n\f]|\\[\s\S])*"|'(?:[^\\'\n\r\f]|\\[\s\S])*'/g, function($0) {
            quotes.push($0.slice(1, -1));
            return "#{" + (quotes.length - 1) + "}";
        });

        // if handle
        // bug: `"#if $item.album_id".match(/if\s+([^$]*)/)`
        // tmp = result.match(/if\s+([^$]*)/);
        tmp = result.match(/if\s+([\s\S]*)/);
        tmp && (result = tmp[1]);

        // {{$alias = children}} is Illegal
        if(/\s*[^=]=[^=]\s*/.test(result)) return "";

        // TODO: need supports assign?
        /*if(assign.length > 1) {
            util.tap(data, assign[0], data[assign[1]])
        }*/

        // - `hi || encodeURIComponent`
        // - `hi \| encodeURIComponent`
        // bug: `{{hi|encodeURIComponent}}`
        // filters = result.split(/\s*[^\|\\]\|[^\|]\s*/);

        !function parseFilter(src, sign) {
            sign = /[^\|\\]\|[^\|]/.exec(src);
            if(!sign) return filters.push(filter.trim(src));
            filters.push(filter.trim(src.slice(0, sign.index + 1)));
            parseFilter(src.slice(sign.index + 2));
        }(result);

        result = filters
            .shift()
            .replace(/[\[\$@_a-zA-Z][\.\w\[\]]*/g, function($0, $1) {

                // js data type keywords check
                
                // TODO:

                /*
                true ==> ""
                
                cause:

                ```
                {{#if true}}
                {{1}}
                {{/if}}
                ```
                not good?
                */
                var value = ~"undefined true false null NaN".indexOf($0) ? "" : util.tap(data, $0);

                return "\"" + (value === UNDEF ? "" : value) + "\""
            })
            .replace(/#\{([^}]*)\}/g, function($0) {
                return "\"" + quotes.shift() + "\"";
            });

        try{
            result = eval(result);
        } catch(e) {}

        return util.filter(result, filters);
    }

    , "for": function(ast, data, tpl) {

        // parser
        // #for item in children
        var dataPath = ast.content.match(/in\s+([^\s]*)/)
            , key = ast.content.match(/for\s+([^\s]*)/)
            , _data = util.tap(data, dataPath ? dataPath[1] : "")
            , i = 0
            , result = ""
            , keys = []
            , arrData;

        key = key ? key[1] : "";
        util.type(_data) === "array" && (arrData = {});
        util.each(_data, function(v, k) {
            arrData && (arrData[k] = v);
            (k === +k || k.indexOf("@") !== 0) && k !== key && keys.push(k);
        });
        arrData && (_data = arrData);

        if(!_data) return result;

        _data["@total"] = _data["@length"] = keys.length;
        _data["@first"] = _data[keys[0]];
        _data["@last"] = _data[keys[keys.length - 1]];


        util.each(_data, function(li, k) {
            if(!k.indexOf("@") || k === key) return;
            _data[key] = li;
            _data["@key"] = k;
            _data["@index"] = i++;

            result += helper.ROUTE(ast, _data, tpl);
        });
        return result;
    }

    , "if": function(ast, data, tpl) {



        // split
        util.each(ast, function(token) {
            if(token.mark === "else") {
                tpl = tpl.split(new RegExp("\\{\\{" + token.id + "\\}\\}"));
                return false;
            }
        });

        util.type(tpl) !== "array" && (tpl = [tpl, ""]);
        var result = helper.exp(ast, data);
        return helper.ROUTE(ast, data, result !== "false" && util.toBool(result) ? tpl[0] : tpl[1]);
    }

    , "with": function(ast, data, tpl) {
        var path = ast.content.match(/with\s+([^\s]*)/);
        return helper.ROUTE(ast, util.tap(data, path ? path[1] : ""), tpl);
    }

    , "NULL": function(ast, data, tpl) {
        return "";
    }
}

, engine = function(template, data, opts) {
    var that = this;

    // instead of a wrapper
    // if(!that || !(that instanceof engine)) return new engine(template, data, opts);

    that.data = util.parseData(data);
    that.opts = util.extend({

        // begin delimiter
        delimiterBegin: "{{"

        // end delimiter
        , delimiterEnd: "}}"

        // remove line breaks
        , removeLineBreaks: false
    }, opts);

    // extend
    util.extend(util, that.opts.util);
    util.extend(helper, that.opts.helper);
    util.extend(filter, that.opts.filter);

    // walkers
    that.walkers = {
        "/": "close"
        , "#": "block"
        // , "*": "comments"
        , "{": "unescape"
        // , "@": "index"
    }

    // keywords
    that.keywords = util.arrTobj("else break contiue".split(" "));

    // Abstract syntax tree
    that.ast = {};
    that.cache = {};

    that.tokenStack = [];
    that.tpl = util.fetchTpl(template);
    that.tokenId = 0;

    that.tokenReg = new RegExp(that.opts.delimiterBegin + "(((?!" + that.opts.delimiterEnd + ")[\\s\\S])*)" + that.opts.delimiterEnd, "g");

    that.commentReg = new RegExp(that.opts.delimiterBegin + "\\s*\\*[\\S\\s]*?\\*\\s*" + that.opts.delimiterEnd, "g");

    that

        // SETUP1 pre-handle
        .preCompile()

        // SETUP2 make AST
        .astWalker()

        // SETUP3 compile
        .compile();

    // console.log(JSON.stringify(that.ast, null, "    "));

    return that.data ? that.tpl : that.ast;
}

, fn = engine.prototype;

/**
 * Extend native filter
 */
util.each("decodeURIComponent encodeURIComponent decodeURI encodeURI".split(" "), function(li) {
    filter[li] = window[li];
});

/**
 * preCompile
 * @return {[type]} [description]
 */
fn.preCompile = function() {
    // console.time("preCompile");
    var that = this;
    if(that.opts.removeLineBreaks) that.tpl = filter.unwrap(that.tpl);

    // Kill comments first
    that.tpl = that.tpl.replace(that.commentReg, "");

    // console.timeEnd("preCompile");
    return that;
}

/**
 * astWalker
 * @return {[type]} [description]
 */
fn.astWalker = function() {
    // console.time("astWalker");
    var that = this;
    that.tpl = that.tpl.replace(that.tokenReg, function() {
        that.addToken(that.parseToken(arguments));
        return "{{" + that.tokenId++ + "}}";
    });
    // console.timeEnd("astWalker");
    return that;
}

/**
 * parseToken
 * @return {[type]} [description]
 */
fn.parseToken = function(args) {
    var that = this
        , content = filter.trim(args[1]);

    return {
        mark: that.keywords[content] || that.walkers[content.slice(0, 1)] || "exp"
        , pos: args[3]
        , id: that.tokenId
        , content: content
    };
}

/**
 * addToken
 * @param {[type]} token [description]
 */
fn.addToken = function(token) {
    var that = this
        , tmp;

    if(token.mark === "block") {
        that.tokenStack.push(token.id);
        util.tap(that.ast, that.tokenStack, token);
    }

    else if(token.mark === "close") {
        tmp = util.tap(that.ast, that.tokenStack);
        tmp.end = token.id;
        util.tap(that.ast, that.tokenStack, tmp);
        that.tokenStack.pop();
    }

    else {
        tmp = that.tokenStack.slice(0);
        tmp.push(token.id);
        util.tap(that.ast, tmp, token);
    }
}

/**
 * compile
 * @return {[type]} [description]
 */
fn.compile = function() {
    // console.time("compile");
    var that = this;
    that.data && (that.tpl = helper.ROUTE(that.ast, that.data, that.tpl));
    // console.timeEnd("compile");
    return that;
}

// wrapper
var tpl = function(template, data, opts) {
    var result = new engine(template, data, opts);
    return data ? result.tpl : result.ast;
};

tpl.VERSION = "0.0.1";
tpl.util = util;
tpl.helper = helper;
tpl.filter = filter;

// (new tpl.engine()).ast
tpl.engine = engine;

if(typeof module !== "undefined" && typeof module.exports !== "undefined") module.exports = tpl;
else return tpl;