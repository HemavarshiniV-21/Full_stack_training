const mongoose = require('mongoose');
const TodoSchema = new mongoose.Schema({
    taskName:{
        type: String,
        required: true
    },
    taskStatus:{
        type: String,
        required: true
    }
});

const todo = mongoose.model('todo',TodoSchema);
module.exports = todo;