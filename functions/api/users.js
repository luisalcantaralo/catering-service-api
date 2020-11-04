const express = require('express');
const router = express.Router();

const verifyIfOneIsOne = (req, res, next) => {
  if (1 == 1){
    next();
  } else {  
    return res.status(500).json({ message: 'Not implemented!'});
  }
  
}

// Read some
router.get('/', verifyIfOneIsOne, (req, res, next) => {
  const users = [{name: 'Jordan'}, {name: 'Joaquin'}, {name: 'Luis'}]
  if (!users.length) {
    res.status(400).json({ success: false, message: 'No users in the db!'});
    return;
  }
  return res.status(200).json({ success: true, users: users});
});

// Read one
router.get('/:id', (req, res, next) => {
  
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