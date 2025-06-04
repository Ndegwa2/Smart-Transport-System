# System Description

This document provides a detailed description of the different views in the Transport Management System.

## 1. Landing Page (`client/landing page.html`)

*   **Purpose:** The main entry point for users to learn about the system and access its features.
*   **Functionalities:**
    *   **Information Display:** Presents a welcome message, system description, popular routes, mission, vision, and contact information.
    *   **Navigation:** Provides links to the booking page and routes page.
    *   **User Authentication:** Allows users to sign in or register.
        *   **Sign In:** Sends a POST request to `/login` to authenticate users. Upon successful login, users are redirected based on their category.
        *   **Registration:** Sends a POST request to `/register` to create new user accounts.

## 2. Admin Dashboard (`client/admin.html`)

*   **Purpose:** A central hub for administrators to manage various aspects of the system.
*   **Functionalities:**
    *   **Data Management:** Provides access to sections for managing employees, accounts, bookings, and fleet data.
    *   **Navigation:** Includes a link to the `hashed_accounts.html` page for viewing sensitive account information.
    *   **Data Display:** The actual data is likely fetched and displayed using JavaScript (`script.js`).

## 3. Routes Page (`client/routes.html`)

*   **Purpose:** To display available routes and related information.
*   **Functionalities:**
    *   **Route Information:** Shows a list of routes with their fleet size and available seats.
    *   **Real-time Updates:** Provides traffic and weather updates.
    *   **Analytics:** Displays seat capacity analytics.