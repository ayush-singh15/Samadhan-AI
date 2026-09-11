# TriSetu (त्रिसेतु) 🌉
> **Societal Innovation Collaboration Portal** — Connecting Citizens, Universities, and Industry/CSR Partners to Solve Local Societal Problems.

---

## 📌 Problem & Solution Overview

**TriSetu** bridges the tri-fold gap between:
1. **Citizens**: Submit geotagged local societal challenges (sanitation, roads, water, public health, primary education) with photo/video proof.
2. **Universities & Academic Institutions**: AI automatically categorizes and routes problems to student/faculty teams to propose innovative solutions (R&D / Hackathons / Final Year Projects).
3. **Industry & CSR Partners**: Browse proposals, fund projects via CSR budgets, and mentor solution delivery.
4. **Government Authorities**: Monitor real-time impact analytics, milestone completions, and resource deployment across states/districts.

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
