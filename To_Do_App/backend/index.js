const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const TaskModel = require('./models/todo');

const app = express()
const PORT = process.env.PORT || 8000;


app.use(cors());
app.use(express.json());

app.post('/insert',async(req,res)=>{
    const taskName = req.body.taskName;
    const taskStatus = req.body.taskStatus;
    const todo = new TaskModel({taskName: taskName,taskStatus:taskStatus});
    try{
        await todo.save();
        res.status(201).send("Data inserted successfully");
    }
    catch(err){
        res.status(500).send("Error inserting todo list");
    }
})

app.get('/read',async (req,res) =>{
    try{
        const taskList = await TaskModel.find({});
        res.status(200).json(taskList);
    }
    catch(error){
        res.status(500).send("Error reading todo list");
    }

})

app.put('/update/',async (req,res)=>{
    const newTaskName = req.body.newTaskName;
    const id = req.body.id;
    try{
        await TaskModel.findByIdAndUpdate(id,{taskName: newTaskName});
        res.status(200).send("new task updated");
    }
    catch(err){
        res.status(500).send("error updating task")
    }
})

app.delete('/delete/:id',async (req,res)=>{
    const id = req.params.id;
    try{
        await TaskModel.findByIdAndDelete(id);
        res.status(200).send("task deleted");
    }
    catch(err){
        res.status(500).send("error deleting task")
    }
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

mongoose.connect('mongodb+srv://root:root@cluster0.p9zycwn.mongodb.net/');