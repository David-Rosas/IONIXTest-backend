const express = require('express');
const router = express.Router();
const {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    statusTask
} = require('../controllers/TasksController');

const {
    createTaskValidate,
    validate,
  } = require("../helpers/validator");

const { middlewareAuth } = require("../middlewares/isAuth");

router.post('/api/tasks', createTaskValidate, middlewareAuth, validate, createTask);
router.get('/api/tasks', middlewareAuth, validate, getAllTasks);
router.get('/api/tasks/:taskId', middlewareAuth, validate, getTaskById);
router.put('/api/tasks/:taskId', middlewareAuth, validate, updateTask);
router.delete('/api/tasks/:taskId', middlewareAuth, validate, deleteTask);

router.get('/api/status', middlewareAuth, statusTask);

module.exports = router;