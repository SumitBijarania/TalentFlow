# 💼 TalentFlow – A Mini Hiring Platform

TalentFlow is a modern, minimal hiring management platform built with **React + Vite**.  
It simulates a real-world job portal where HRs can manage **Jobs**, **Candidates**, and **Assessments** — all powered by **MirageJS (mock backend)** and **Dexie (IndexedDB persistence)**.

>  Think of it as a lightweight internal HR tool — with real-app logic, beautiful UI, and real-time interactivity.

---

##  Features

### Core Modules
- **Jobs Board**
  - Create, edit, and archive job postings.
  - Grid layout with dynamic status badges.
  - Animated hover effects and gradient highlights.

- **Candidates Management**
  - Manage applicants with stages (Applied → Hired).
  - Search and filter by stage or job.
  - Add, edit, and delete candidate entries.

- **Assessments Builder**
  - Create job assessments with multiple question types.
  - Live preview panel and section-based editing.
  - Supports conditional logic and local persistence.

---

###  System Features
-  **MirageJS** for mock API routes (`/api/jobs`, `/api/candidates`, `/api/assessments`)
-  **Dexie (IndexedDB)** for offline/local data persistence
-  **React Query (TanStack Query)** for data fetching and caching
-  **Vite** for ultra-fast development
-  **Modern CSS Design System**
- CSS variables, glassmorphism effects, shadows, transitions
-  **Future-ready:** Dark mode support (planned)
-  **Routing:** React Router for modular navigation

---

##  Tech Stack

| Category | Technology |
|-----------|-------------|
| Frontend Framework | React (JavaScript) |
| Build Tool | Vite |
| Data Fetching | React Query v5 |
| Mock API | MirageJS |
| Local Storage | Dexie (IndexedDB) |
| Styling | Vanilla CSS (custom theme) |
| UI Animations | CSS transitions & shadows |

---

##  Installation & Setup

### 1️ Clone the repository
```bash
git clone https://github.com/<your-username>/TalentFlow.git
cd TalentFlow
