# Architecture Decisions

### 1. Why I Chose the Stack
I built the application using **Node.js, Express, MongoDB (Mongoose), and plain HTML/CSS/Vanilla JS** for the frontend, following the exact project constraints requested in the brief (no React, no Tailwind/Bootstrap).

- **Node/Express**: Express offers a minimal, fast setup for RESTful APIs which pairs excellently with the SPA frontend requirements. This approach creates a clean separation of concerns without heavyweight boilerplate.
- **MongoDB**: The document-based schema handles relational lookups effectively using Mongoose `populate()`. It naturally scales with flexible JSON structures, and enforcing the unique index across `(student, event)` avoids concurrency and duplicate registrations perfectly natively at the DB level, without just relying on a manual check in Express.
- **Plain HTML/CSS/JS**: Bypassing a framework like React removed the need for a build step (Vite, Webpack) on the frontend. The `client` directory consists purely of static assets (`index.html`, `js/`, `css/`). These are served by Express using `express.static('client')`, maintaining simplicity. 

### 2. A Decision Not Specified in the Brief
**Frontend Architecture - Hash-based Single Page Application (SPA) Routing & Module Loading**
The brief did not specify whether the application should have multiple standalone HTML files (e.g., `login.html`, `events.html`) or operate as a Single Page Application (SPA) using just DOM replacement.
- *Decision*: I wrote a custom Vanilla JS mini SPA router in `client/js/app.js` using `window.location.hash`. 
- *Why*: It prevents full page reloads, offering a seamless and modern user experience mirroring React-like instantaneous transitions. Different logic areas were modularized (e.g. `client/js/pages/events.js`, `client/js/api.js`), and included directly in `index.html`. This ensures maintainability by avoiding spaghetti code, while keeping the repository footprint exceptionally low without any external dependencies for the client.

### 3. What I'd Improve with More Time
**Real-Time Realistion / WebSockets**
Currently, when students register for events or admins look at the dashboard, they fetch a static point in time for the registration count (`capacity` vs `registeredCount`). 
- If multiple students browse an almost full event simultaneously, they might both see "1 spot left" because data sync occurs exclusively on manual page refreshes or after completing a transaction. 
- With more time, I would integrate **Socket.io** to emit real-time capacity counter updates to all connected clients natively so users can watch the UI decrease availability in real-time.
