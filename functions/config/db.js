const { Client } = require('pg');

const connectionData = {
  user: 'postgres',
  host: 'catering-service.c0zzjro3idpn.us-east-1.rds.amazonaws.com',
  database: 'postgres',
  password: 'KUzrHH16MWY1Qrk9gLda',
  port: 5432,
}

const client = new Client(connectionData)
client.connect();

const checkConnection = (client) =>  (req, res, next) => {
  if (client.ended) {
    client.connect();
  } 
  next()
}

module.exports = {client, checkConnection};
