# Samadhan AI (समाधान AI) 🌉
> **Digital Public Infrastructure for Quad-Helix Civic Innovation** — Connecting Citizens, Municipal Government, Universities, and Corporate CSR Partners to resolve grassroots societal challenges.

---

## 📌 Mission & Architecture Overview

**Samadhan AI** bridges the Quad-Helix gap between:
1. **Citizens**: Submit geotagged local civic challenges (sanitation, roads, drinking water, public health, primary education) with telemetry and photographic proof.
2. **Municipal Administration**: Automated triage, priority assignment, and zonal audit verification.
3. **Universities & Academic Institutions**: Multi-factor AI vector matching automatically categorizes and routes mandates to student/faculty research teams to engineer working prototypes.
4. **Corporate & CSR Partners**: Browse proposals, fund projects via MCA Sec. 135-compliant CSR budgets, and release milestone-linked tranches.

---

## 🏗️ Architecture & Monorepo Layout

This project is built using a production-grade monorepo structure:

```
TriSetu/
├── apps/
│   ├── backend/             # Node.js + Express.js + TypeScript + Prisma (PostgreSQL) + Redis/BullMQ
│   ├── web/                 # React 18 + Vite + TypeScript + Tailwind CSS + React Router v6
│   ├── mobile/              # React Native (Expo) app for Citizen problem reporting
│   └── ai-service/          # Python FastAPI microservice (Categorization, Deduplication, Routing)
├── packages/
│   ├── shared/              # Shared TypeScript types, domain interfaces, and API DTOs
│   └── ui/                  # Reusable UI component library (Button, Card, Modal, Input, Badge)
├── .github/workflows/
│   └── ci.yml               # GitHub Actions CI workflow
├── docker-compose.yml       # Production-ready containerized dev stack
├── .env.example             # Centralized environment variable template
└── package.json             # Root monorepo workspace configuration
```

---

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js**: `v18.x` or `v20.x`
- **npm** / **pnpm**: `v9.x` or higher
- **Python**: `3.10+` (for `apps/ai-service`)
- **Docker & Docker Compose** (Optional, for running PostgreSQL + Redis containerized)

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/your-username/trisetu.git
cd trisetu

# Install workspace dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### 2. Running Services Locally

#### Backend Service (Express + Prisma)
```bash
cd apps/backend
npm run dev
```
- API Endpoint: `http://localhost:5000/api/v1`
- Swagger Documentation: `http://localhost:5000/api-docs`

#### Web Frontend (React + Vite)
```bash
cd apps/web
npm run dev
```
- Application URL: `http://localhost:3000`

#### AI Service (FastAPI)
```bash
cd apps/ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- Interactive Swagger UI: `http://localhost:8000/docs`

#### Mobile App (React Native Expo)
```bash
cd apps/mobile
npm run start
```

---

## 🐳 Docker Stack Deployment

To run all services (PostgreSQL, Redis, Express Backend, FastAPI AI Service, Vite Web) together:

```bash
docker-compose up --build -d
```

---

## 📜 Key Features Overview

- 📍 **Citizen Portal**: Geolocation problem reporting with media attachments & real-time status tracking.
- 🎓 **University Hub**: Problem assignment, faculty-guided student team creation, and proposal drafting.
- 💼 **Industry/CSR Dashboard**: Proposal discovery, direct CSR funding commitment, and milestone-based disbursement.
- 📊 **Government Analytics**: High-level visual dashboard monitoring district resolution rates, active grants, and regional impact.
- 🤖 **AI Microservice**: NLP semantic search for deduplication, automatic domain categorization, and institution expertise routing.

---

## 📄 License
Distributed under the **MIT License**.
