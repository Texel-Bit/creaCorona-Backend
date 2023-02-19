module.exports = {
    apps : [{
      name   : "Corona-Backend",
      script : "./server/server.js",
      instances : "max",
      exec_mode : "cluster"
    }]
  }