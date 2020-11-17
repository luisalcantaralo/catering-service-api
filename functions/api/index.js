const express = require('express');
const customers = require('./customers');
const products = require('./products');
const orders = require('./orders');
const addresses = require('./addresses');
const order_info = require('./order_info');



const router = express.Router();

router.use('/customers', customers);
router.use('/orders', orders);
router.use('/addresses', addresses);
router.use('/order_info', order_info);
router.use('/products', products);



module.exports = router;
