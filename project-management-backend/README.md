# Internal Project Management System (Real-Time Collaboration)

This is an internal project management web application designed to help teams collaborate seamlessly in real time. When a user changes the status of any task, all other logged-in users see the updates instantly without needing to refresh their page.

---

## 🔗 Live Links
* **Frontend Web Application:** [Your Netlify or Vercel URL Here]
* **Backend Live Server API:** `https://project-backend-f00j.onrender.com`

---

## ⚙️ System Architecture (How it Works)

1. **Frontend (React):** The user interface where users log in, register, and interact with a visual Kanban task board.
2. **Backend (Node.js + Express):** The server that handles all incoming API requests, business logic, and security (JWT Validation).
3. **Database (MongoDB Atlas):** The cloud database where user data, projects, and tasks are safely stored.
4. **Real-Time Sync (Socket.IO & Redis):** Opens a continuous bi-directional channel so task movements are updated globally within milliseconds.

---

## 🛠️ Features Included

### 1. Authentication & Security
- **User Registration:** To create a new corporate account.
- **Secure Login:** Uses JWT token-based authentication to protect dashboard routes from unauthorized access.

### 2. Project & Task Tracking
- **Workspaces:** Option to create and group tasks under specific projects.
- **Kanban Board:** Track tasks across three mandatory stages:
  - `Todo` (Tasks waiting to be started)
  - `In Progress` (Tasks currently being worked on)
  - `Done` (Completed tasks)

### 3. Real-Time Socket Events
- `join:project` - Triggered when a user opens a project board. It places the user into a specific room tied to that project ID.
- `task:move` - Dispatched when a user drags or updates a task card.
- `task:updated` - The server catches the movement and broadcasts it instantly to all other active members in that specific room.

---

## 💻 Local Setup & Environment Variables (`.env`)

To run this project on your local machine, you must configure the environment variables properly for both backend and frontend layers.

### Step 1: Backend Setup
1. Open your terminal and go to the backend directory: `cd backend`
2. Install all required dependencies: `npm install`
3. Create a file named **`.env`** in the root of your backend folder and add these variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://neha_new:NehaBharti123@cluster0.zeor1ui.mongodb.net/?appName=Cluster0
   JWT_SECRET=my_super_secret_key