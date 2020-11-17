const express = require('express');
const router = express.Router();
const {connectionData} = require('../config/db');
const { Client } = require('pg');


// Read some
router.get('/', async(req, res, next) => {
    const client = new Client(connectionData)
    client.connect();
    
    try {
        const data = await client.query('SELECT * FROM customers');
        console.log(data.rows) ;
        res.status(200).json({ message: data.rows});

    } catch (error) {
        next({status: 500, message: error.stack});
    } finally{
        client.end();
    }
   
});

// Read one
router.get('/:id', async(req, res, next) => {
    const {id} = req.params;
    console.log(req.params);
    const client = new Client(connectionData)
    client.connect();
    try {
        const paramsQuery = [id]; 
        const data = await client.query('SELECT * FROM orders WHERE customer_id = $1', paramsQuery);
        console.log(data.rows) ;
        res.status(200).json({ message: data.rows});

    } catch (error) {
        next({status: 500, message: error.stack});
    } finally{
        client.end();
    }
});

// Create one
router.post('/', async(req, res, next) => {
    const client = new Client(connectionData)
    client.connect();
    const { first_name, last_name, email, phone, address_id} = req.params;
    try {
        const paramsQuery = [customer_id, order_date, order_event, recurring, order_notes, total_price, amount_paid]; 
        const data = await client.query('INSERT INTO customers (first_name, last_name, email, phone, address_id) VALUES($1, $2, $3, $4, $5)', paramsQuery);
        console.log(data.rows) ;
        res.status(200).json({ data: data.rows, message: "Successful inserting item"});

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error with query", error: error});
        
    } finally{
        client.end();
    }
});

// Update one
router.put('/:id', async(req, res, next) => {
    const client = new Client(connectionData)
    client.connect();
    const { customer_id, first_name, last_name, email, phone, address_id} = req.params;
    try {
        const paramsQuery = [customer_id, first_name, last_name, email, phone, address_id]; 
        const data = await client.query('UPDATE customers SET first_name = $2, last_name = $3, email = $4, phone = $5, address_id= $6, WHERE order_id = $1', paramsQuery);
        console.log(data.rows) ;
        res.status(200).json({ data: data.rows, message: "Successful updating item"});

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error with query", error: error});
        
    } finally{
        client.end();
    }
});

// Delete one
router.delete('/:id', async(req, res, next) => {
    const client = new Client(connectionData)
    client.connect();
    const {order_id} = req.params;
    try {
        const paramsQuery = [customer_id]; 
        const data = await client.query('DELETE FROM customers WHERE customer_id = $1', paramsQuery);
        console.log(data.rows) ;
        res.status(200).json({ message: "Successful deleting item", data: data.rows});

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error with query", error: error});
        
    } finally{
        client.end();
    }
});



module.exports = router;