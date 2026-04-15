# Bug Tracker

Bug Tracker is a MERN-style issue tracking app with a React frontend,
Redux Toolkit state management, an Express API, and MongoDB persistence.
Users can sign in, view bug counts by priority, create bugs, inspect details,
edit bugs, mark bugs complete, and delete bugs.

## Project Structure

```text
Bug-Tracker/
├── backend/
│   ├── Controller/Routes/
│   │   ├── auth.js
│   │   └── bugs.js
│   ├── Model/
│   │   └── userModel.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── Controllers/
│   │   ├── Models/
│   │   └── Views/
│   ├── .env.example
│   └── package.json
└── README.md
```

## Requirements

- Node.js 16 or newer
- npm
- MongoDB running locally, or a MongoDB connection string from MongoDB Atlas

## Environment Variables

Create a backend environment file:

```powershell
Copy-Item backend\.env.example backend\.env
```

Backend variables:

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `3500` | Express API port. |
| `DB_URL` | `mongodb://127.0.0.1:27017/bug-tracker` | MongoDB connection string. |
| `CLIENT_ORIGIN` | `http://localhost:3000` | Frontend origin allowed by CORS. |

Create a frontend environment file only if the API is not on the CRA proxy:

```powershell
Copy-Item frontend\.env.example frontend\.env
```

Frontend variables:

| Variable | Default | Description |
| --- | --- | --- |
| `REACT_APP_API_BASE_URL` | empty | Optional API base URL. Leave empty for local development with the `proxy` setting. |

## Install

Install dependencies in both apps:

```powershell
cd backend
npm install

cd ..\frontend
npm install
```

## Run Locally

Start MongoDB first. If MongoDB is installed locally as a Windows service, make
sure the service is running. If you use MongoDB Atlas, set `DB_URL` in
`backend/.env`.

Start the API:

```powershell
cd backend
npm run dev
```

Start the React app in another terminal:

```powershell
cd frontend
npm start
```

Local URLs:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3500`
- Backend health check: `http://localhost:3500/health`

## Create the First User

The login screen uses the backend `/auth/login` endpoint. Create an initial
admin user before signing in:

```powershell
$body = @{
  name = "Admin User"
  email = "admin@example.com"
  password = "change-me"
  role = "admin"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri http://localhost:3500/auth/users `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

Then sign in with `admin@example.com` and `change-me`.

## Scripts

Backend scripts:

| Command | Description |
| --- | --- |
| `npm start` | Run the Express server with Node. |
| `npm run dev` | Run the Express server with Nodemon. |
| `npm run serve` | Alias for the Nodemon dev server. |
| `npm test` | Run syntax checks for backend source files. |

Frontend scripts:

| Command | Description |
| --- | --- |
| `npm start` | Run the React development server. |
| `npm run build` | Create a production build. |
| `npm test` | Start the CRA test runner. |

## API Reference

### Health

`GET /health`

Returns API status and whether Mongoose is currently connected.

### Auth

`POST /auth/users`

Creates a user. Required fields:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "change-me",
  "role": "admin"
}
```

`POST /auth/login`

Signs in with email and password:

```json
{
  "email": "admin@example.com",
  "password": "change-me"
}
```

`GET /auth/users`

Returns all users without password hashes.

`PUT /auth/users/:id`

Updates a user. Supports `name`, `email`, `password`, and `role`.

### Bugs

`GET /api/bugs`

Returns all bugs sorted by incomplete first, priority, and newest first.

`GET /api/bugs/:id`

Returns one bug by MongoDB ObjectId.

`POST /api/bugs`

Creates a bug:

```json
{
  "name": "Save button does nothing",
  "description": "Clicking Save does not persist changes.",
  "steps": "Open edit form, change any field, click Save.",
  "priority": 1,
  "assigned": "Alex Urs-Badet",
  "creator": "Admin User",
  "version": "1.0.0"
}
```

`PATCH /api/bugs/:id`

Updates any bug fields. To mark a bug complete:

```json
{
  "completed": true
}
```

`DELETE /api/bugs/:id`

Deletes a bug by id.

## Main App Flow

1. Sign in with an existing user.
2. Use the dashboard to see high, medium, and low priority bug totals.
3. Open View Bugs to inspect individual bug records.
4. Create Bugs is visible to admin users.
5. In a bug detail view, use Edit, Delete, or Mark Complete.

## Troubleshooting

- `react-scripts is not recognized`: run `npm install` inside `frontend`.
- `MongoDB Connection Error`: verify MongoDB is running and `DB_URL` is correct.
- Login fails with `Incorrect email or password`: create a user through
  `/auth/users`, then use that email and password.
- Browser requests fail with CORS errors: set `CLIENT_ORIGIN` in `backend/.env`
  to the exact frontend URL.
- Production frontend cannot reach the API: set `REACT_APP_API_BASE_URL` before
  running `npm run build`.

## Verification

The current repo has been checked with:

```powershell
cd backend
npm test

cd ..\frontend
npm run build
```
