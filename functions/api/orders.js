const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Read some
router.get('/', async (req, res, next) => {
    try {
        const data = await db.query('SELECT * FROM orders');
        console.log(data.rows) ;
        res.status(200).json({ orders: data.rows});

    } catch (error) {
        
    } finally{
        db.end();
    }

    
});

// Read one
router.get('/:id', async(req, res, next) => {
    const {id} = req.params;
    console.log(req.params);
    try {
        const paramsQuery = [id]; 
        const data = await db.query('SELECT * FROM orders WHERE order_id = $1', paramsQuery);
        console.log(data.rows) ;
        res.status(200).json({ order: data.rows});

    } catch (error) {
        
    } finally{
        db.end();
    }
});

// Create one
router.post('/', async(req, res, next) => {
    const { customer_id, order_date, order_event, recurring, order_notes, total_price, amount_paid} = req.params;
    try {
        const paramsQuery = [customer_id, order_date, order_event, recurring, order_notes, total_price, amount_paid]; 
        const data = await db.query('INSERT INTO orders (customer_id, order_date, order_event, recurring, order_notes, total_price, amount_paid) VALUES($1, $2, $3, $4, $5, $6, $7)', paramsQuery);
        console.log(data.rows) ;
        res.status(200).json({ message: data.rows});

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error with query", error: error});
        
    } finally{
        db.end();
    }
});

// Update one
router.put('/:id', async(req, res, next) => {
    const {order_id, customer_id, order_date, order_event, recurring, order_notes, total_price, amount_paid} = req.params;
    try {
        const paramsQuery = [customer_id, order_date, order_event, recurring, order_notes, total_price, amount_paid, order_id]; 
        const data = await db.query('UPDATE orders SET customer_id = $1, order_date = $2, order_event = $3, recurring = $4, order_notes= $5, total_price= $6, amount_paid = $7 WHERE order_id = $8', paramsQuery);
        console.log(data.rows) ;
        res.status(200).json({ message: data.rows});

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error with query", error: error});
        
    } finally{
        db.end();
    }
});

// Delete one
router.delete('/:id', async (req, res, next) => {
    const {order_id} = req.params;
    try {
        const paramsQuery = [customer_id, order_date, order_event, recurring, order_notes, total_price, amount_paid, order_id]; 
        const data = await db.query('UPDATE orders SET customer_id = $1, order_date = $2, order_event = $3, recurring = $4, order_notes= $5, total_price= $6, amount_paid = $7 WHERE order_id = $8', paramsQuery);
        console.log(data.rows) ;
        res.status(200).json({ message: data.rows});

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error with query", error: error});
        
    } finally{
        db.end();
    }
});



module.exports = router;