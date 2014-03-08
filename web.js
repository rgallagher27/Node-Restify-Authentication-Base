"use strict"

var cluster = require("cluster")
var numCPUs = require('os').cpus().length

cluster.setupMaster({
  exec : "server.js",
  args : ["--use", "https"],
  silent : false
})

cluster.on('online', function(worker) {
  console.log("Yay, the worker: " + worker.process.pid + " responded after it was forked")
})

cluster.on('listening', function(worker, address) {
  console.log("A worker is now connected to " + address.address + ":" + address.port)
})

cluster.on('exit', function(worker, code, signal) {
  console.log('worker %d died (%s). restarting...', worker.process.pid, signal || code)
  cluster.fork()
})


if (cluster.isMaster) {
  /*
   * Fork workers.
   */
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork()
  }
}