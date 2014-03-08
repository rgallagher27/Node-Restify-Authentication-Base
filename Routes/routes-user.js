"use strict"

var User = require('../Controllers/users')

module.exports = function ( server ) 
{
	var ProfilePath 	= "/users/profile"
	var UserPath 		= "/users/:user_id"

	/**
	 * Get the details of the currently logged in user
	 */
	server.get({path: ProfilePath, version: '1.0.0'}, User.myProfile)

    /**
     * Update the profile details of the currently logged in user
     */
    server.post({path: ProfilePath, version: '1.0.0'}, User.updateMyProfile)

	/**
	 * Get details of a user based on their username,
	 * needs validation that current user has access to data
	 */
	server.get({path: UserPath, version: '1.0.0'}, User.usersProfile)
}	