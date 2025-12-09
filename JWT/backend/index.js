const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://root:root@cluster0.p9zycwn.mongodb.net/mydb")
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
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
const User= mongoose.model('User', UserSchema);

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    daysSinceIAte: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Food = mongoose.model('Food', foodSchema);

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send({ error: 'username and password are required' });
        }
        // Check for existing user to avoid duplicate-key errors
        const existing = await User.findOne({ username });
        if (existing) {
            return res.status(400).send({ error: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).send({ error: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send('Invalid credentials');
        }
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).send({ error: err.message });
    }
});

const verifyToken = (req, res, next) => {
    let authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) {
        return res.status(401).send('Access denied. No token provided.');
    }
    // Accept formats: "Bearer <token>" or just the token
    const parts = authHeader.split(' ');
    const token = parts.length === 2 && parts[0].toLowerCase() === 'bearer' ? parts[1] : parts[0];
    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) {
            return res.status(401).send('Invalid token.');
        }
        req.userId = decoded.userId;
        next();
    });
};

// Create food entry (protected)
app.post('/api/food', verifyToken, async (req, res) => {
    try {
        const { name, daysSinceIAte } = req.body;
        const food = new Food({ name, daysSinceIAte, user: req.userId });
        await food.save();
        res.status(201).send('Food entry created');
    } catch (err) {
        console.error('Create food error:', err);
        res.status(500).send({ error: err.message });
    }
});

app.get('/api/food', verifyToken, async (req, res) => {
    try {
        const foodEntries = await Food.find({ user: req.userId });
        res.json(foodEntries);
    } catch (err) {
        console.error('Get food error:', err);
        res.status(500).send({ error: err.message });
    }
});

//delete
app.delete('/api/food/:id', verifyToken, async (req, res) => {
    try {
        const foodEntry = await Food.findOneAndDelete({ _id: req.params.id, user: req.userId });    
        if (!foodEntry) {
            return res.status(404).send('Food entry not found');
        }   
        res.send('Food entry deleted');
    } catch (err) {
        console.error('Delete food error:', err);
        res.status(500).send({ error: err.message });
    }
});

///update 
app.put('/api/food/:id', verifyToken, async (req, res) => {
    try {
        const { daysSinceIAte } = req.body;
        const foodEntry = await Food.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            { daysSinceIAte },
            { new: true }
        );
        if (!foodEntry) {
            return res.status(404).send('Food entry not found');
        }   
        res.json(foodEntry);
    } catch (err) {
        console.error('Update food error:', err);
        res.status(500).send({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});