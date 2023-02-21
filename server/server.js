require('./config/config');

const express = require('express');
const path = require('path');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const https = require('https');
const fs = require('fs');
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb', extended: true }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    createParentPath: true
}));

// Routes
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(require('./routes/index'));

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start HTTP server
// app.listen(process.env.PORT, () => {
//     console.log(`My HTTP server listening on port ${process.env.PORT}...`);
// });

 //start HTTPS server
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/corona.texelbit.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/corona.texelbit.com/cert.pem'),
  ca: fs.readFileSync('/etc/letsencrypt/live/corona.texelbit.com/chain.pem')
};

https.createServer(options, app).listen(process.env.PORT, () => {
  console.log(`My HTTPS server listening on port ${process.env.PORT}...`);
});