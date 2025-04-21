# Transport Management System

This is a transport management system built with Node.js, Express, and SQLite.

## Installation

1.  Install Node.js and npm.
2.  Clone the repository: `git clone <repository_url>`
3.  Navigate to the project directory: `cd web-app-project`
4.  Install dependencies: `npm install`

## Usage

1.  Run the backend server: `node Server/server.js`
2.  Open `client/index.html` in your browser.

## Database Setup

The application uses SQLite for data storage. The database files are:

*   `routes.db`: Contains user and booking data.
*   `acc.db`: Contains account data.

## API Endpoints

*   `POST /register`: Registers a new user.
*   `POST /login`: Logs in an existing user.
*   `GET /admin/employees`: Fetches employee data (admin only).
*   `GET /admin/accounts`: Fetches account data (admin only).
*   `GET /admin/bookings`: Fetches booking data (admin only).
*   `GET /admin/fleet`: Fetches fleet data (admin only).

## Authentication

The application uses JWT for authentication. (my token expires after 1hr)

## Dependencies

*   bcrypt
*   cors
*   dotenv
*   express
*   jsonwebtoken
*   pdfmake
*   sqlite3

## Contributing

Feel free to contribute to this project by submitting pull requests.