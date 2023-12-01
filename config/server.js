const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const WebSocketSingleton = require('../middlewares/WebSocketSingleton');

const startServer = (app) => {
  const port = process.env.PORT || 3000;
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  WebSocketSingleton.init(server);
};




module.exports = () => {
  const app = express();

  //app.use(helmet());
  // app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  //app.use(cookieParser());
  //app.use(csrf({ cookie: true }));
  app.use(express.static('public'));
  // Start the server
  startServer(app);

  return app;
};
