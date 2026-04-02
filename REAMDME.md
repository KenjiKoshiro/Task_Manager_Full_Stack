# TaskFlow — Full-Stack Task Manager

A full-stack task management web application with user authentication, kanban-style task board, and real-time drag-and-drop functionality.

> ⚠️ **Note:** The backend is hosted on Render's free tier. The first request after inactivity may take **30–50 seconds** to wake up. Subsequent requests will be fast.

🔗 **Live Demo:** [task-manager-full-stack-sepia.vercel.app](https://task-manager-full-stack-sepia.vercel.app)

---

## Features

- 🔐 **User Authentication** — Register and login with JWT-based sessions
- ✅ **Task Management** — Create, edit, delete, and organize tasks
- 🗂️ **Kanban Board** — Drag and drop tasks across To Do / In Progress / Done columns
- 🏷️ **Priority Levels** — Set Low, Medium, or High priority per task
- 📅 **Due Dates & Tags** — Attach due dates and tags to tasks
- 📆 **Calendar View** — Visualize tasks on a calendar
- 👥 **Team Page** — View team members
- ⚙️ **Settings** — Manage account preferences
- 📱 **Responsive Design** — Works on desktop and mobile

---

## Tech Stack

### Frontend
- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — build tool
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [Zustand](https://zustand-demo.pmnd.rs/) — state management
- [React Router v6](https://reactrouter.com/) — routing
- [Lucide React](https://lucide.dev/) — icons

### Backend
- [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/) — authentication
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) — password hashing

### Deployment
- **Frontend:** [Vercel](https://vercel.com/)
- **Backend:** [Render](https://render.com/)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas)

---

## Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- A MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository
```bash
git clone https://github.com/KenjiKoshiro/Task_Manager_Full_Stack.git
cd Task_Manager_Full_Stack
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=3001
```

### 4. Run the development servers

Start the backend:
```bash
npm run dev:server
```

Start the frontend (in a new terminal):
```bash
npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3001](http://localhost:3001)

The Vite dev server automatically proxies `/api` requests to the backend.

---

## Deployment Guide

### Backend → Render
1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository
3. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `node backend/src/index.js`
4. Add environment variables:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   PORT=10000
   FRONTEND_URL=https://your-app.vercel.app
   ```

### Frontend → Vercel
1. Import your GitHub repository on [Vercel](https://vercel.com)
2. Add environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   ```
3. Deploy and redeploy after setting the variable

---

## Project Structure

```
├── backend/
│   └── src/
│       ├── config/        # Environment config
│       ├── middleware/    # Auth middleware
│       ├── models/        # Mongoose models (User, Task)
│       ├── routes/        # API routes (auth, tasks)
│       └── index.js       # Express server entry point
├── src/
│   ├── api/               # Frontend API client
│   ├── layouts/           # App layout components
│   ├── pages/             # Page components
│   ├── store/             # Zustand state management
│   └── types/             # TypeScript types
├── dist/                  # Built frontend (generated)
└── vite.config.ts
```

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Create a new account | No |
| POST | `/api/auth/login` | Login and get token | No |
| GET | `/api/auth/me` | Get current user | Yes |
| GET | `/api/tasks` | Get all tasks | Yes |
| POST | `/api/tasks` | Create a task | Yes |
| PUT | `/api/tasks/:id` | Update a task | Yes |
| DELETE | `/api/tasks/:id` | Delete a task | Yes |

---

## License

MIT