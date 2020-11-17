const express = require('express');
const router = express.Router();
const {connectionData} = require('../config/db');
const { Client } = require('pg');


// Done testing
router.get('/',async (req, res, next) => {
    const client = new Client(connectionData)
    client.connect();
    
    try {
        const data = await client.query('SELECT * FROM order_info');
        console.log(data.rows) ;
        res.status(200).json({ message: data.rows});

    } catch (error) {
        next({status: 500, message: error.stack});
    } finally{
        client.end();
    }
   
});

module.exports = router;