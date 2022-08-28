const joi = require('joi');

const addTodoValidation = joi.object({
    name: joi.string().required().max(75),
    completed : joi.boolean()
});

const updateTodoValidation = joi.object({
    id : joi.required(),
    name : joi.string().max(75),
    completed : joi.boolean()
});

exports.addTodoValidation = addTodoValidation;
exports.updateTodoValidation = updateTodoValidation;