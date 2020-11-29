const express = require('express');
const router = express.Router();
const {connectionData} = require('../config/db');
const { Client } = require('pg');

// GET all customers
router.get('/', async(req, res, next) => {
    const client = new Client(connectionData)
    client.connect();
    
    try {
        const data = await client.query('SELECT * FROM customers as c INNER JOIN addresses as a ON c.address_id = a.address_id');
        res.status(200).json({ customers: data.rows});

    } catch (error) {
        next({status: 500, message: error.stack});
    } finally{
        client.end();
    }
});

router.get('/verify', async(req, res, next) => {
    console.log("here");
    const client = new Client(connectionData)
    client.connect();

    const {email} = req.body;
    
    try {
        const data = await client.query('SELECT customer_id FROM customers where email = $1', [email]);
        console.log(data.rows);
        res.status(200).json(data.rows[0]);

    } catch (error) {
        next({status: 500, message: error.stack});
    } finally{
        client.end();
    }
});

// GET all customers
router.get('/', async(req, res, next) => {
    const client = new Client(connectionData)
    client.connect();
    
    try {
        const data = await client.query('SELECT * FROM customers as c INNER JOIN addresses as a ON c.address_id = a.address_id');
        res.status(200).json({ customers: data.rows});

    } catch (error) {
        next({status: 500, message: error.stack});
    } finally{
        client.end();
    }
});

// GET all customers and their orders
router.get('/orders', async(req, res, next) => {
    const client = new Client(connectionData)
    client.connect();
    
    try {
        const data = await client.query('SELECT * FROM customer_orders');
        res.status(200).json({ customers: data.rows});

    } catch (error) {
        next({status: 500, message: error.stack});
    } finally{
        client.end();
    }
});

// GET an specific customer given its id
router.get('/:id', async(req, res, next) => {
    const {id} = req.params;
    console.log(id);
    const client = new Client(connectionData)
    client.connect();
    try {
        const paramsQuery = [id]; 
        const data = await client.query('SELECT * FROM orders WHERE customer_id = $1', paramsQuery);
        res.status(200).json({ customer: data.rows});

    } catch (error) {
        next({status: 500, message: error.stack});
    } finally{
        client.end();
    }
});

// POST, create a customer
router.post('/', async(req, res, next) => {
    const client = new Client(connectionData)
    client.connect();
    const { first_name, last_name, email, phone, street, city, county, state, zip_code} = req.body;
    try {
        var data = await client.query('INSERT INTO addresses (street, city, county, state, zip_code) VALUES($1, $2, $3, $4, $5) RETURNING *', [street, city, county, state, zip_code]);
        const address_id = String(data.rows[0]["address_id"]);

        data = await client.query('INSERT INTO customers (first_name, last_name, email, phone, address_id) VALUES($1, $2, $3, $4, $5) RETURNING *', [first_name, last_name, email, phone, address_id]);
        res.status(200).json({ data: data.rows, message: "Successful inserting customer"});

    } catch (error) {
        res.status(400).json({ message: "Error with query", error: error});
        
    } finally{
        client.end();
    }
});

// PUT, edit an specific customer given its id
router.put('/:id', async(req, res, next) => {
    const client = new Client(connectionData)
    client.connect();
    const {id} = req.params;
    const {first_name, last_name, email, phone} = req.body;
    try {
        const data = await client.query('UPDATE customers SET first_name = $2, last_name = $3, email = $4, phone = $5 WHERE customer_id = $1', [id, first_name, last_name, email, phone]);
        console.log(data.rows) ;
        res.status(200).json({ data: data.rows, message: "Successful updating item"});

    } catch (error) {
        res.status(400).json({ message: "Error with query", error: error});
        
    } finally{
        client.end();
    }
});

// DELETE a customer given its id
router.delete('/:id', async(req, res, next) => {
    const client = new Client(connectionData)
    client.connect();
    const {id} = req.params;
    try {
        const data = await client.query(`DELETE FROM customers WHERE customer_id = $1`, [id]);
        res.status(200).json({ message: "Successful deleting item", data: data.rows});
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error with query", error: error});
    } finally{
        client.end();
    }
});

module.exports = router;