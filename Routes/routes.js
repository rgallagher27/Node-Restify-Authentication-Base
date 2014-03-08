"use strict"

var AuthenticationHelper    = require('../Helpers/authentication')
var mongoose    			= require('mongoose')
var restify 				= require('restify')
var Users       			= mongoose.model('Users')

module.exports = function (server, config) 
{
   	var routes_path = config.root + '/Routes'

   	// Define main entry points
	var RESOURCES = Object.freeze({
	    INITIAL		: "/",
	    REGISTER 	: "/register",
	    LOGIN 		: "/authenticate"
	})

	/**
	 * Perform authentication before it gets to the controllers
	 */
	server.pre(function(req, res, next) 
 	{
    	if (req.url 	=== RESOURCES.INITIAL 
    		|| req.url 	=== RESOURCES.LOGIN
    		|| req.url  === RESOURCES.REGISTER) {
      		return next()
      	}else {
      		/**
      		 * Set the response Content-Type
      		 */
	    	res.contentType = "application/json"

      		/**
      		 * Authenticate the users request token 
      		 */
      		AuthenticationHelper.validateToken(req, res, next)
      	}
   	})

   	server.get(RESOURCES.INITIAL, function (req, res)
   	{
	    var response = {
	        Hello: "World!"
	    }

	    res.contentType = "application/json"
	    res.send(response)
	})

	server.post(RESOURCES.LOGIN, function (req, res, next) 
	{
		var tmpUser = req.body

		Users 
		.findByUsername(tmpUser.username, function (err, user) {
	        if (!err) {
	            if(user.authenticate(tmpUser.password)){
	            	return AuthenticationHelper.generateToken(user, res, next)
	            }else return next(new restify.InvalidCredentialsError("Invalid"))
	        } else return next(new restify.InvalidCredentialsError("Invalid"))
	    })
	})

	server.post(RESOURCES.REGISTER, function (req, res, next) 
	{
		var user 			= new Users(req.body)
			user.join_date 	= new Date().toISOString()

			user.save(function (err, user) {
				if (!err) {
					return AuthenticationHelper.generateToken(user, res, next)
				} else return next(new restify.InvalidContentError(err))
			})
	})

	/**
	 * Include the main api routes 
	 */
	require(routes_path + '/routes-user.js')( server, config )
}