var DEFAULT_SETTINGS = {

  project: {
    charset: 'utf8',
    md5Length: 7,
    md5Connector: '_',
    files: ['**'],
    ignore: ['node_modules/**', 'output/**', 'fis-conf.js'],
    watch: {
      exclude: /^\/(?:output|node_modules|fis\-conf\.js).*$/i
    }
  },

  component: {
    skipRoadmapCheck: true,
    protocol: 'github',
    author: 'fis-components'
  },

  modules: {
    hook: 'components',
    packager: 'map',
    deploy: 'default'
  },

  options: {}
};