dd aconst express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); // Import CORS
const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all requests
app.use(express.static('client'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Database setup
const db = new sqlite3.Database('routes.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the routes database.');
});

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    destination TEXT,
    pickup TEXT,
    route TEXT,
    email TEXT,
    payment TEXT
)`);

// API endpoint to handle form submissions
app.post('/submit-route', (req, res) => {
    const { name, destination, pickup, route, email, payment } = req.body;

    db.run(
        `INSERT INTO bookings (name, destination, pickup, route, email, payment) VALUES (?, ?, ?, ?, ?, ?)`,
        [name, destination, pickup, route, email, payment],
        function(err) {
            if (err) {
                console.error("Error inserting booking:", err.message);
                return res.status(500).json({ success: false, message: 'Database error', error: err.message });
            }
            console.log(`A row has been inserted with rowid ${this.lastID}`);
            res.json({ success: true, message: 'Booking submitted successfully!', bookingId: this.lastID });
        }
    );
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (row) {
            res.json({ success: true, message: 'Sign in successful!' });
        } else {
            res.status(401).json({ success: false, message: 'Please enroll' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const row = await new Promise((resolve, reject) => {
            db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        if (row) {
            return res.status(409).json({ success: false, message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        await new Promise((resolve, reject) => {
            db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [name, email, hashedPassword], function(err) {
                if (err) {
                    reject(err);
                } else {
                    console.log(`A row has been inserted with rowid ${this.lastID}`);
                    resolve();
                }
            });
        });

        res.status(201).json({ success: true, message: 'Registration successful!' });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});