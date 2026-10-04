# TraceVASP — Installation & Environment Setup Guide

## 1. Prerequisites

- Python 3.11+
- Node.js v18+ and npm
- Docker & Docker Compose (optional for containerized deployment)

---

## 2. Environment Variables (.env)

Create a `.env` file in the project root:

```env
PROJECT_NAME="TraceVASP"
ENVIRONMENT="development"
DEBUG=true

# Database (Default: SQLite for local execution, PostgreSQL for Docker)
DATABASE_URL=sqlite:///./tracevasp.db

# JWT Authentication
JWT_SECRET=demo-secret-key-tracevasp-investigator-auth-sih2026-secure
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480

# Blockchain Intelligence API Keys (Optional - fallback to Deterministic Demo Dataset if not provided)
ETHEREUM_API_KEY=
ETHERSCAN_API_KEY=
ALCHEMY_API_KEY=
BITCOIN_API_KEY=
BNB_API_KEY=
POLYGON_API_KEY=
TRON_API_KEY=
SOLANA_RPC_URL=

# SAHYOG Adapter Configuration
SAHYOG_MOCK_MODE=true
SAHYOG_API_ENDPOINT=https://sahyog.gov.in/api/v1
SAHYOG_API_KEY=

# Report Storage Path
REPORT_DIR=./reports
```

---

## 3. Local Installation Steps

### Step 1: Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
python app/database_seed.py
```

### Step 2: Start Backend Daemon

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Step 3: Frontend Setup & Start

In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to access the platform.

---

## 4. Docker Deployment

```bash
docker compose up --build
```

Access:
- Frontend: `http://localhost:5173` or `http://localhost:80`
- Backend API Docs: `http://localhost:8000/docs`
