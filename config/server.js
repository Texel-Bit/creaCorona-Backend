const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const WebSocketSingleton = require('../middlewares/WebSocketSingleton');
const fs = require('fs');
const https = require('https');

const startServer = (app) => {
  const port = process.env.PORT || 9445;


  // const server = app.listen(port, () => {
  //   console.log(`Server running on http://localhost:${port}`);
  // });

  const options = {
    key: fs.readFileSync("/etc/letsencrypt/live/corona.texelbit.com/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/corona.texelbit.com/cert.pem"),
    ca: fs.readFileSync("/etc/letsencrypt/live/corona.texelbit.com/chain.pem"),
  };
  const server=https.createServer(options, app).listen(process.env.PORT, () => {
    console.log(`My HTTPS server listening on port ${process.env.PORT}...`);
  });

  

  WebSocketSingleton.init(server);
};

module.exports = () => {
  const app = express();

  // Uncomment helmet for basic security
  // app.use(helmet());

  // Configure CORS for a specific origin
  // app.use(cors({
  //   origin: 'https://f2rt72hd-3000.use2.devtunnels.ms/', // Set the allowed origin
  //   credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  //   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  //   allowedHeaders: ['Content-Type', 'Authorization'] // Allowed HTTP headers
  // }));

  app.use(express.json({ limit: '50mb' }));

  // Uncomment these if you need cookie-parser and CSRF protection
  // app.use(cookieParser());
  // app.use(csrf({ cookie: true }));

  app.use(express.static('public'));

  // Start the server
  startServer(app);

  return app;
};
