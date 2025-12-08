const express = require('express');
const mongoose = require('mongoose');
const app = express()
const port = 3000
require('dotenv').config()
require('./db')


//GET

app.get('/',(req,res) => {
    res.end('Hello world!');
});


const userSchema = new mongoose.Schema({
    username: {type:String, required: true},
    email : {type:String,required:true, unique: true},
    age: {type:Number, required: true}
});
const User = mongoose.model('User', userSchema);

const newUser = new User({
    username: 'hema',
    email:'hema@gmail.com',
    age:21
});

newUser.save().then(() =>{
    console.log("user saved successfully");
}).catch((err)=>{
    console.log("error:",err);
});

app.get('/users/:userId/profile/:name/:age',(req,res) =>{
    const userId = req.params.userId;
    const name = req.params.name;
    const age  = req.params.age;
    res.send(`User ID is : ${userId}, Name:${name}, Age:${age}`);
});



//POST

app.put('/users', (req,res) => {
    res.setEncoding('PUT request to /users');
});


app.listen(process.env.PORT,() => {
    console.log('Example app listening at http://localhost:3000');
});


