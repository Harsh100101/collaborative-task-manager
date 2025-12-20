# AbleSpace – Collaborative Task Manager

AbleSpace is a **full‑stack collaborative task management system** designed to help individuals and teams plan, track, and manage work efficiently. It features **secure authentication, real‑time updates, and a drag‑and‑drop Kanban board**, making task collaboration smooth and intuitive.

---

## Live Demo

* **Frontend (Vercel):** [https://collaborative-task-manager.vercel.app](https://collaborative-task-manager.vercel.app)
* **Backend (Render):** [https://collaborative-task-manager-alpha.vercel.app](https://collaborative-task-manager-alpha.vercel.app)

---

## Key Features

### Authentication

* User Registration & Login
* JWT‑based authentication
* Persistent login using Local Storage
* Protected routes

### Task Management

* Create, update, delete tasks
* Priority levels (LOW, MEDIUM, HIGH, URGENT)
* Due date tracking (Overdue / Today / Upcoming)
* Task filtering & search

### Kanban Board

* Drag & Drop tasks across columns
* Status columns: TODO, IN_PROGRESS, REVIEW, COMPLETED
* Optimistic UI updates

### Real‑Time Collaboration

* Live task updates using Socket.IO
* Instant sync across multiple clients

---

## Tech Stack

### Frontend

* React + TypeScript
* Vite
* Tailwind CSS
* Axios
* Socket.IO Client
* @dnd-kit (Drag & Drop)

### Backend

* Node.js + Express
* TypeScript
* MongoDB + Mongoose
* JWT Authentication
* Socket.IO
* CORS (production‑safe configuration)

### Deployment

* **Frontend:** Vercel
* **Backend:** Render

---

## Project Structure (Frontend)

```
src/
 ├── api/
 │   ├── axios.ts          # Axios instance & interceptors
 │   ├── socket.ts         # Socket.IO singleton
 │   └── task.service.ts   # Task API services
 │
 ├── auth/
 │   ├── login.tsx
 │   └── register.tsx
 │
 ├── context/
 │   ├── AuthProvider.tsx  # Authentication context
 │   └── useAuth.ts        # Auth hook
 │
 ├── pages/
 │   └── Dashboard.tsx
 │
 ├── App.tsx
 └── main.tsx
```

---

## Authentication Flow

1. User logs in via `/login`
2. Backend returns user object
3. User state is stored in **AuthContext**
4. Protected routes allow access
5. Auth state persists via Local Storage

---

## Environment Variables

### Frontend (Vercel)

```
VITE_API_URL=https://collaborative-task-manager-09fn.onrender.com
```

---

## Local Development

### Clone the repository

```bash
git clone https://github.com/Harsh100101/collaborative-task-manager.git
cd collaborative-task-manager
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

---

## Highlights

* Strict TypeScript configuration
* Clean separation of concerns
* Production‑safe CORS handling
* Scalable socket architecture
* Optimistic UI for smooth UX

---

## Future Improvements

* Team & role‑based access
* Refresh token authentication
* Activity logs
* Email notifications
* Task comments

---

## Author

**Harsh Sorathiya**

* GitHub: [https://github.com/Harsh100101](https://github.com/Harsh100101)
* LinkedIn: [https://www.linkedin.com/in/harsh-sorathiya/](https://www.linkedin.com/in/harsh-sorathiya/)

---

⭐ If you like this project, consider giving it a star!
