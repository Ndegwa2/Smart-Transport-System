# Authentication and Registration Implementation Plan

## I. Backend Implementation:

1.  **Technology Stack:**
    *   **Language:** Node.js with Express.js
    *   **Database:** MongoDB with Mongoose ORM
    *   **Authentication:** JSON Web Tokens (JWT)
    *   **Password Hashing:** bcrypt

2.  **API Endpoints:**
    *   `POST /api/register`: Registers a new user.
        *   **Input:** `name`, `email`, `password`
        *   **Output:** `success`, `message`, `token` (if successful)
    *   `POST /api/login`: Logs in an existing user.
        *   **Input:** `email`, `password`
        *   **Output:** `success`, `message`, `token` (if successful)
    *   `GET /api/user`: Gets the current user's information (requires authentication).
        *   **Input:** JWT token in the `Authorization` header
        *   **Output:** `success`, `message`, `user` (if successful)

3.  **Database Schema (MongoDB):**
    ```javascript
    const userSchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
    });
    ```

4.  **Authentication Middleware:**
    *   Create a middleware function to verify the JWT token in the `Authorization` header.
    *   If the token is valid, attach the user object to the request.
    *   If the token is invalid, return an error.

## II. Frontend Implementation:

1.  **Update `routes.html`:**
    *   Remove the inline login and registration forms.
    *   Add JavaScript functions to handle form submission and API calls.
    *   Store the JWT token in local storage.
    *   Update the UI based on the user's authentication status (e.g., show "Sign Out" button if logged in).

2.  **JavaScript Functions:**
    *   `registerUser(name, email, password)`: Sends a `POST` request to `/api/register`.
    *   `loginUser(email, password)`: Sends a `POST` request to `/api/login`.
    *   `getUser()`: Sends a `GET` request to `/api/user` with the JWT token in the `Authorization` header.
    *   `logoutUser()`: Removes the JWT token from local storage and updates the UI.

3.  **UI Updates:**
    *   Show/hide the "Sign In" and "Enroll" buttons based on the user's authentication status.
    *   Display the user's name or account icon when logged in.

## III. Implementation Steps:

1.  **Backend Setup:**
    *   Create a new Node.js project with Express.js.
    *   Install the necessary dependencies (mongoose, bcrypt, jsonwebtoken).
    *   Define the database schema and API endpoints.
    *   Implement the authentication middleware.

2.  **Frontend Updates:**
    *   Update `routes.html` to remove the inline forms and add the necessary JavaScript functions.
    *   Implement the UI updates based on the user's authentication status.

3.  **Testing:**
    *   Test the registration and login functionality.
    *   Test the authentication middleware.
    *   Test the UI updates.

## IV. Mermaid Diagram:

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: Clicks "Enroll"
    Frontend->>Frontend: Displays registration form
    User->>Frontend: Enters registration details
    Frontend->>Backend: POST /api/register (name, email, password)
    Backend->>Database: Create user (name, email, hashedPassword)
    Database->>Backend: User created
    Backend->>Backend: Generate JWT token
    Backend->>Frontend: { success: true, message: "User registered", token: JWT }
    Frontend->>Frontend: Store JWT token in local storage
    Frontend->>Frontend: Update UI (show "Sign Out")

    User->>Frontend: Clicks "Sign In"
    Frontend->>Frontend: Displays login form
    User->>Frontend: Enters login details
    Frontend->>Backend: POST /api/login (email, password)
    Backend->>Database: Verify user (email, hashedPassword)
    Database->>Backend: User verified
    Backend->>Backend: Generate JWT token
    Backend->>Frontend: { success: true, message: "User logged in", token: JWT }
    Frontend->>Frontend: Store JWT token in local storage
    Frontend->>Frontend: Update UI (show "Sign Out")

    User->>Frontend: Navigates to page
    Frontend->>Backend: GET /api/user (Authorization: JWT)
    Backend->>Database: Get user by ID
    Database->>Backend: User data
    Backend->>Frontend: { success: true, message: "User data", user: User }
    Frontend->>Frontend: Update UI (display user info)