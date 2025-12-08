const mongoose = require('mongoose');
const FoodSchema = new mongoose.Schema({
    foodName:{
        required: true
    },
    daysSinceIAte:{
        type: Number,
        required: tru
    }
});
const food = mongoose.model('food',FoodSchema);
module.exports = food;
