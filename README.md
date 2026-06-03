# College Event Registration Portal

A full-stack web application that allows college administrators to manage events and students to register for them.

## Tech Stack
- **Frontend**: Plain HTML, CSS, JavaScript (Vanilla JS SPA)
- **Backend**: Node.js & Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT token-based authentication

## Prerequisites
- Node.js installed
- MongoDB installed (running locally on default port 27017, or a MongoDB Atlas URI)
- npm (Node Package Manager)

## Setup Instructions

1. **Clone the repository**
   \`\`\`bash
   git clone <link-to-repo>
   cd inspirante-[yourfirstname]
   \`\`\`

2. **Backend Setup**
   Navigate to the server directory and install dependencies:
   \`\`\`bash
   cd server
   npm install
   \`\`\`
   
   *Note: The frontend uses plain static files so there are no client npm dependencies to install.*

3. **Environment Setup**
   Copy the example `.env` file within the `server/` root:
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   Fill in your actual `MONGO_URI` (if different from default `mongodb://localhost:27017/college-events`) and `JWT_SECRET` in `.env`.

4. **Seed Database**
   Populate the database with the sample credentials:
   \`\`\`bash
   npm run seed
   \`\`\`

5. **Run the Application**
   From the `server` directory, run the full application:
   \`\`\`bash
   npm run dev
   \`\`\`
   The Express server will start up and serve both the API on `/api` and the static frontend UI.

6. **Access the Portal**
   Open your browser and navigate to:
   [http://localhost:3000](http://localhost:3000)

7.**Deployed live url**
  URL = https://inspirante-vaishakh.onrender.com
  
## Sample Credentials

**Admin Account:**
- User: `admin`
- Pass: `inspirante2026`

**Student Accounts:**
- `asha.rao` / `student123`
- `ravi.shetty` / `student123`
- `meera.nair` / `student123`
- `kiran.bhat` / `student123`
- `divya.kamath` / `student123`
- `suresh.pai` / `student123`
- `ananya.hegde` / `student123`
- `rohan.shenoy` / `student123`
- `nisha.prabhu` / `student123`
- `tejas.mallya` / `student123`
- `priya.bangera` / `student123`

## Known Issues or Incomplete Parts
- **Date Picking UI**: Used the native HTML5 `<input type="date">` for the admin create event form. While highly functional, it lacks custom visual branding across different browsers.
- **Form Data Reset**: While navigating, client side JS doesn't strictly cache form inputs if the user accidentally navigates back, making it a standard single-page app without persistence across unsubmitted forms.
- **No Pagination**: The lists of events and registrations load entirely on a single page instead of chunking or paginating data. Better suited for smaller datasets as specified.
