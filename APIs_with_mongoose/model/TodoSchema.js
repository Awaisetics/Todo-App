const monogoose = require('mongoose');

const TodoSchema = monogoose.Schema({
    name : {
        type : String,
        require : true,
        maxLength : 75,
    },
    completed : {
        type : Boolean,
        default : false,
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    }
   
});

module.exports = monogoose.model('todo' , TodoSchema);