const express = require('express');
const router = express.Router();
const {connectionData} = require('../config/db');
const { Client } = require('pg');



// Done testing
router.get('/',async (req, res, next) => {
    const client = new Client(connectionData)
    client.connect();
    
    try {
        const data = await client.query('SELECT * FROM orders');
        console.log(data.rows) ;
        res.status(200).json({ message: data.rows});

    } catch (error) {
        next({status: 500, message: error.stack});
    } finally{
        client.end();
    }
   
});

// Done testing
router.get('/:id',async(req, res, next) => {
    const {id} = req.params;
    console.log(req.params);
    const client = new Client(connectionData)
    client.connect();
    try {
        const paramsQuery = [id]; 
        const data = await client.query('SELECT * FROM orders WHERE order_id = $1', paramsQuery);
        console.log(data.rows) ;
        res.status(200).json({ message: data.rows});

    } catch (error) {
        next({status: 500, message: error.stack});
    } finally{
        client.end();
    }
});

// Done testing
router.post('/', async(req, res, next) => {
    const client = new Client(connectionData)
    client.connect();
    const { customer_id, order_date, order_event, recurring, order_notes, total_price, amount_paid} = req.body;
    try {
        const data = await client.query('INSERT INTO orders (customer_id, order_date, order_event, recurring, order_notes, total_price, amount_paid) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', [customer_id, order_date, order_event, recurring, order_notes, total_price, amount_paid]);
        console.log(data.rows) ;
        res.status(200).json({ data: data.rows, message: "Successful inserting item"});

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error with query", error: error});
        
    } finally{
        client.end();
    }
});

// Done testing
router.put('/:id', async(req, res, next) => {
    const client = new Client(connectionData)
    client.connect();
    const {id} = req.params;
    const {customer_id, order_date, order_event, recurring, order_notes, total_price, amount_paid} = req.body;
    console.log(req.body);
    try {
        const data = await client.query('UPDATE orders SET customer_id = $2, order_date = $3, order_event = $4, recurring = $5, order_notes= $6, total_price= $7, amount_paid = $8 WHERE order_id = $1', [id, customer_id, order_date, order_event, recurring, order_notes, total_price, amount_paid]);
        console.log(data.rows) ;
        res.status(200).json({ data: data.rows, message: "Successful updating item"});

    } catch (error) {
        res.status(400).json({ message: "Error with query", error: error});
        
    } finally{
        client.end();
    }
});

// Done testing
router.delete('/:id', async (req, res, next) => {
    const client = new Client(connectionData)
    client.connect();
    const {id} = req.params;
    try {
        console.log(id);
        const data = await client.query(`DELETE FROM orders WHERE order_id = ${id}`);
        res.status(200).json({ message: "Successful deleting item", data: data.rows});

    } catch (error) {
        res.status(400).json({ message: "Error with query", text: error});
        
    } finally{
        client.end();
    }
});



module.exports = router;