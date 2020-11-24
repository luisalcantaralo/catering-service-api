const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extendend: true }));

const api = require('./api');
app.use('/api', api);

app.use((error, req, res, next) => {
  res.status(error.status).json({ message: error.message });
  return;
})

app.listen(port, () => console.log(`[server] Listening on port ${port}`));

exports.app = functions.https.onRequest(app);