const express = require('express');
const customers = require('./customers');
const orders = require('./orders');

const router = express.Router();

router.use('/customers', customers);
router.use('/orders', orders);

module.exports = router;