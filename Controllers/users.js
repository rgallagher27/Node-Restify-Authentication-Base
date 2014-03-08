"use strict"

var mongoose    	= require('mongoose')
var restify 		= require('restify')
var Users       	= mongoose.model('Users')

exports.myProfile = function(req, res, next) 
{
	Users
	.findOne({ _id: req.user.userID })
	.populate('full_name')
	.select('-hashed_password')
	.exec(function (err, user) {
	  	if (err || !user) {
        	return next(new restify.ResourceNotFoundError('Database lookup error'))
    	} else {
        	res.send(user)
			return next()
    	}
	})
	return next()
}

exports.updateMyProfile = function(req, res, next)
{
	Users 
	.update( { _id: req.user.userID }, { $set: req.body }, function(err){
		if(err){
		    return next(new restify.InvalidArgumentError("Invalid Arguments"))
		}else {
			res.send({ message: 'success' })
			return next()
		}
	})
	return next()
}

exports.usersProfile = function(req, res, next)
{	
	Users
	.findOne( { _id: req.params.user_id } )
	.populate('full_name')
	.select('-hashed_password')
 	.exec( function(err, user){
 		if (err || !user) {
            return next(new restify.InvalidCredentialsError("Invalid Credentials"))
        } else {
            res.send(user)
			return next()
        }
	})
}