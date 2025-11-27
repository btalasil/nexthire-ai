# NextHire-AI

NextHire-AI is an AI-powered job application tracker and resume intelligence platform.  
It helps job seekers organize applications, compare resumes with job descriptions, and analyze hiring match scores — all in one modern dashboard.

---

## 🚀 Live Demo

🔗 **Frontend Live Link:**  
https://nexthire-ai.onrender.com

---

## ✨ Features

### 📝 Job Application Tracking
- Add, edit, and categorize job applications  
- Track statuses: Applied, Interview, Offer, Rejected  
- Weekly goals dashboard  

### 🤖 AI Resume Analyzer
- Upload resume (PDF)  
- Compare with any job description  
- Get match score and improvement suggestions  
- Skills gap detection  

### 🔐 Authentication & Security
- JWT authentication (Access + Refresh tokens)  
- Password hashing with bcrypt  
- Secure reset-password flow using **Resend + Custom Domain**

### 📊 Clean & Modern UI
- Fully responsive (mobile + desktop)  
- MUI + Tailwind hybrid design  
- Dark/Light mode support  

---

## 🏗️ Tech Stack

### **Frontend**
- React (Vite)
- Tailwind CSS  
- Material-UI  
- Axios  
- React Router  

### **Backend**
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT (Auth + Refresh Tokens)  
- Resend (Transactional Email with custom domain)  

### **DevOps / Deployment**
- Render (Server + Client)  
- NameSilo (Domain)  
- DNS (TXT, SPF, DKIM, MX) for Resend  
- Environment variables for secure config  

---

## 📂 Folder Structure
md
nexthire-ai/
│
├── client/ # React frontend
├── server/ # Node/Express backend
├── docs/ # Extra assets / documentation
├── README.md
└── render.yaml # Render deployment config
---

## 🔧 Environment Variables
### **Backend (.env)**
md
MONGO_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
RESET_TOKEN_SECRET=
RESEND_API_KEY=
CLIENT_URL=

### **Frontend (.env)**
md
VITE_API_URL=

---

## 📧 Password Reset (Resend)

The platform uses **Resend + custom domain verification** for sending password reset emails.

Includes:
- DKIM  
- SPF  
- DMARC  
- MX records  

This ensures **high deliverability** with zero Gmail rate-limit issues.

---

## 🛠️ Setup Instructions (Local)

### 1️⃣ Install backend
md
cd server
npm install
npm start


### 2️⃣ Install frontend
md
cd client
npm install
npm run dev


---

## 🤝 Contributing
Pull requests are welcome.  
If you’d like to improve UI/UX, add AI features, or optimize backend logic, feel free to contribute.

---

## 📜 License
MIT License © 2025 Bharath Kumar Talasila



