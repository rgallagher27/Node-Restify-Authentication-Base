/**
 * Environment dependent configuration properties
 */
module.exports = {
    development: {
      root: require('path').normalize(__dirname + '/..'),
      app: {
        name: 'API Base V0.0.1'
      },
	    host: 'localhost',
	    port: '8080',
      db_url: 'localhost/api_base',
      jwtSecret: "superSecret"
    },
    production: {
      root: require('path').normalize(__dirname + '/..'),
      app: {
        name: 'API Base V0.0.1'
      },
      host: '',
      port: process.env.PORT,
      db_url: process.env.DB_HOST,
      jwtSecret: process.env.JWTSecret
    }
}