Backbone = require 'backbone'
Backbone.$ = require 'jquery'
app = require './views/app.js'
Workspace = require './routers/router.js'
new Workspace()
Backbone.history.start()
new app()