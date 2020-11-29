const express = require('express');
const router = express.Router();
const {connectionData} = require('../config/db');
const { Client } = require('pg');

// GET all products 
router.get('/', async(req, res, next) => {
  const client = new Client(connectionData)
  client.connect();
  
  try {
    const data = await client.query('SELECT * FROM products');
    res.status(200).json({ products: data.rows});
  } catch (error) {
    next({status: 500, message: error.stack});
  } finally{
    client.end();
  } 
});


// GET a single product given its id
router.get('/:id',async(req, res, next) => {
    const {id} = req.params;
    console.log(req.params);
    const client = new Client(connectionData)
    client.connect();
    try {
        const paramsQuery = [id]; 
        const data = await client.query('SELECT * FROM products WHERE product_id = $1', paramsQuery);
        console.log(data.rows) ;
        res.status(200).json({ message: data.rows});

    } catch (error) {
        next({status: 500, message: error.stack});
    } finally{
        client.end();
    }
});

// POST, add a product to the database
router.post('/', async(req, res, next) => {
    const client = new Client(connectionData)
    client.connect();
    const { product_name, description, category, price, measure, active, filename } = req.body;
    try {
        var data = await client.query('INSERT INTO products (product_name, description, category, price, measure, active, filename) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', [product_name, description, category, price, measure, active, filename]);
        console.log(data.rows);
        res.status(200).json({ data: data.rows, message: "Successful inserting product"});

    } catch (error) {
        res.status(400).json({ message: "Error with query", error: error});
        
    } finally{
        client.end();
    }
});

// PUT, update a product given its id
router.put('/:id', async(req, res, next) => {
    const client = new Client(connectionData)
    client.connect();
    const {id} = req.params;
    const {product_name, description, category, price, measure, active, filename} = req.body;
    try {
        const data = await client.query('UPDATE products SET product_name = $2, description = $3, category = $4, price = $5, measure = $6, active = $7, filename = $8 WHERE product_id = $1', [id, product_name, description, category, price, measure, active, filename]);
        console.log(data.rows) ;
        res.status(200).json({ data: data.rows, message: "Successful updating product"});

    } catch (error) {
        res.status(400).json({ message: "Error with query", error: error});
        
    } finally{
        client.end();
    }
});

// Done testing
router.delete('/:id', async(req, res, next) => {
    const client = new Client(connectionData)
    client.connect();
    const {id} = req.params;
    try {
        const data = await client.query(`DELETE FROM products WHERE product_id = ${id}`);
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
