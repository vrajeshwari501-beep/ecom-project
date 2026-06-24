const mssql = require('mssql');
const express = require('express');
const cors = require('cors');
const { poolPromise } = require('./dbConfig');
const app = express();

// Middleware (Data-வை handle பண்ண)
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Basic Route (Welcome Message)
app.get('/', (req, res) => {
    res.send('Welcome to Flipkart-Meesho Clone Backend! 🚀');
});

// Sign-Up Route
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('name', mssql.VarChar, name)
            .input('email', mssql.VarChar, email)
            .input('password', mssql.VarChar, password)
            .query('INSERT INTO Users (Name, Email, Password) VALUES (@name, @email, @password)');
        
        res.status(201).send('User Registered Successfully! 🎉');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('email', mssql.VarChar, email)
            .input('password', mssql.VarChar, password)
            .query('SELECT * FROM Users WHERE Email = @email AND Password = @password');

        if (result.recordset.length > 0) {
            res.status(200).send('Login Successful! 🎉');
        } else {
            res.status(401).send('Invalid email or password ❌');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Server Port Logic
const PORT = 5000;
// 🛍️ Get All Products Route (டேட்டாபேஸ்ல இருந்து ப்ராடக்ட்ஸ் எடுக்க)
app.get('/products', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Products');
        
        // டேட்டாபேஸ்ல இருக்குற எல்லா ப்ராடக்ட்ஸையும் JSON பார்மட்ல ஃபிரண்ட்-எண்டுக்கு அனுப்புறோம்
        res.json(result.recordset); 
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error: " + err.message);
    }
});
app.listen(PORT, () => {
    console.log(`Server running successfully on port ${PORT} 🔥`);
});
