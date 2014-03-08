"use strict"

var fs              = require('fs')
var mongoose        = require('mongoose')

module.exports = function (config, env) 
{
	var models_path     = config.root + '/Models'

	// Connect to MongoDB
	mongoose.connect(config.db_url)
	var db = mongoose.connection

	db.on('error', console.error.bind(console, 'connection error:'))
	db.once('open', function callback () {
	  console.log("Database connection opened.")
	})

	// Bootstrap models
	fs.readdirSync(models_path).forEach(function (file) {
	  console.log("Loading model " + file)
	  require(models_path + '/' + file)
	})

	return mongoose;
}