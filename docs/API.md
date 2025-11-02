# API Endpoints

## Auth
- `POST /api/auth/register` — body: { name, email, password }
- `POST /api/auth/login` — body: { email, password }

## Jobs (Auth required)
- `GET /api/jobs`
- `POST /api/jobs` — body: { company, role, jobLink, status, dateApplied, interviewDate, notes, tags }
- `PATCH /api/jobs/:id`
- `DELETE /api/jobs/:id`

## Resume (Auth required)
- `POST /api/resume/upload` — multipart/form-data (field: file, expects PDF)
- `POST /api/resume/compare` — body: { jobDescription } → compares extracted resume skills to job description keywords
