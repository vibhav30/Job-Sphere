# 💼 Fullstack Job Portal App

A modern, end-to-end **Job Portal Web Application** built using the powerful **MERN Stack (MongoDB, Express, React, Node.js)**. It supports job seekers and recruiters with real-time applications, secure authentication, file uploads, company dashboards, admin features, and more — designed with a responsive and sleek UI using **ShadCN UI**.

![Tech Stack](https://img.shields.io/badge/MERN-FullStack-blueviolet) ![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen) ![License](https://img.shields.io/badge/License-MIT-lightgrey)

---

## 📸 App Snapshots

<p align="center">
  <img src="screenshots/homepage.png" alt="Homepage" width="700"/>
  <br/><em>🏠 Homepage with dynamic job listings</em><br/><br/>
  <img src="screenshots/login.png" alt="Login Page" width="700"/>
  <br/><em>🔐 Secure login for users and company admins</em><br/><br/>
  <img src="screenshots/jobdetails.png" alt="Job Description" width="700"/>
  <br/><em>📄 Detailed Job Description with Apply button</em><br/><br/>
  <img src="screenshots/admin-dashboard.png" alt="Admin Dashboard" width="700"/>
  <br/><em>🛠️ Admin Dashboard to manage jobs, users, and applicants</em><br/><br/>
</p>

---

## 🔥 Features

### 👨‍💻 For Job Seekers
- Register & login with secure JWT-based authentication
- Browse & filter jobs
- Apply to jobs with resume upload (Multer support)
- Track application status
- Update profile and resume

### 🏢 For Employers
- Company registration and admin access
- Create, edit, delete job posts
- View applicants & update application status

### 🛡️ For Admin
- Global job and user management
- View applications across companies
- Role-based route protection

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ ReactJS (Vite)
- 💅 ShadCN UI (Tailwind + Radix UI)
- 🧠 Redux Toolkit
- 🎞️ Framer Motion (Animations)

### Backend
- 🟢 Node.js + Express.js
- 🗄️ MongoDB + Mongoose
- 🔐 JWT + Middleware Auth
- 📂 Multer for Resume/File Uploads

---

## 📁 Folder Structure
/frontend → React + Vite + ShadCN UI
/backend → Express, MongoDB, Multer
/models → Mongoose Schemas
/controllers → User, Company, Job, Application
/middleware → JWT Auth, Role-based Access
/routes → REST APIs for each module


---

## ⚙️ Getting Started

### 🧩 Prerequisites
- Node.js (v18+)
- MongoDB (Atlas/local)
- npm or yarn

### 📦 Installation

```
# Clone the repository
git clone https://github.com/yourusername/job-portal-app.git
cd job-portal-app

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

⚙️ Environment Setup
# Server
PORT=8000

# MongoDB Database
MONGO_URI=mongodb+srv://guptavibhav123:LRVjBnwxyAM4FmLV@cluster0.su8ge.mongodb.net/

# JWT Secret
SECRET_KEY=jhfjkhwsgfhkjlshfscfnkjszljfnkl

# Cloudinary Config
CLOUD_NAME=dgl2rt2bc
API_KEY=995943575559716
API_SECRET=wdKhtM51jWex4N3kbEL0NZyQ52A


🚀 Run Locally
# Start backend
cd backend
npm run dev

# Start frontend
cd ../frontend
npm run dev

🧠 Future Enhancements
⏳ Email verification & notifications

⏳ Real-time chat with recruiters

⏳ Docker & CI/CD setup

🙌 Author
Made with ❤️ by Vibhav Gupta
If you found this helpful, please ⭐ the repo and share it with others!

📜 License
Licensed under the MIT License — free to use, modify, and distribute.

