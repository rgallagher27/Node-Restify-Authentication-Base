"use strict"

/*
 * Main Imports
 */
var env             = process.env.NODE_ENV || 'development'
var config          = require('./Configs/config')[env]
var config_path     = config.root + '/Configs'
var routes_path     = config.root + '/Routes'
 
var mongoose        = require(config_path + '/mongoInit.js')(config, env)
var restify         = require("restify")

/*
 * Server creation
 */
var server = restify.createServer({
    name: "Base API",
    version: require("./package.json").version
})

// Setup the Restify Server with Oauth2
server.use(restify.fullResponse())
server.use(restify.bodyParser({ mapParams: false }))
server.use(restify.gzipResponse())

/*
 * Require all API routes
 */
require(routes_path + '/routes')(server, config)

var port = config.port
    server.listen(port)