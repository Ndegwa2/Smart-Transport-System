const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

// Accounts database setup
const accDb = new sqlite3.Database('acc.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the accounts database.');
});

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    category TEXT DEFAULT 'passenger'
)`);

db.run(`ALTER TABLE users ADD COLUMN category TEXT DEFAULT 'passenger'`);

db.run(`UPDATE users SET category = 'administrator' WHERE id = 1 AND NOT EXISTS (SELECT 1 FROM users WHERE category IS NOT NULL)`);
)`);

db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    destination TEXT,
    pickup TEXT,
    route TEXT,
    email TEXT,
    payment TEXT,
    distance TEXT,
    eta TEXT,
    total_fare TEXT
)`);

// API endpoint to handle form submissions
app.post('/submit-route', (req, res) => {
    const { name, destination, pickup, route, email, payment } = req.body;

    const stmt = db.prepare(`INSERT INTO bookings (name, destination, pickup, route, email, payment) VALUES (?, ?, ?, ?, ?, ?)`);
    stmt.run(
        [name, destination, pickup, route, email, payment],
        function(err) {
            if (err) {
                console.error("Error inserting booking:", err.message);
                return res.status(500).json({ success: false, message: 'Database error', error: err.message });
            }
            console.log(`A row has been inserted with rowid ${this.lastID}`);
            res.json({ success: true, message: 'Booking submitted successfully!', bookingId: this.lastID });
            stmt.finalize();
        }
    );
});

app.post('/book', (req, res) => {
    const { name, email, phone, seats, route, fare } = req.body;

    // Dummy values for distance and eta
    const distance = "450 km";
    const eta = "6 hours";
    const totalFare = fare;

    const stmt = db.prepare(`INSERT INTO bookings (name, email, phone, seats, route, fare, distance, eta, total_fare) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    stmt.run(
        [name, email, phone, seats, route, fare, distance, eta, totalFare],
        function(err) {
            if (err) {
                console.error("Error inserting booking:", err.message);
                return res.status(500).json({ success: false, message: 'Database error', error: err.message });
            }
            console.log(`A row has been inserted with rowid ${this.lastID}`);
            res.json({ success: true, message: 'Booking submitted successfully!', bookingId: this.lastID });
            stmt.finalize();
        }
    );
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
 
    try {
        // Retrieve user from the database
        const row = await new Promise((resolve, reject) => {
            const stmt = db.prepare(`SELECT * FROM users WHERE email = ?`);
            stmt.get([email], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
                stmt.finalize();
            });
        });
 
        if (!row) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
 
        // Compare the entered password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, row.password);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
 
        // Generate JWT token
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('JWT_SECRET environment variable not set!');
            return res.status(500).json({ success: false, message: 'JWT_SECRET not set' });
        }
        const token = jwt.sign({ userId: row.id }, jwtSecret, { expiresIn: '1h' });

        res.json({ success: true, message: 'Sign in successful!', token: token, name: row.name, category: row.category });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

app.post('/register', async (req, res) => {
    const { name, email, password, category } = req.body;

    try {
        // Check if user already exists
        const row = await new Promise((resolve, reject) => {
            const stmt = db.prepare(`SELECT * FROM users WHERE email = ?`);
            stmt.get([email], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
                stmt.finalize();
            });
        });

        if (row) {
            return res.status(409).json({ success: false, message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        await new Promise((resolve, reject) => {
            const stmt = db.prepare(`INSERT INTO users (name, email, password, category) VALUES (?, ?, ?, ?)`);
            stmt.run([name, email, hashedPassword, category], function(err) {
                if (err) {
                    reject(err);
                } else {
                    console.log(`A row has been inserted with rowid ${this.lastID}`);
                    resolve();
                }
                stmt.finalize();
            });
        });

        res.status(201).json({ success: true, message: 'Registration successful!' });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401);
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.error('JWT_SECRET environment variable not set!');
        return res.status(500).json({ success: false, message: 'JWT_SECRET not set' });
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.user = user;
        next();
    });
};

// Admin API endpoints
app.get('/admin/employees', authenticateToken, (req, res) => {
    // Fetch employee data from the database
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json({ success: true, data: rows });
    });
});

app.get('/admin/accounts', authenticateToken, (req, res) => {
    // Fetch account records from the acc database
    accDb.all(`SELECT * FROM accounts`, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json({ success: true, data: rows });
    });
});

app.get('/admin/bookings', authenticateToken, (req, res) => {
    // Fetch booking analytics
    db.all(`SELECT * FROM bookings`, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json({ success: true, data: rows });
    });
});

app.get('/admin/fleet', authenticateToken, (req, res) => {
    // Fetch fleet data
    const fleetData = [
        {
            vehicle: 'Bus 1',
            route: 'Nairobi - Kisumu',
            driver: 'John Doe',
            conductor: 'Jane Smith',
            lastService: '2024-01-01',
            nextService: '2024-07-01'
        },
        {
            vehicle: 'Bus 2',
            route: 'Nairobi - Mombasa',
            driver: 'Peter Jones',
            conductor: 'Alice Brown',
            lastService: '2023-12-01',
            nextService: '2024-06-01'
        }
    ];
    res.json({ success: true, data: fleetData });
});

app.get('/admin/hashed_accounts', authenticateToken, (req, res) => {
    // Fetch hashed accounts data from the acc database
    accDb.all(`SELECT * FROM hashed_accounts`, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json({ success: true, data: rows });
    });
});

