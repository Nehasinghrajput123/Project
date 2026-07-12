# Internal Project Management System (Real-Time Collaboration)

An enterprise-grade internal project management web application designed to help corporate teams collaborate seamlessly in real time. Powered by the **MERN Stack** and **Socket.IO**, this application features a dynamic Kanban task board where status transitions sync globally across all active sessions within milliseconds—completely eliminating the need for manual page refreshes.

---

## 🔗 Live Links
* **Frontend Web Application:** https://project-3-r0z5.onrender.com
* **Backend Live Server API:** `https://project-backend-f00j.onrender.com`

---

## ⚙️ System Architecture (How it Works)

1. **Frontend (React.js + Redux Toolkit):** Responsive client interface featuring full SPA routing, centralized global state management, automated login persistency, and a structured layout layer.
2. **Backend (Node.js + Express):** Robust middleware-driven application server handling RESTful routing configurations, core corporate workflows, and secure JWT-token parsing.
3. **Database (MongoDB Atlas):** Document-oriented cloud database architecture utilizing strict data schemas via Mongoose for platform users, workspace tracking, and tasks.
4. **Real-Time Data Layer (Socket.IO & Redis):** Establishes an open, permanent, bi-directional communication pipeline capable of broadcasting client-side updates instantly to target segments.

---

## 🛠️ Features Included

### 1. Robust Authentication & Route Guarding
- **User Registration:** Secure employee sign-up gateway verifying corporate criteria.
- **JWT Protected Routes:** Restricts system resources via an encryption checking system (`ProtectedRoute`). Any attempt by unauthorized traffic to bypass workspace sections or metrics layouts forces an instant redirection loop back to the `/login` screen.
- **Dynamic Role-Based Dashboards:**
  - **Admin View:** Displays a macro-level footprint of system operations including total projects created, active global tasks, completed system items, and absolute user counts.
  - **Member View:** Seamlessly adjusts to isolate individual workflows. Uses a localized controller query (`getUserAssignedStats`) to show only assigned projects and private task metrics matching the current user profile.

### 2. Workspace Management & Visual Kanban Matrix
- **Project Workspaces:** Structural grouping allowing managers to partition assignments under distinct client deliverables.
- **3-Stage Mandatory Kanban Columns:** Tracks task progressions dynamically through distinct development lifecycles:
  - `Todo` (Tasks waiting to be started)
  - `In Progress` (Tasks currently being actively worked on)
  - `Done` (Completed and signed-off tasks)

### 3. Asynchronous Real-Time Event Engine
- `join:project` – Dispatched by the frontend context hook when opening a workspace. It automatically binds the authenticated socket connection to a specific internal server room bounded by that project's database ID.
- `task:move` – Triggered when an operator modifies an active item's priority or position on the Kanban layout.
- `task:updated` – Intercepted by the backend socket architecture to instantly multi-broadcast updated card schemas to all other synchronized active team members sharing that project room.
Step 1: Backend Server Setup:
npm install
npm start   (start server)

frontend setup :
npm i 
npm run dev 



