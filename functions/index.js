const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');

const connectionData = {

  user: 'postgres',
  host: 'catering-service.c0zzjro3idpn.us-east-1.rds.amazonaws.com',
  database: 'postgres',
  password: 'KUzrHH16MWY1Qrk9gLda',
  port: 5432,

}

const client = new Client(connectionData)


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extendend: true }));

const api = require('./api');
app.use('/api', api);

app.get('/hello', (req, res, next) => {
  res.status(400).json({ message: 'Hello World from Firebase Cloud Functions!'});
  return;
})

app.listen(port, () => console.log(`[server] Listening on port ${port}`));

exports.app = functions.https.onRequest(app);