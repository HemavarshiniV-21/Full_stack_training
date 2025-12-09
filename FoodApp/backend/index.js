const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const FoodModel = require('./models/food');

const app = express()
const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URL,{})

app.use(cors());
app.use(express.json());

app.post('/Insert',async(req,res)=>{
    const foodName = req.body.foodName;
    const daysSinceIAte = req.body.daysSinceIAte;
    const food = new FoodModel({foodName: foodName,daysSinceIAte:daysSinceIAte});
    try{
        await food.save();
        res.status(201).send("Data inserted successfully");
    }
    catch(err){
        res.status(500).send("Error inserting food items");
    }
})

app.get('/read',async(req,res)=>{
    try{
        const foodItem = await FoodModel.find({});
        res.status(200).json(foodItem);
    }
    catch(error){
        res.status(500).send("Error reading food items");
    }

})

app.put('/update/',async (req,res)=>{
    const newFoodName = req.body.newFoodName;
    const id = req.body.id;
    try{
        await FoodModel.findByIdAndUpdate(id,{foodName: newFoodName});
        res.status(200).send("food item updated");
    }
    catch(err){
        res.status(500).send("error updating food items")
    }
})

app.delete('/delete/:id',async (req,res)=>{
    const id = req.params.id;
    try{
        await FoodModel.findByIdAndDelete(id);
        res.status(200).send("food item deleted");
    }
    catch(err){
        res.status(500).send("error deleting food items")
    }
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

mongoose.connect('mongodb+srv://root:root@cluster0.p9zycwn.mongodb.net/');