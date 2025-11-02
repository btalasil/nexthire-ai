# CareerPilot — MERN Job Tracker + Resume Analyzer

A resume-ready MERN app that lets users track job applications and analyze resumes against job descriptions.

## Tech
- **Frontend:** React (Vite), React Router, Tailwind (optional)
- **Backend:** Node, Express, MongoDB (Mongoose), JWT, Multer (file upload)
- **Resume Parsing:** Simple PDF/Text parsing + keyword matching (no external AI required)
- **DB:** MongoDB Atlas

---

## Quick Start

### 1) Clone and install
```bash
# from repo root
cd server && npm install
cd ../client && npm install
```

### 2) Environment variables
Copy `.env.example` to `server/.env` and fill values.

### 3) Run locally (two terminals)
```bash
# Terminal A
cd server
npm run dev

# Terminal B
cd client
npm run dev
```
Frontend runs at `http://localhost:5173`, API at `http://localhost:5000`.

### 4) Build frontend
```bash
cd client
npm run build
```

---

## Deploy (Suggested)
- **Frontend:** Vercel (build command `npm run build`, output `dist`)
- **Backend:** Render/Railway (`npm start`, set env vars)
- **MongoDB:** Atlas (free tier)

---

## API Overview
- `POST /api/auth/register`, `POST /api/auth/login`
- `GET /api/jobs` (auth), `POST /api/jobs` (auth), `PATCH /api/jobs/:id` (auth), `DELETE /api/jobs/:id` (auth)
- `POST /api/resume/upload` (auth, PDF), `POST /api/resume/compare` (auth, jobDescription text)

See `docs/API.md` for full details.

---

## UI Upgrade: Material UI + CSV Export

Install once:
```bash
cd client
npm i @mui/material @emotion/react @emotion/styled @mui/icons-material papaparse
```

- Jobs page now uses Material UI components (forms, table).
- You can filter by status, search by company/role, and export visible rows to CSV.

---

## Security: Access + Refresh Tokens
- Access tokens expire quickly (default 15 minutes)
- A httpOnly cookie stores the refresh token
- Client auto-refreshes on 401

Set in `server/.env`:
```
JWT_SECRET=...
JWT_REFRESH_SECRET=...
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

---

## Email Reminders (Cron)
The server runs a daily job at 09:00 to email upcoming interviews (next 48 hours).  
Configure SMTP in `server/.env`:
```
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```
Services like Gmail require an app password.

---

## Resume Upload: Drag-and-Drop + Progress
- PDF only, up to 5 MB
- Progress indicator during upload

---

## Theme Toggle + Charts
- Dark/light theme toggle (MUI)
- Bar + Doughnut charts on dashboard
