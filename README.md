# Web Application Project

This project is a web application built with Express.js, providing user authentication, booking management, and admin functionalities.

## Features

*   **User Authentication:** Users can register and log in using email and password. Password hashing is implemented using bcrypt, and JWT is used for authentication.
*   **Booking Management:** Users can submit booking requests.
*   **Admin Panel:** Authenticated administrators can manage employees, accounts, bookings, and fleet data.

## Technologies Used

*   Express.js
*   SQLite
*   bcrypt
*   jsonwebtoken
*   CORS

## Setup

1.  Install dependencies: `npm install`
2.  Run the server: `node server.js`

The application will be running on `http://localhost:3000`.