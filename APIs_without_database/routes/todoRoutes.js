const express = require('express');
const todoController = require('../controllers/todoController');

const router = express.Router();


router.get('/todos' , todoController.get);
router.post('/todo/add',  todoController.addTodo);
router.put('/todo/update' , todoController.update);
router.put('/todo/complete/:todoID' , todoController.complete);
router.delete('/todo/destroy/:todoID' , todoController.destroy);

module.exports = router;