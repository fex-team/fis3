var require, define;

(function(self) {
    var head = document.getElementsByTagName('head')[0],
        loadingMap = {},
        factoryMap = {},
        modulesMap = {},
        resMap, pkgMap;


    function loadScript(id, callback) {
        var res = resMap[id] || {};
        var url;

        var pkgID = res['pkg'];
        if (pkgID) {
            url = pkgMap[pkgID]['url'];
        }
        else {
            url = res['url'] || id;
        }

        var queue = loadingMap[id];
        if (!queue) {
            queue = loadingMap[id] = [];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            head.appendChild(script);
        }
        queue.push(callback);
    }

    define = function(id, factory) {
        factoryMap[id] = factory;

        var queue = loadingMap[id];
        if (queue) {
            for(var i = queue.length - 1; i >= 0; --i) {
                queue[i]();
            }
            delete loadingMap[id];
        }
    };

    require = function(id) {
        id = require.alias(id);

        var mod = modulesMap[id];
        if (mod) {
            return mod['exports'];
        }

        //
        // init module
        //
        var factory = factoryMap[id];
        if (!factory) {
            throw Error('Cannot find module `' + id + '`');
        }

        mod = modulesMap[id] = {
            'exports': {}
        };

        //
        // factory: function OR value
        //
        var ret = (typeof factory == 'function')
                ? factory.apply(mod, [require, mod['exports'], mod])
                : factory;

        if (ret) {
            mod['exports'] = ret;
        }
        return mod['exports'];
    };

    require.async = function(names, callback) {
        if (typeof names == 'string') {
            names = [names];
        }
        
        for(var i = names.length - 1; i >= 0; --i) {
            names[i] = require.alias(names[i]);
        }

        var needMap = {};
        var needNum = 0;

        function findNeed(depArr) {
            for(var i = depArr.length - 1; i >= 0; --i) {
                //
                // skip loading or loaded
                //
                var dep = depArr[i];
                if (dep in factoryMap || dep in needMap) {
                    continue;
                }

                needMap[dep] = true;
                needNum++;
                loadScript(dep, updateNeed);

                var child = resMap[dep];
                if (child) {
                    findNeed(child.deps);
                }
            }
        }

        function updateNeed() {
            if (0 == needNum--) {
                var i, args = [];
                for(i = names.length - 1; i >= 0; --i) {
                    args[i] = require(names[i]);
                }
                callback && callback.apply(self, args);
            }
        }
        
        findNeed(names);
        updateNeed();
    };

    require.resourceMap = function(obj) {
        resMap = obj['res'] || {};
        pkgMap = obj['pkg'] || {};
    };

    require.alias = function(id) {return id};

    define.amd = {
        'jQuery': true,
        'version': '1.0.0'
    };

})(this);
