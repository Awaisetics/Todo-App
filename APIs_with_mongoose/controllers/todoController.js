const Todo = require('../model/TodoSchema');
const { addTodoValidation , updateTodoValidation} = require('../validations/todoValidation'); 

const get = async (req , res , next) => {
    try {
        const todos = await Todo.find({});
        res.json({ todos });
    } 
    catch (error) {
        next({ status : 404 , message : error.message})
    }
};

const addTodo = async (req , res , next) => {
    const errors = addTodoValidation.validate(req.body , {abortEarly : false})
    if (errors.error){
        const allErrors = errors.error.details.map(err => err.message);
        next({ status : 500 , message : allErrors});
        return;
    }
    
    try {
        const todo = await Todo.create(req.body);
        res.status(201).json({ todo , message : 'Record Added'});
    } 
    catch (error) {
        next({ status: 500, message: error.message })
    }
};

const update = async (req , res , next) => {

    const id = req.body.id;
    if(!id) {
        return next({ status : 404 , message : 'ID Is Missing' })
    }
    
    const errors = updateTodoValidation.validate(req.body, { abortEarly: false })
    if (errors.error) {
        const allErrors = errors.error.details.map(err => err.message);
        return next({ status: 400, message: allErrors });
    }

    console.log(id);
    try {
        const todo = await Todo.findByIdAndUpdate(id , {
            $set : {
                name : req.body.name
            }
        }, {new : true})
        res.status(201).json({ todo , message: "Record Updated" })
    } 
    catch (error) {
        next({ status: 500, message: error.message })
    }
};


const complete = async (req, res, next) => {

    const id = req.params.todoID;
    if (!id) {
        return next({ status: 404, message: 'ID Is Missing' })
    }
    
    try {
        const todo = await Todo.findByIdAndUpdate(id, {
            $set: {
                completed: req.body.completed
            }
        }, { new: true })
        res.status(201).json({ todo, message: "Record Updated" })
    }
    catch (error) {
        next({ status: 500, message: error.message })
    }
};

const destroy = async (req , res , next) => {
    const id = req.params.todoID;
    if (!id) {
        return next({ status: 404, message: 'ID Is Missing' })
    }

    try {
        const todo = await Todo.findByIdAndDelete(id)
        res.json({message : 'Todo Item Deleted'});
    } 
    catch (error) {
        next({ status: 500, message: error.message })
    }
};

module.exports = { get , addTodo, update , destroy , complete }























