# Blog Application (MERN)

A simple blog platform with user authentication and CRUD operations for posts. This monorepo contains an Express + MongoDB API (`api/`) and a React client (`client/`).

## Tech Stack

- Server: Node.js, Express, Mongoose, JWT, bcrypt, cookie-parser, body-parser, cors
- Client: React (Create React App)
- Database: MongoDB (Atlas or local)

## Project Structure

```
blogapp/
├─ api/
│  ├─ index.js
│  ├─ routes/
│  │  ├─ auth.js
│  │  └─ posts.js
│  ├─ models/
│  │  ├─ User.js
│  │  └─ Post.js
│  └─ middleware/
│     └─ auth.js
└─ client/
   ├─ public/
   └─ src/
```

## Prerequisites

- Node.js 18+
- A MongoDB connection string (local or Atlas)

## Setup & Run

1) Install dependencies

- API
  ```bash
  cd api
  npm install
  ```
- Client
  ```bash
  cd client
  npm install
  ```

2) Environment variables

- Use the example templates
  - Templates are provided at `api/.env.example` and `client/.env.example`.
  - Copy them to `.env` and then fill in real values:
    - Windows PowerShell
      ```powershell
      Copy-Item api\.env.example api\.env
      Copy-Item client\.env.example client\.env
      ```
    - macOS/Linux
      ```bash
      cp api/.env.example api/.env
      cp client/.env.example client/.env
      ```

- Or create them manually
  - Create `api/.env`
    ```env
    MONGO_URL=mongodb://127.0.0.1:27017/blog
    secret=your_jwt_secret_here
    HOST_ADDRESS=http://localhost:3000
    ```
    - `MONGO_URL`: MongoDB connection string
    - `secret`: JWT signing secret (token expires in 1h)
    - `HOST_ADDRESS`: Allowed CORS origin for the client

  - Create `client/.env`
    ```env
    REACT_APP_SERVER_ADDRESS=http://localhost:4000
    ```
    - Client builds API URLs like `${REACT_APP_SERVER_ADDRESS}/api/...`

3) Start the apps

- API (runs on port 4000)
  ```bash
  cd api
  npm start
  ```
- Client (runs on port 3000)
  ```bash
  cd client
  npm start
  ```

4) Build the client for production
```bash
cd client
npm run build
```

## API Overview

Base URL: `http://localhost:4000/api`

## Notes

- The client stores the JWT returned by login and sends it via the `Authorization: Bearer <token>` header for protected routes.
- Ensure `HOST_ADDRESS` matches the client origin to avoid CORS issues.
