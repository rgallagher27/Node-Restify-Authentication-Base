/**
 * Module dependencies.
 */
var mongoose    = require('mongoose')
var validate    = require('mongoose-validator').validate
var bcrypt      = require('bcrypt')
var Schema      = mongoose.Schema

/**
 * Vaidation Rules
 */
var userValidator   = [validate('len', 3, 25, 'Fail'), validate('isAlphanumeric', 'Fail'), validate('notEmpty', 'Fail')]
var emailValidator  = [validate('isEmail', 'Fail'), validate('notEmpty', 'Fail')]

/**
 * User Schema
 */
var UserSchema = new Schema({
    name:               {
                          first: { type: String, trim: true },
                          last:  { type: String, trim: true }
                        },
    username:           { type: String, trim: true, required: true, validate: userValidator,  lowercase: true, unique: true },
    email:              { type: String, trim: true, required: true, validate: emailValidator, lowercase: true, unique: true },
    hashed_password:    { type: String, trim: true, required: true },
    profile_image:      { type: String, trim: true, default: 'default' },
    join_date:          { type: Date,   required:true }
  })

UserSchema.index( { username: 1, email: 1 } )

/**
 * Virtuals
 */
UserSchema
    .virtual('password')
    .set(function(password) {
      this._password        = password
      this.hashed_password  = this.encryptPassword(password)
    })
    .get(function() { 
      return this._password
    })

UserSchema
    .virtual('full_name')
    .get(function () {
        return this.name.first + ' ' + this.name.last
    })
    .set(function (name) {
      var split       = name.split(' ')
      this.name.first = split[0]  
      this.name.last  = split[1]
    })

/**
 * Methods
 */
UserSchema.methods = {

  /**
  * Authenticate - check if the passwords are the same
  *
  * @param {String} plainText
  * @return {Boolean}
  * @api public
  */
  authenticate: function (plainText) 
  {
    return bcrypt.compareSync(plainText, this.hashed_password)
  },

  /**
  * Encrypt password
  *
  * @param {String} password
  * @return {String}
  * @api public
  */
  encryptPassword: function (password) 
  {
    if (!password) return ''

    var salt = bcrypt.genSaltSync(10)
    var hash = bcrypt.hashSync(password, salt)

    return hash;
  }
}

/**
 * Static Methods
 */
UserSchema.statics.findByUsername = function (name, cb) 
{
  this.findOne({ username: new RegExp(name, 'i') }, cb)
}

UserSchema.statics.findByEmail = function (mail, cb) 
{
  this.findOne({ username: new RegExp(mail, 'i') }, cb)
}

mongoose.model('Users', UserSchema)