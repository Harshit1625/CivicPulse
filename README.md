
# CivicPulse

CivicPulse is a **civic issue tracking and analytics platform** designed to help organizations and administrators monitor, manage, and act on public issues in real time. The system focuses on **secure role-based access**, **event-driven updates**, and **scalable backend architecture**, reflecting how modern governance and civic-tech platforms are built.

The project was built to demonstrate real-world backend concepts: authentication workflows, authorization policies, real-time updates, background processing, and production-grade CI/CD.

---

## ✨ Key Features

* **Secure authentication & authorization** using Supabase Auth
* **Role-based access control (RBAC)** with database-level policies
* **Real-time issue updates** via WebSockets
* **GraphQL API** for flexible and efficient data fetching
* **Optimistic UI updates** for smooth user experience
* **CI/CD-driven deployment** with automated validation
* **Cloud deployment** using modern managed platforms

---

## 🧱 High-Level Architecture

```
Client (Frontend)
   │
   │  GraphQL Queries & Mutations
   ▼
Backend API (GraphQL + Supabase)
   │
   │  Auth context + RBAC
   │
   │  Real-time events
   ▼
WebSocket Layer
   │
   ▼
Frontend UI (Live Updates)
```

---

## 🔁 Complete Workflow

1. A user authenticates using Supabase Auth (JWT-based).
2. The frontend stores the session and user profile in global state.
3. All GraphQL requests include the authenticated user via context.
4. Role-based database policies ensure users only access permitted data.
5. Users create or update civic issues using GraphQL mutations.
6. The backend validates permissions and writes changes to the database.
7. Real-time events are emitted to notify connected clients.
8. The frontend updates instantly using WebSocket subscriptions.
9. Admin users get extended visibility and control via elevated policies.

---

## 🗂️ Project Structure

```
CivicPulse/
├── backend/        # GraphQL API + Auth context
├── frontend/       # React dashboard
├── database/       # Supabase schema & policies
├── .github/
│   └── workflows/  # CI/CD pipelines
└── README.md
```

---

## 🛠️ Tech Stack

### Backend

* Node.js
* GraphQL (Apollo Server)
* Supabase (PostgreSQL + Auth)
* Row Level Security (RLS)
* WebSockets

### Frontend

* React
* TailwindCSS
* Apollo Client
* Vite

### Auth & Data

* Supabase Auth (JWT-based)
* PostgreSQL
* Role-based access policies

### DevOps & Deployment

* GitHub Actions (CI/CD)

---

## 🚀 Deployment Strategy

### Frontend

* Deployed on **Vercel**
* Automatic deployments on push to `main`

### Backend

* Deployed as a managed Node service
* Uses environment-based configuration
* CI pipeline validates builds before deployment

---

## 🔄 CI/CD Pipeline

The CI/CD pipeline performs the following steps:

1. Runs on every push and pull request to `main`
2. Installs dependencies for frontend and backend
3. Builds the application to validate correctness
4. Deploys only if all checks pass

This ensures production stability and prevents broken deployments.

---

## 🔐 Environment Variables

### Backend

* `SUPABASE_URL`
* `SUPABASE_ANON_KEY`
* `SUPABASE_SERVICE_ROLE_KEY`
* `JWT_SECRET`

### Frontend

* `VITE_SUPABASE_URL`
* `VITE_SUPABASE_ANON_KEY`
* `VITE_GRAPHQL_ENDPOINT`

---

## 🧠 Design Decisions

* **GraphQL over REST** for flexible client-driven data fetching
* **RLS at the database level** for strong security guarantees
* **Auth context propagation** for consistent permission handling
* **Real-time updates** to avoid manual refresh or polling
* **Optimistic UI** to keep interactions fast and responsive
* **Separation of frontend, backend, and auth layers** for scalability

---

## 🎯 Why This Project Matters

CivicPulse is not a basic CRUD app. It demonstrates how production-grade civic and enterprise platforms handle:

* Secure multi-role authentication
* Authorization at the database level
* Real-time system updates
* Clean GraphQL data flows
* Scalable and maintainable architecture

This project reflects how modern civic-tech, governance, and issue-management platforms are built in the real world.

---

## 👤 Author

**Harshit Srivastava**

Web Developer with a strong focus on backend systems, real-time architectures, and scalable application design.
