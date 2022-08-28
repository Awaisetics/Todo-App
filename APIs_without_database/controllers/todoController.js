let todos = require('../model/Todo');
const { message } = require('../validations/todoValidation');
const todoValidation = require('../validations/todoValidation');

let lastTodoId = 5;

const get = (req , res) => {
    res.json({ todos: todos });
};

const addTodo = (req , res , next) => {
    const errors = todoValidation.validate(req.body , {abortEarly : false})
    if (errors.error){
        const allErrors = errors.error.details.map(err => err.message);
        next({ status : 500 , message : allErrors});
        return;
    }
    const todo = req.body;
    todo._id = ++lastTodoId;
    todo.completed = false;
    todos.push(todo);
    res.json({ success: true , message: "Record Added" })
};

const update = (req , res , next) => {
    const errors = todoValidation.validate(req.body, { abortEarly: false })
    if (errors.error) {
        const allErrors = errors.error.details.map(err => err.message);
        next({ status: 500, message: allErrors });
        return;
    }
    const todoID = parseInt(req.body.id);
    const updatedName = req.body.name;
    const todo = todos.find( todo => todo._id === todoID);
    if(todo){
        todo.name = updatedName;
        res.json({ success: true , message: "Record Updated"})
    } else {
        next({ status: 404, message: "Todo Not Found" })
    }
};

const complete = (req , res , next) => {
    const todoID = parseInt(req.params.todoID);
    const todo = todos.find((todo) => todo._id == todoID);
    if (todo) {
       todo.completed = req.body.completed;
        res.json({ success: true , message: "Todo Completed" })
    }
    else {
        next({ status: 404, message: "Todo not Found" });
    }
};
const destroy = (req , res , next) => {
    const todoID = parseInt(req.params.todoID);
    const todo = todos.find((todo) => todo._id == todoID);
    if (todo) {
        let newTodos = todos.filter((todo) => todo._id != todoID)
        todos = newTodos;
        res.json({ success: true , message: "Record Deleted" })
    }
    else {
        next({ status: 404, message: "Todo not Found" });
    }
};

module.exports = { get , addTodo, update , destroy , complete }























