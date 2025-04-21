# Admin Roles Implementation Plan

**Goal:** Implement admin roles with different views for each role, and generate monthly reports as downloadable PDFs.

**Plan:**

1.  **Database Update:**
    *   Update the `users` table in `routes.db` to include the following `category` values: `administrator`, `booking_manager`, `fleet_manager`, and `accountant`.
    *   Ensure existing users have a default category assigned (e.g., `passenger` or `administrator` based on their previous role).

2.  **Backend Changes (Server/server.js):**
    *   Modify the `/login` endpoint to return the user's `category` along with the JWT token.
    *   Create middleware functions to check the user's role based on the `category` in the JWT token.
    *   Apply these middleware functions to the admin API endpoints to restrict access based on the user's role. For example:
        *   `/admin/employees`: Only accessible to `administrator`.
        *   `/admin/bookings`: Accessible to `administrator` and `booking_manager`.
        *   `/admin/fleet`: Accessible to `administrator` and `fleet_manager`.
        *   `/admin/accounts`: Accessible to `administrator` and `accountant`.
    *   Implement the logic to generate monthly reports as downloadable PDFs. This might involve using a library like `pdfmake` or `jsPDF`. The reports should include:
        *   Seat capacity analytics.
        *   Traffic and routes updates.
        *   Financial records (for `accountant`).

3.  **Frontend Changes (client/admin.html and script.js):**
    *   Create separate HTML files for each admin role: `admin_administrator.html`, `admin_booking_manager.html`, `admin_fleet_manager.html`, and `admin_accountant.html`.
    *   Modify `script.js` to:
        *   Redirect the user to the appropriate admin view based on their `category` after successful login.
        *   Fetch and display data relevant to the user's role in each view.
        *   Implement the functionality to download monthly reports as PDFs.

**Mermaid Diagram:**

```mermaid
graph LR
    A[User Login] --> B{Authentication}
    B -- Success --> C{Get User Category}
    C --> D{Role-Based Redirection}
    D -- administrator --> E[admin_administrator.html]
    D -- booking_manager --> F[admin_booking_manager.html]
    D -- fleet_manager --> G[admin_fleet_manager.html]
    D -- accountant --> H[admin_accountant.html]
    E --> I[Fetch Employee Data]
    F --> J[Fetch Booking Data]
    G --> K[Fetch Fleet Data]
    H --> L[Fetch Account Data]
    I --> M[Display Employee Data]
    J --> N[Display Booking Data]
    K --> O[Display Fleet Data]
    L --> P[Display Account Data]
    E --> Q[Generate Reports (administrator)]
    F --> R[Generate Reports (booking_manager)]
    G --> S[Generate Reports (fleet_manager)]
    H --> T[Generate Reports (accountant)]
    Q & R & S & T --> U[Download PDF]