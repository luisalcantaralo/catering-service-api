const express = require('express');
const router = express.Router();
const {connectionData} = require('../config/db');
const { Client } = require('pg');
const pgFormat = require('pg-format'); //Needed for inserting multiple rows at once


// Done testing


// GETs all orders with customer info and products
router.get('/',async (req, res, next) => {
    const client = new Client(connectionData)
    client.connect();
    
    try {
        const data = await client.query('SELECT * FROM order_info');
        res.status(200).json({ orders: data.rows});

    } catch (error) {
        next({status: 500, message: error.stack});
    } finally{
        client.end();
    }
   
});

// GETs specific order info (no client info)
router.get('/:id',async(req, res, next) => {
    const {id} = req.params;
    console.log(req.params);
    const client = new Client(connectionData)
    client.connect();
    try {
        const paramsQuery = [id]; 
        const data = await client.query('SELECT * FROM order_info WHERE order_id = $1', paramsQuery);
        let order = data.rows.length > 0 ? data.rows[0] : []
        res.status(200).json({ order });

    } catch (error) {
        next({status: 500, message: error.stack});
    } finally{
        client.end();
    }
});

//POST to order and all products to order_product
router.post('/', async(req, res, next) => {
    const client = new Client(connectionData)
    client.connect();
    const { order_date, order_time, order_event, persons, recurring, order_notes, amount_paid, customer_id, products } = req.body;
    const date = order_date + ' ' + order_time + ':00+00'
    try {

        let total_price = 0;
        let queryParameters = [];
        for (let i=0; i<products.length; ++i){

          let price = await client.query('SELECT price FROM products WHERE product_id = $1', [products[i]["id"]]);
          price = price.rows[0]["price"];

          total_price += parseFloat(price) * parseFloat(products[i]["quantity"]);
          queryParameters.push([0, products[i]["id"], products[i]["quantity"], parseFloat(price) * parseFloat(products[i]["quantity"])]);
        }

        let data = await client.query('INSERT INTO orders (customer_id, order_date, order_event, recurring, order_notes, total_price, amount_paid) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', [customer_id, date, order_event, recurring, order_notes, total_price, amount_paid]);
        const order_id = "" + data.rows[0]["order_id"];

        for (let i=0; i<queryParameters.length; ++i){
            queryParameters[i][0] = order_id
        }

        let query = pgFormat("INSERT INTO order_product (order_id, product_id, amount, price) VALUES %L", queryParameters);
        await client.query(query);

        res.status(200).json({ data: data.rows, message: "Successful inserting item"});

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error with query", error: error});
        
    } finally{
        client.end();
    }
});

// Not tested, POSTs new customer info along with order
router.post('/newCustomer', async(req, res, next) => {
    const client = new Client(connectionData)
    client.connect();
    const { customer_id, first_name, last_name, email, phone, street, city, county, state, zip_code, order_date, order_time, order_event, persons, recurring, order_notes, amount_paid, products } = req.body;
    const date = order_date + ' ' + order_time + ':00+00'
    try {

        let total_price = 0;
        let queryParameters = [];
        for (let i=0; i<products.length; ++i){

            let price = await client.query('SELECT price FROM products WHERE product_id = $1', [products[i]["id"]]);
            price = price.rows[0]["price"];
  
            total_price += parseFloat(price) * parseFloat(products[i]["quantity"]);
            queryParameters.push([0, products[i]["id"], products[i]["quantity"], parseFloat(price) * parseFloat(products[i]["quantity"])]);
          }

        let data = await client.query('INSERT INTO addresses (street, city, county, state, zip_code) VALUES($1, $2, $3, $4, $5) RETURNING *', [street, city, county, state, zip_code]);
        const address_id = "" + data.rows[0]["address_id"];

        data = await client.query('INSERT INTO customers (first_name, last_name, email, phone, address_id) VALUES($1, $2, $3, $4, $5) RETURNING *', [first_name, last_name, email, phone, address_id]);
        console.log(data.rows);
        res.status(200).json({ data: data.rows, message: "Successful inserting customer"});

        const customer_id = String(data.rows[0]["customer_id"]);
        data = await client.query('INSERT INTO orders (customer_id, order_date, order_event, recurring, order_notes, total_price, amount_paid) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', [customer_id, order_date, order_event, recurring, order_notes, total_price, amount_paid]);

        const order_id = "" + data.rows[0]["order_id"];

        for (let i=0; i<queryParameters.length; ++i){
            queryParameters[i][0] = order_id
        }

        let query = pgFormat("INSERT INTO order_product (order_id, product_id, amount, price) VALUES %L", queryParameters);
        data = await client.query(query);

        console.log(data.rows) ;
        res.status(200).json({ data: data.rows, message: "Successful inserting item"});


    } catch (error) {
        res.status(400).json({ message: "Error with query", error: error});
        
    } finally{
        client.end();
    }
});

// Updates order
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

// Deletes order
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
