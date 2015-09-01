/*jshint camelcase: false*/
'use strict';
var mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
};

var makeFilesMap = function(src, dist, match, replace) {
    var ret = {};
    grunt.file.recurse(src, function(abspath, rootdir, subdir, filename) {
        console.log(filename)
    });
    return ret;
}

module.exports = function(grunt) {

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        app: {
            src: 'src',
            dist: 'dist',
            test: 'test'
        },
        watch: {
            options: {
                spawn: false
            },

            css: {
                files: ['<%= app.src %>/*.css'],
                tasks: ['build', 'shell:refresh']
            }
        },
        connect: {
            server: {
                options: {
                    port: 8011,
                    hostname: '127.0.0.1',
                    base: '<%= app.test %>',
                    keepalive: true,
                    middleware: function (connect, options) {
                        return [
                            // Serve static files.
                            connect.static(options.base),
                            // Make empty directories browsable.
                            connect.directory(options.base),
                        ];
                    }
                }
            }
        },
        copy: {
            test: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= app.dist %>',
                    dest: '<%= app.test %>/dist',
                    src: [
                        '*.css'
                    ]
                }]
            }
        },
        shell: {
            refresh: {
                // command: "osascript -e 'tell application \"Google Chrome Canary\" to activate' -e 'tell app \"System Events\" to keystroke \"r\" using {command down}'"
                command: "osascript -e 'tell application \"Google Chrome\" to activate' -e 'tell app \"System Events\" to keystroke \"r\" using {command down}'"
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= app.dist %>'
                    ]
                }]
            },
            test: {
                files: [{
                    dot: true,
                    src: [
                        '<%= app.test %>/dist'
                    ]
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= app.dist %>/base.ltr.css': [
                        '<%= app.src %>/reset.css'
                        , '<%= app.src %>/layout.css'
                        , '<%= app.src %>/tool.css'
                        , '<%= app.src %>/default.css'
                        , '<%= app.src %>/link.css'
                        // , '<%= app.src %>/icon.css'
                    ],
                    '<%= app.dist %>/base.rtl.css': [
                        '<%= app.src %>/reset.css'
                        , '<%= app.src %>/layout.rtl.css'
                        , '<%= app.src %>/tool.css'
                        , '<%= app.src %>/default.css'
                        , '<%= app.src %>/link.css'
                        // , '<%= app.src %>/icon.rtl.css'
                    ],
                    '<%= app.dist %>/base.rtl.ie.css': [
                        '<%= app.src %>/reset.css'
                        , '<%= app.src %>/reset.ie.css'
                        , '<%= app.src %>/layout.rtl.css'
                        , '<%= app.src %>/layout.rtl.ie.css'
                        , '<%= app.src %>/tool.css'
                        , '<%= app.src %>/tool.ie.css'
                        , '<%= app.src %>/default.css'
                        , '<%= app.src %>/link.css'
                        // , '<%= app.src %>/icon.rtl.css'
                        // , '<%= app.src %>/icon.rtl.ie.css'
                    ],
                    '<%= app.dist %>/base.ltr.ie.css': [
                        '<%= app.src %>/reset.css'
                        , '<%= app.src %>/reset.ie.css'
                        , '<%= app.src %>/layout.css'
                        , '<%= app.src %>/layout.ie.css'
                        , '<%= app.src %>/tool.css'
                        , '<%= app.src %>/tool.ie.css'
                        , '<%= app.src %>/default.css'
                        , '<%= app.src %>/link.css'
                        // , '<%= app.src %>/icon.css'
                        // , '<%= app.src %>/icon.ie.css'
                    ]
                }
            }
            /*, theme: {
                files: function(src, dist, match) {
                    var ret = {};
                    grunt.file.recurse(src, function(abspath, rootdir, subdir, filename) {
                        if(match.test(filename)) {
                            ret[dist + filename] = src + filename;
                        }
                    });
                    return ret;
                }('app/styles/theme/', 'dist/styles/theme/', /\.css$/)
            }*/
        }
    });

/*var connect = require('grunt-contrib-connect');
grunt.registerTask('connect', 'Start a custom static web server.', function() {
  grunt.log.writeln('Starting static web server in "test" on port 9001.');
  connect(connect.static('test')).listen(9001);
});*/

    grunt.registerTask('test', [
        'build',
        'clean:test',
        'copy:test',
        'connect'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'cssmin'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};
