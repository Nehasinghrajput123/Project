# Internal Project Management System (Real-Time Collaboration)

An enterprise-grade internal project management web application designed to help corporate teams collaborate seamlessly in real time. Powered by the **MERN Stack** and **Socket.IO**, this application features a dynamic Kanban task board where status transitions sync globally across all active sessions within milliseconds—completely eliminating the need for manual page refreshes.

---

## 🔗 Live Deliverables & Project URLs

* **🌐 Deployed Frontend Web Application:** https://project-3-r0z5.onrender.com
* **⚙️ Deployed Backend Live Server API:** https://project-backend-f00j.onrender.com
* **💻 GitHub Code Repository Link:** https://github.com/Nehasinghrajput123/Project
* **🚀 CI/CD Pipeline Tracking (GitHub Actions):** https://github.com/Nehasinghrajput123/Project/actions
* **🎥 Loom Project Walkthrough Video:** [INSERT_YOUR_LOOM_VIDEO_LINK_HERE]
* **📄 Planning & Design Documents (FRD/System Design):** [INSERT_YOUR_GOOGLE_DOC_OR_REPOSITORY_DOCS_LINK_HERE]

---

## 🏗️ System Architecture & Flow

The system architecture follows a modern decoupled client-server pattern optimized for persistent connection handling and real-time event distribution.

1. **Frontend Layer (React.js):** A single-page application built using a resilient layout, structured routing via React Router DOM, and robust token injection within request cycles.
2. **Reverse Proxy & Gateway:** Deployed services route incoming client HTTP and WebSocket handshakes traffic seamlessly while protecting internal server runtime environments.
3. **Application Layer (Node.js + Express):** A strict controller-service-route decoupled backend handling complex corporate workflows, state evaluations, and data formatting.
4. **Real-Time Sync (Socket.IO Rooms):** Establishes an open, permanent, bi-directional communication pipeline that leverages stateful server memory rooms to isolate and sync workspace changes instantly across client connections.
5. **Persistence Layer (MongoDB Atlas):** Fully secure, document-oriented cloud storage managing collections for users, workspaces, and granular board tasks.

---

## ⚖️ Design Decisions & Trade-offs

### 1. State Management (Why Redux Toolkit / Local State)
We chose a unified state strategy to balance state predictable behavior against swift UI re-renders. When handling high-frequency events (like continuous Kanban drag-and-drops from multiple active operators), simple React Context triggers excessive global re-renders. Redux Toolkit ensures:
* Immutable state update workflows.
* Micro-second UI response times upon receiving incoming asynchronous WebSocket packets.
* Clean separation of API response tracking from UI-only presentation states.

### 2. Real-Time Architecture & Memory Strategy
* **The Choice:** Native **Socket.IO Rooms** mapped directly in-memory on the Node.js application process.
* **Trade-off:** We prioritized a streamlined, low-latency infrastructure setup by using Socket.IO's native stateful room management rather than introducing an external pub/sub caching layer (like Redis). This drastically reduces operational complexity, keeps network hops to a minimum, and delivers immediate sub-millisecond event broadcasts. The trade-off is that scaling horizontally in the future would require sticky sessions or a sticky load balancer to route users to the same active memory cluster instance.

---

## 🔌 Core API Endpoints List

### 🔐 Corporate Authentication Module
* `POST /api/auth/register` - Create new employee corporate credentials.
* `POST /api/auth/login` - Authenticate account and return an encrypted JWT bearer session string.

### 📁 Project Tracking Workspaces
* `GET /projects/getAllProject` - Fetches all company operations (Admin dashboard macro-metrics with strict `page` & `limit` query validations).
* `GET /projects/user-projects/:userId` - Localized workspace filter returning entries mapped only to the signed-in operator.
* `POST /projects/create` - Instantiates a new deliverable tracker board (Role Guard: Admin Only).
* `DELETE /projects/:id` - Permanently wipe out an absolute project environment from the persistence architecture (Role Guard: Admin Only).

### 📋 Kanban Task Matrix
* `POST /api/tasks/create` - Appends a new item card within an explicit workspace.
* `PATCH /api/tasks/:taskId/status` - Shifts an item through operational development stages (`Todo` $\rightarrow$ `In Progress` $\rightarrow$ `Done`).

---

## ⚡ Real-Time WebSocket/Socket.io Events Matrix

The active sync lifecycle relies on absolute room partitioning to ensure high security and zero data leakage across unrelated company project workspaces.

* `connection` - Client initiates a persistent WebSocket bridge, securely passing their JWT credentials inside handshake objects for validation.
* `join:project` - Emitted automatically by the frontend interface when opening a specific tracking board. The server isolates this channel inside a localized room context bounded strictly by the project's database `_id`.
* `task:move` - Emitted instantly by an active user shifting a task node on the visual dashboard column grid.
* `task:updated` - The server interceptor processes the mutations inside the database, then multi-broadcasts the updated card payload instantly to all other active, synchronized team members listening inside that explicit project room network.

---

## 🛠️ Local Machine Setup Configuration

### Step 1: Backend Setup
Clone the codebase, navigate to the server root directory, and establish a `.env` configuration file matching the setup parameters:
```env
PORT=5000
MONGO_URI=mongodb+srv://neha_new:6LoXgiHjV3UuSbNb@cluster0.zeor1ui.mongodb.net/?appName=Cluster0
JWT_SECRET="wyvdhwvdbtetsese"
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000

Step 2: Frontend Setup:
npm install
npm run dev

Production Deployment & Infrastructure Setup (Render Cloud Platform)
The production infrastructure is natively engineered on the Render Cloud Platform, enforcing a microservices decoupling pattern for high availability.

1. Backend Server Deployment (Render Web Service)
Instance Type: Web Service running in a highly isolated container runtime environment.

Build Command: npm install

Start Command: npm start

Environment Configuration: Render's secure centralized control dashboard is utilized to securely inject internal parameters:

PORT: Automatically bound by the Render container host wrapper.

MONGODB_URI: Encrypted cloud database handshake string (mongodb+srv://...).

JWT_SECRET: System cryptographic key string.

2. Frontend Application Deployment (Render Static Site)
Instance Type: Static Site architecture optimized for fast global Content Delivery Network (CDN) edge routing.

Build Command: npm install && npm run build

Publish Directory: dist (or build based on your bundler matrix configuration).

Routing Strategy: Native Render redirect rewrite rules are injected (/* to /index.html with a 200 status payload code) to support clean React Router DOM Single Page Application (SPA) client-side routing and prevent 404 refresh crashes.