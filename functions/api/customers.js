const express = require('express');
const db = require('../config/db');

const router = express.Router();

// Read some
router.get('/', async(req, res, next) => {
    try {
        const data = await db.query('SELECT * FROM customers');
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
    try {
        const paramsQuery = [id]; 
        const data = await db.query('SELECT * FROM customers WHERE customer_id = %1', paramsQuery);
        console.log(data.rows) ;
        res.status(200).json({ customer: data.rows});

    } catch (error) {
        
    } finally{
        db.end();
    }
});

// Create one
router.post('/', (req, res, next) => {
  
});

// Update one
router.put('/:id', (req, res, next) => {
  
});

// Delete one
router.delete('/:id', (req, res, next) => {
  
});



module.exports = router;