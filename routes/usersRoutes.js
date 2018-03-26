const express = require('express');
const router = express.Router();
const controller = require('../controllers/usersController');

router.get('/', controller.sayHello);
router.get('/bye', controller.sayGoodbye);
router.get('/users', controller.fetchUsers);
router.get('/users/:id', controller.fetchUser);


module.exports = router;