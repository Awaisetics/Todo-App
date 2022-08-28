const joi = require('joi');

const todoValodation = joi.object({
    id : joi.number(),
    name : joi.string().max(70),
    completed : joi.boolean()
});

module.exports = todoValodation;