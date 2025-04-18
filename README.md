# LCS Alliance University - Lecture Vault

## Project Overview

This project is a web application designed to provide students at LCS Alliance University secure access to recorded class lectures. Videos are hosted as unlisted YouTube videos, and access is managed through user authentication and class enrollment within this platform.

The primary goal is to ensure that only authorized students enrolled in specific classes can view the corresponding lecture videos, while administrators can manage classes, users, enrollments, and video links.

## Key Features

*   **Secure User Authentication:** Students and administrators log in with unique credentials. Uses JWT for session management.
*   **Role-Based Access Control:** Distinct roles (student, admin) with different permissions.
*   **Class Management (Admin):** Admins can create, view, and manage classes (subject, date, time, description).
*   **Video Management (Admin):** Admins can associate unlisted YouTube video IDs with specific classes and add relevant metadata.
*   **Student Enrollment:** Students can browse available classes and enroll. Admins approve/manage enrollment requests.
*   **Protected Video Access:** Only authenticated students with approved enrollment status for a class can view its associated videos.
*   **YouTube Integration:** Leverages YouTube for video hosting (unlisted videos) and embedding via the standard iframe player.
*   **User-Friendly Interface:** A clean dashboard for students to view enrolled classes and lectures, and an admin panel for management tasks.

## Technologies Used

This is a full-stack application built with:

**Frontend:**

*   **Framework/Library:** React.js
*   **Build Tool:** Vite
*   **Language:** TypeScript
*   **UI Components:** shadcn/ui
*   **Styling:** Tailwind CSS
*   **Routing:** React Router DOM
*   **State Management:** React Context API

**Backend:**

*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Language:** TypeScript
*   **Database:** MongoDB
*   **ODM:** Mongoose
*   **Authentication:** bcrypt (hashing), JSON Web Token (JWT)
*   **Middleware:** CORS

## Project Structure

The project is organized into two main parts:

*   **Root Directory (`/`):** Contains the frontend React application (Vite, src, public, etc.).
*   **Backend Directory (`/backend`):** Contains the backend Node.js/Express application (server logic, API routes, database models, etc.).

Each part has its own `package.json` and `node_modules`.

## Running Locally

**Prerequisites:**

*   Node.js (v16 or later recommended)
*   npm (comes with Node.js)
*   MongoDB Server (running locally or accessible via a connection string)
*   Git

**Steps:**

1.  **Clone the Repository:**
    ```bash
    git clone <YOUR_REPOSITORY_URL>
    cd <your-project-folder>
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```

3.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    cd .. 
    ```

4.  **Configure Environment Variables:**
    *   **Backend:** Create a file named `.env` in the `/backend` directory. Copy the contents of `backend/.env.example` (if one exists) or add the following, replacing placeholders with your actual values:
        ```dotenv
        # backend/.env
        MONGODB_URI=mongodb://localhost:27017/lecture_vault 
        JWT_SECRET=YOUR_VERY_STRONG_SECRET_KEY_HERE
        PORT=5000
        FRONTEND_URL=http://localhost:<FRONTEND_PORT> # e.g., http://localhost:5173 or 8080/8081
        ```
    *   **Frontend:** Create a file named `.env` in the **root** project directory. Add the following, ensuring the port matches your backend port:
        ```dotenv
        # .env (root directory)
        VITE_API_BASE_URL=http://localhost:5000 
        ```

5.  **Run the Backend Server:**
    *   Open a terminal window, navigate to the `/backend` directory:
        ```bash
        cd backend
        npm run dev 
        ```
    *   Look for confirmation messages like "Server listening on port 5000" and "MongoDB Connected...".

6.  **Run the Frontend Server:**
    *   Open a **separate** terminal window, navigate to the **root** project directory:
        ```bash
        npm run dev
        ```
    *   Vite will output the local URL (e.g., `http://localhost:5173`, `http://localhost:8080`, etc.). Open this URL in your browser.

## Deployment

Hosting this full-stack application requires deploying the frontend and backend separately, along with a hosted database:

1.  **Database:** Use a cloud service like MongoDB Atlas (a free tier is available). Update the `MONGODB_URI` in your hosted backend's environment variables.
2.  **Backend:** Deploy the Node.js/Express app to a PaaS like Render, Fly.io, or Heroku. Configure environment variables (`MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL` pointing to your live frontend URL).
3.  **Frontend:** Build the React app (`npm run build`) and deploy the static files (`dist` folder) to a static hosting service like Netlify, Vercel, or Cloudflare Pages. Configure the `VITE_API_BASE_URL` environment variable to point to your live backend URL.
