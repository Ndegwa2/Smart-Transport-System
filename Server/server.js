require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const fs = require('fs');
const PdfPrinter = require('pdfmake');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.static('client'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Database setup
const db = new sqlite3.Database('routes.db', (err) => {
    if (err) return console.error(err.message);
    console.log('Connected to the routes database.');
});

const accDb = new sqlite3.Database('acc.db', (err) => {
    if (err) return console.error(err.message);
    console.log('Connected to the accounts database.');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        category TEXT DEFAULT 'passenger'
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
});

// Routes
app.get("/", (req, res) => res.redirect("/index.html"));

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    let jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.warn('JWT_SECRET not set, using default value. This is not recommended for production!');
        jwtSecret = 'default_jwt_secret';
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user?.category === 'administrator') next();
    else res.sendStatus(403);
};

const isBookingManager = (req, res, next) => {
    if (["administrator", "booking_manager"].includes(req.user?.category)) next();
    else res.sendStatus(403);
};

const isFleetManager = (req, res, next) => {
    if (["administrator", "fleet_manager"].includes(req.user?.category)) next();
    else res.sendStatus(403);
};

const isAccountant = (req, res, next) => {
    if (["administrator", "accountant"].includes(req.user?.category)) next();
    else res.sendStatus(403);
};

// User registration
app.post('/register', async (req, res) => {
    const { name, email, password, category = 'passenger' } = req.body;
    try {
        const existingUser = await new Promise((resolve, reject) => {
            db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (existingUser) return res.status(409).json({ success: false, message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO users (name, email, password, category) VALUES (?, ?, ?, ?)`,
                [name, email, hashedPassword, category],
                function (err) {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        res.status(201).json({ success: true, message: 'Registration successful!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await new Promise((resolve, reject) => {
            db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, category: user.category },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ success: true, message: 'Sign in successful!', token, name: user.name, category: user.category });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Submit Route Booking
app.post('/submit-route', (req, res) => {
    const { name, destination, pickup, route, email, payment } = req.body;
    const stmt = db.prepare(`INSERT INTO bookings (name, destination, pickup, route, email, payment) VALUES (?, ?, ?, ?, ?, ?)`);
    stmt.run([name, destination, pickup, route, email, payment], function (err) {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        res.json({ success: true, message: 'Booking submitted!', bookingId: this.lastID });
    });
});

// Admin Routes
app.get('/admin/employees', authenticateToken, isAdmin, (req, res) => {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true, data: rows });
    });
});

app.get('/admin/accounts', authenticateToken, isAccountant, (req, res) => {
    accDb.all(`SELECT * FROM accounts`, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true, data: rows });
    });
});

app.get('/admin/bookings', authenticateToken, isBookingManager, (req, res) => {
    db.all(`SELECT * FROM bookings`, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true, data: rows });
    });
});

app.get('/admin/fleet', authenticateToken, isFleetManager, (req, res) => {
    const fleetData = [
        { vehicle: 'Bus 1', route: 'Nairobi - Kisumu', driver: 'John Doe', conductor: 'Jane Smith', lastService: '2024-01-01', nextService: '2024-07-01' },
        { vehicle: 'Bus 2', route: 'Nairobi - Mombasa', driver: 'Peter Jones', conductor: 'Alice Brown', lastService: '2023-12-01', nextService: '2024-06-01' }
    ];
    res.json({ success: true, data: fleetData });
});

app.get('/admin/reports', authenticateToken, isAdmin, (req, res) => {
    db.all(`SELECT * FROM bookings`, [], (err, bookings) => {
        if (err) return res.status(500).json({ success: false });

        db.all(`SELECT * FROM users`, [], (err, users) => {
            if (err) return res.status(500).json({ success: false });

            const docDefinition = {
                content: [
                    { text: 'Monthly Report', style: 'header' },
                    { text: `Date: ${new Date().toLocaleDateString()}`, alignment: 'right' },
                    { text: '\nBookings', style: 'subheader' },
                    {
                        table: {
                            body: [
                                ['Name', 'Destination', 'Pickup', 'Route', 'Email'],
                                ...bookings.map(b => [b.name, b.destination, b.pickup, b.route, b.email])
                            ]
                        }
                    },
                    { text: '\nUsers', style: 'subheader' },
                    {
                        table: {
                            body: [
                                ['Name', 'Email', 'Category'],
                                ...users.map(u => [u.name, u.email, u.category])
                            ]
                        }
                    }
                ],
                styles: {
                    header: { fontSize: 22, bold: true, alignment: 'center', margin: [0, 0, 0, 20] },
                    subheader: { fontSize: 16, bold: true, margin: [0, 10, 0, 5] }
                }
            };

            const fonts = { Roboto: { normal: 'Helvetica', bold: 'Helvetica-Bold' } };
            const printer = new PdfPrinter(fonts);
            const pdfDoc = printer.createPdfKitDocument(docDefinition);
            const chunks = [];

            pdfDoc.on('data', chunk => chunks.push(chunk));
            pdfDoc.on('end', () => {
                const result = Buffer.concat(chunks);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename="monthly_report.pdf"');
                res.send(result);
            });

            pdfDoc.end();
        });
    });
});

// Server start
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
