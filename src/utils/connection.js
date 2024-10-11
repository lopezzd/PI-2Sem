const express   = require('express');
const mysql     = require('mysql2');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Create a connection to the database
const db = mysql.createConnection({
    host: 'BD-ACD',
    user: 'BD080',
    password: 'yourPassword',
    database: 'yourDatabase'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

// Example route to get data
app.get('/data', (req, res) => {
    db.query('SELECT * FROM yourTable', (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

