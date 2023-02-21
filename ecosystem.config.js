module.exports = {
    apps : [{
      name   : "Corona-Backend",
      script : "./server/server.js",
      instances : "1",
      exec_mode : "cluster"
    }]
  }