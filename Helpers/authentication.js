"use strict"

var env 	= process.env.NODE_ENV || 'development'
var config  = require('../Configs/config')[env]

var restify 			= require('restify')
var jwt         		= require('jsonwebtoken')

exports.validateToken = function (req, res, next) 
{
	var token
	if (req.headers && req.headers.authorization) {
		var parts = req.headers.authorization.split(' ')
		if (parts.length == 2) {
			var scheme 		= parts[0]
			var credentials = parts[1]

			if (/^Bearer$/i.test(scheme)) {
				token = credentials;
			}
		} else return next(new restify.NotAuthorizedError('Format is Authorization: Bearer [token]'))
	} else return next(new restify.NotAuthorizedError('No Authorization header was found'))

	jwt.verify(token, config.jwtSecret, function(err, decoded) {
		if (err) return next(new restify.NotAuthorizedError('Invalid Token'))

		req.user 		= decoded
		next()
    })	
}

exports.generateToken = function (user, res, next) 
{
	var tokenData 	= { userID: user._id, username: user.username }
	var token 		= jwt.sign(tokenData, config.jwtSecret, { expiresInMinutes: 60 * 24 * 7 }) //10080 mins in 1 week
	
	res.send({ message:'Success', token: token })
	return next()
}