# Task Manager

This project is a full-stack task manager built with:

- React + TypeScript + Vite
- Tailwind CSS
- Express.js
- MongoDB + Mongoose
- JWT authentication

## Fixed issues

- corrected `package.json` scripts for frontend and backend
- added missing Vite, TypeScript, PostCSS, and Tailwind configuration files
- changed `tailwind.config.js` from ESM syntax to CommonJS so it works with the current setup
- replaced hardcoded frontend API URL with `VITE_API_BASE_URL` fallback support
- updated backend to serve the built frontend from `dist/` in production
- improved API error handling

## Install

```bash
npm install
```

## Run locally

Frontend:

```bash
npm run dev
```

Backend:

```bash
npm run dev:server
```

Frontend runs on `http://localhost:5173` and proxies `/api` to the backend at `http://localhost:3001`.

## Environment variables

Backend `.env`:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=3001
```

Optional frontend `.env`:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

Usually you do not need `VITE_API_BASE_URL` in local development because Vite proxy already handles `/api`.

## Production

Build frontend:

```bash
npm run build
```

Start backend:

```bash
npm start
```

The backend will serve the built frontend automatically if `dist/` exists.
