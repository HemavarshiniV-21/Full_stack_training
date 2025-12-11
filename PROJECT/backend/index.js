require("dotenv").config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("DB Error:", err));

const UserSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    }
});

const User = mongoose.model('User', UserSchema);

const employeeSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    department: { 
        type: String, 
        required: true 
    },
    salary: { 
        type: Number, 
        required: true 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Employee = mongoose.model('Employee', employeeSchema);

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ token });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).send("Invalid credentials");
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(400).send("Invalid credentials");
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.json({ token });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).send("No token provided");
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send("Invalid token");
        req.userId = decoded.userId;
        next();
    });
};

app.post('/api/employee', verifyToken, async (req, res) => {
    try {
        const { name, email, department, salary } = req.body;
        const employee = new Employee({
            name,
            email,
            department,
            salary,
            user: req.userId
        });
        await employee.save();
        res.status(201).send("Employee added");
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

app.get('/api/employee', verifyToken, async (req, res) => {
    try {
        const employees = await Employee.find({ user: req.userId });
        res.json(employees);
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

app.delete('/api/employee/:id', verifyToken, async (req, res) => {
    try {
        const deleted = await Employee.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });
        if (!deleted) return res.status(404).send("Employee not found");
        res.send("Employee deleted");
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

app.put('/api/employee/:id', verifyToken, async (req, res) => {
    try {
        const updated = await Employee.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).send("Employee not found");
        res.json(updated);
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
