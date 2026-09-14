# Samadhan AI (समाधान AI) 🇮🇳

> **Digital Public Infrastructure for Quad-Helix Civic Action**
> Powered by Autonomous AI Matching, Real-Time Cryptographic Ledger, and MCA-Compliant CSR Escrow Disbursement.

[![CI Pipeline](https://github.com/ayush-singh15/Samadhan-AI/actions/workflows/ci.yml/badge.svg)](https://github.com/ayush-singh15/Samadhan-AI/actions)
[![Live Frontend](https://img.shields.io/badge/Vercel-Production%20Live-brightgreen)](https://trisetu.vercel.app)
[![Live Backend](https://img.shields.io/badge/Railway-API%20Live-blue)](https://trisetubackend-production.up.railway.app/api-docs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Author](https://img.shields.io/badge/Sole%20Author-Ayush%20Singh%20(ayush--singh15)-darkblue)](https://github.com/ayush-singh15)

---

## 📌 Mission & Architecture Overview

**Samadhan AI** is a state-of-the-art Digital Public Infrastructure (DPI) platform designed for India's civic governance and public works ecosystem. It connects the four critical pillars of society (the **Quad-Helix Alliance**):

1. **Citizens**: Submit geotagged civic grievances (water contamination, road infrastructure, sanitation, power outages, and public schools) with cryptographic proof and photo telemetry.
2. **Municipal Administration & Zonal Officers**: Automated triage, threat level scoring, jurisdiction verification, and fast-track RFP tenders.
3. **Universities, IITs & Labs**: High-performance AI multi-vector matching automatically pairs civic engineering challenges with academic researchers, capstone cohorts, and Smart India Hackathon (SIH) prototype teams.
4. **Corporate & CSR Partners**: Co-finance real-world civic solutions compliant with Section 135 of the Companies Act (MCA guidelines) via milestone-linked escrow tranches.

---

## 🌐 Live Production Deployments

| Component | Cloud Platform | Live URL | Status |
| :--- | :--- | :--- | :--- |
| **Web Application** | Vercel | [https://trisetu.vercel.app](https://trisetu.vercel.app) | 🟢 Live & Operational |
| **Backend API Engine** | Railway | [https://trisetubackend-production.up.railway.app/api/v1](https://trisetubackend-production.up.railway.app/api/v1) | 🟢 Live & Operational |
| **Interactive API Docs** | Swagger UI | [https://trisetubackend-production.up.railway.app/api-docs](https://trisetubackend-production.up.railway.app/api-docs) | 🟢 Live & Operational |
| **Cloud Database** | Neon Serverless PostgreSQL | High-availability cluster (AWS ap-southeast-1) | 🟢 Healthy |
| **Real-Time Mesh Stream** | SSE Telemetry Stream | /api/v1/events/stream | 🟢 Active |

---

## 🏗️ Monorepo Architecture

`
Samadhan-AI/
├── apps/
│   ├── backend/             # Node.js + Express + TypeScript + Prisma ORM + Neon PostgreSQL + SSE Telemetry
│   ├── web/                 # React 18 + Vite + TypeScript + Tailwind CSS (Google Stitch Civic Design System)
│   ├── mobile/              # React Native (Expo) app for Citizen field reporting
│   └── ai-service/          # Python FastAPI microservice (Categorization, Semantic Deduplication, Vector Matching)
├── packages/
│   ├── shared/              # Shared TypeScript contracts, enums, DTOs, and domain schemas (@samadhan-ai/shared)
│   └── ui/                  # Reusable accessible UI design components (@samadhan-ai/ui)
├── .github/workflows/
│   └── ci.yml               # GitHub Actions CI workflow (linting, typechecks, and builds)
├── docker-compose.yml       # Production-grade containerized local dev stack
├── .env.example             # Centralized environment variable template
└── package.json             # Monorepo workspace configuration
`

---

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js**: 20.x or higher
- **npm**: 10.x or higher
- **Python**: 3.11+ (for pps/ai-service)
- **Docker** (Optional, for containerized local PostgreSQL + Redis)

### 1. Installation

`ash
# Clone the repository
git clone https://github.com/ayush-singh15/Samadhan-AI.git
cd Samadhan-AI

# Install monorepo dependencies
npm install

# Setup environment variables
cp .env.example .env
`

### 2. Running Services Locally

#### Backend API Service
`ash
cd apps/backend
npm run dev
`
- API Base: http://localhost:5000/api/v1
- Swagger Docs: http://localhost:5000/api-docs

#### Web Frontend (Vite)
`ash
cd apps/web
npm run dev
`
- Local URL: http://localhost:5173

#### AI Microservice (FastAPI)
`ash
cd apps/ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
`
- Interactive Docs: http://localhost:8000/docs

#### Mobile App (React Native Expo)
`ash
cd apps/mobile
npm run start
`

---

## 🔒 Security & Privacy Mandate
- **No Mock Fallbacks in Production**: UI is powered by live database records with real-time SSE streaming.
- **Role-Based Access Control**: Strict multi-tenant RBAC (CITIZEN, GOVERNMENT, UNIVERSITY, INDUSTRY, ADMIN).
- **Audit Ledger**: Immutable SHA-256 cryptographic logs recording all milestone completions and grant releases.

---

## 👨‍💻 Author & Contributor
- **Ayush Singh** ([@ayush-singh15](https://github.com/ayush-singh15))
- Contact: spec.ayush@gmail.com
- Sole Project Architect, Maintainer & Contributor.

---

## 📄 License
This project is licensed under the **MIT License**.
