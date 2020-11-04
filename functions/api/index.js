const express = require('express');

const customers = require('./customers');
const orders = require('./orders');
const users = require('./users');

const router = express.Router();

router.get('/', (req, res) => {
  return res.json({
    message: 'API working!'
  });
});

router.use('/customers', customers);
router.use('/orders', orders);
router.use('/users', users);

module.exports = router;