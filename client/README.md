![React](https://img.shields.io/badge/Frontend-React-blue)
![Node](https://img.shields.io/badge/Backend-Node-green)
![Prisma](https://img.shields.io/badge/ORM-Prisma-black)
![MySQL](https://img.shields.io/badge/Database-MySQL-orange)
![Deployed](https://img.shields.io/badge/Status-Live-success)


#  PulseRoom

PulseRoom is a real-time polling web application that allows users to create polls, share them instantly, and view live voting results.

Built as a full-stack production-ready application using React, Express, Prisma, and MySQL.

---

## Describtion 

PulseRoom is a production-ready real-time polling platform that allows users to create, share, and participate in live polls.
The system includes IP-based vote restriction enforced through Prisma unique constraints to prevent abuse, along with poll lifecycle management (Live/Closed state).

The application is deployed using a modern full-stack architecture:

React (Vite) frontend on Vercel

Express + Prisma backend on Render

MySQL database hosted on Railway

The project demonstrates backend integrity, production deployment workflows, and clean UI/UX design.

---

##  Live Deployment

- **Frontend (Vercel):** https://pulseroom.vercel.app  
- **Backend (Render):** https://pulseroom.onrender.com  

---

##  Features

- Create polls with multiple options
- Add and remove options dynamically
- Live vote counting with animated progress bars
- Vote percentage visualization
- Close poll functionality
- LIVE / CLOSED status indicator
- Share modal with:
  - Full poll link
  - Room ID copy option
- IP-based vote protection (anti-abuse mechanism)
- Toast notifications for feedback
- Production deployment setup

---

## Tech Stack

### Frontend
- React (Vite)
- React Router
- TailwindCSS
- Lucide Icons

### Backend
- Node.js
- Express.js
- Prisma ORM
- MySQL

### Deployment
- Vercel (Frontend)
- Render (Backend)
- Railway (MySQL Database)

---



## Author

- Built by Anik Bandopadhyay

---

📄 License

This project is open-source and available under the MIT License.