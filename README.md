# BuildUp - Home Design Community & Management Platform

## 🎯 About The Project
BuildUp is a comprehensive social platform and management system designed for the home design,
architecture, and renovation industry. It connects end-clients seeking inspiration with professional designers and contractors.
The platform supports various media types (text, images, audio/video) 
and offers a fully responsive interface for both desktop and mobile devices.

## 🚀 Features
*   **User Roles:** Support for Clients, Professionals, and Category Admins with distinct access levels.
*   **Professional Portfolios:** Professionals can create and manage their dynamic portfolios.
*   **Client Job Board:** Clients can post requirements/tenders for professionals to bid on.
*   **Media Integration:** Supports text, images, and audio/video explanations for projects.
*   **Community Interaction:** Users can leave reviews and comments on professional projects.
*   **Admin Supervision:** Category Admins have control over content within their area of expertise.

## 🛠 Technologies Used
*   **Frontend:** React, Vite, CSS (Responsive Design).
*   **Backend:** Node.js, Express.
*   **Database:** MySQL.
*   **Architecture:** Modular layered architecture (Models, Controllers, Routes).

## 📂 Project Structure
*   **client/:** React-based frontend application.
*   **server/:** Node.js & Express backend with MySQL database connection.
    *   `controllers/`: Business logic.
    *   `models/`: Data layer (SQL queries).
    *   `routes/`: API endpoint definitions.
    *   `middleware/`: Authentication and validation logic.

## ⚙️ Installation
1.  **Clone the repository:** 
    `git clone https://github.com/noaGitler/BuildUp.git`
2.  **Install dependencies:**
    *   For the server: `cd server` then `npm install`
    *   For the client: `cd client` then `npm install`
3.  **Configure environment:** Create a `.env` file in the server directory with your MySQL database credentials.
4.  **Run the application:**
    *   Start the server: `npm start` (or use `nodemon server.js`)
    *   Start the client: `npm run dev`
