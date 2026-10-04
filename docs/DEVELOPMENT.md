# TraceVASP — Developer & Antigravity Agent Guide

> **Smart India Hackathon (SIH) — Problem Statement 182**  
> **TraceVASP: Automated Cryptocurrency Wallet Attribution to Nearest Virtual Asset Service Providers (VASPs)**

---

## 1. Project Architecture Overview

TraceVASP is an end-to-end blockchain intelligence and digital forensics platform designed for law-enforcement officers, forensic investigators, and judicial prosecution teams.

```
                    Internet / Investigator Web Browser
                                   │
                                   ▼
             HTTPS (Port 80/443 / Cloudflare / Reverse Proxy)
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
         [ Frontend Application ]       [ Backend REST API ]
         • React 18 + Vite              • FastAPI (Python 3.11+)
         • TypeScript + Tailwind CSS    • NetworkX Graph Engine
         • @xyflow/react Graph Canvas   • ReportLab 16-Sec PDF Engine
         • TanStack Query + Axios       • Multi-Chain RPC Connectors
                    │                             │
                    └──────────────┬──────────────┘
                                   ▼
                        [ Storage & Database ]
                        • PostgreSQL (Docker / Prod)
                        • SQLite (Zero-config local)
                        • SHA-256 Tamper Evidence
                        • Reports Storage Volume
```

---

## 2. Directory Structure

```
SIH-182/
├── .dockerignore                 # Excludes caches, venvs, and node_modules from Docker
├── .env.example                  # Documented environment variable template
├── .gitignore                    # Production gitignore excluding secrets and build outputs
├── docker-compose.yml            # Multi-container orchestration (PostgreSQL, Backend, Frontend)
├── README.md                     # Institutional overview, quick start, demo guide
│
├── backend/                      # FastAPI Python Application
│   ├── Dockerfile                # Multi-stage production container with healthcheck
│   ├── requirements.txt          # Python dependencies (SQLAlchemy, psycopg2, NetworkX, ReportLab)
│   ├── alembic.ini               # Database migration configuration
│   ├── alembic/                  # Version-controlled database schema migrations
│   │   └── versions/             # Migration files (initial schema)
│   ├── app/
│   │   ├── main.py               # FastAPI entry point, CORS, routes, SPA fallback, /api/health
│   │   ├── config.py             # Pydantic BaseSettings loading from environment
│   │   ├── database.py           # SQLAlchemy engine, session maker, SQLite/PostgreSQL detection
│   │   ├── database_seed.py      # Deterministic demo dataset seeder (users, cases, VASPs, txs)
│   │   ├── auth/                 # JWT Bearer auth, bcrypt password hashing, role dependencies
│   │   ├── api/                  # REST route controllers
│   │   │   ├── audit.py          # /api/audit-logs
│   │   │   ├── cases.py          # /api/cases
│   │   │   ├── dashboard.py      # /api/dashboard
│   │   │   ├── evidence.py       # /api/evidence
│   │   │   ├── reports.py        # /api/reports (PDF & digital evidence ZIP download)
│   │   │   ├── sahyog.py         # /api/sahyog (Sec 91 / Sec 102 notices)
│   │   │   ├── search.py         # /api/search
│   │   │   ├── vasps.py          # /api/vasps
│   │   │   └── wallets.py        # /api/wallets (analyze, transactions, graph, attribution, risk)
│   │   ├── attribution/          # 5-Signal explainable attribution scoring engine
│   │   ├── audit/                # Immutable action ledger service
│   │   ├── blockchain/           # Blockchain adapters (Ethereum, Bitcoin, BNB, Polygon, Tron, Solana)
│   │   ├── graph/                # NetworkX multi-hop BFS graph engine & serialization
│   │   ├── models/               # SQLAlchemy ORM models
│   │   ├── reports/              # 16-Section ReportLab legal forensic PDF generator
│   │   ├── risk/                 # Obfuscation risk engine (mixer, bridge, velocity scoring)
│   │   ├── sahyog/               # Indian Cyber Crime Coordination Centre adapter
│   │   ├── schemas/              # Pydantic request/response schemas
│   │   ├── services/             # Evidence service & ZIP manifest packager
│   │   └── typology/             # Money laundering pattern engine (layering, peel chain, fan-out)
│   └── tests/
│       ├── conftest.py           # Pytest test fixtures & in-memory SQLite client
│       └── test_all.py           # Comprehensive automated unit & integration tests
│
├── frontend/                     # React 18 + TypeScript + Vite Application
│   ├── Dockerfile                # Multi-stage Nginx production container
│   ├── nginx.conf                # Nginx reverse proxy configuration (/ -> SPA, /api/ -> backend)
│   ├── package.json              # NPM dependencies & build scripts
│   ├── tsconfig.json             # TypeScript compiler configuration
│   ├── vite.config.ts            # Vite bundler configuration & local dev proxy
│   ├── tailwind.config.js        # Institutional dark-mode design system tokens
│   └── src/
│       ├── main.tsx              # Application bootstrapper
│       ├── App.tsx               # Root component with QueryClientProvider
│       ├── vite-env.d.ts         # Vite client type definitions
│       ├── index.css             # Tailwind base styles and scrollbar definitions
│       ├── router/index.tsx      # React Router route table & ProtectedRoute guard
│       ├── types/index.ts        # TypeScript data interfaces matching backend models
│       ├── services/api.ts       # Axios client with JWT interceptor & service modules
│       ├── layouts/
│       │   └── DashboardLayout.tsx # Responsive application layout with mobile drawer
│       ├── components/
│       │   ├── BrandShield.tsx   # Institutional vector SVG badge
│       │   ├── CustomNode.tsx    # React Flow custom node with risk badges & cluster tags
│       │   ├── Navbar.tsx        # Top navigation, global search, quick-demo, mobile toggle
│       │   └── Sidebar.tsx       # Sidebar navigation with responsive mobile slide-out drawer
│       └── pages/
│           ├── Login.tsx         # Quick-fill demo credentials & role switcher
│           ├── Dashboard.tsx     # Metrics, distribution charts, quick actions
│           ├── Cases.tsx         # Investigation cases vault & case creator
│           ├── CaseDetail.tsx    # Single case overview & suspect wallet manager
│           ├── Investigation.tsx # Wallet analysis console, raw txs, code export
│           ├── TransactionGraph.tsx # Interactive React Flow canvas with node inspection
│           ├── Attribution.tsx   # 5-Signal scoring breakdown bars & candidate ranking
│           ├── RiskAnalysis.tsx  # Obfuscation risk radar, typology cards, timeline
│           ├── Reports.tsx       # Forensic PDF report generation & ZIP package download
│           ├── VASPRegistry.tsx  # Centralized VASP directory with cluster addresses
│           ├── Evidence.tsx      # SHA-256 evidence vault with real-time verification
│           ├── SAHYOG.tsx        # Sec 91 CrPC notice generator & asset freeze directive
│           ├── AuditLogs.tsx     # Immutable investigator action audit trail
│           └── Settings.tsx      # System configuration & API status
│
├── docs/                         # Technical Documentation
│   ├── api.md                    # REST API endpoint reference
│   ├── architecture.md           # System architecture & fund-flow pipeline
│   ├── demo.md                   # Step-by-step hackathon jury presentation guide
│   ├── setup.md                  # Development environment installation steps
│   └── DEVELOPMENT.md            # Antigravity continuity and engineering guide
│
├── data/                         # Deterministic data fixtures
│   ├── demo_cases/
│   ├── sample_transactions/
│   └── vasp_registry/
├── database/seed/                # Seed scripts
└── reports/                      # Output directory for generated PDF dossiers
```

---

## 3. Technology Stack & Key Libraries

| Component | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `^18.2.0` | Reactive component UI |
| **Type Safety** | TypeScript | `^5.2.2` | Compile-time validation |
| **Build Tool** | Vite | `^5.1.6` | Fast bundling & HMR |
| **Styling** | Tailwind CSS | `^3.4.1` | Dark-mode institutional styling |
| **Graph Visualization** | `@xyflow/react` | `^12.0.0` | Interactive blockchain fund-flow canvas |
| **Charts** | Recharts | `^2.12.3` | KPI & risk distribution visuals |
| **Icons** | Lucide React | `^0.363.0` | UI iconography |
| **HTTP Client** | Axios | `^1.6.8` | REST client with JWT interceptors |
| **Data Fetching** | TanStack Query | `^5.28.0` | Caching & auto-revalidation |
| **Backend Framework** | FastAPI | `>=0.110.0` | High-performance Python async API |
| **Server** | Uvicorn | `>=0.28.0` | ASGI production server |
| **ORM** | SQLAlchemy | `>=2.0.28` | Database query and schema abstraction |
| **PostgreSQL Driver** | `psycopg2-binary` | `>=2.9.9` | Production PostgreSQL connector |
| **Database Migrations** | Alembic | `>=1.13.1` | Schema version control |
| **Graph Analytics** | NetworkX | `>=3.2.1` | DiGraph traversal & multi-hop BFS |
| **Forensic PDF** | ReportLab | `>=4.1.0` | Courtroom-ready 16-section PDF creation |
| **Authentication** | PyJWT + Bcrypt | `>=2.8.0` | Cryptographic JWT & password hashing |
| **Containerization** | Docker & Compose | `3.8+` | Isolated multi-platform execution |
| **Reverse Proxy** | Nginx | `alpine` | Static asset serving, gzip, API routing |

---

## 4. Local Development Setup

### Prerequisites
- Node.js `20+` & npm `10+`
- Python `3.11+`

### Step 1: Clone Repository
```bash
git clone <REPO_URL>
cd SIH-182
```

### Step 2: Environment Setup
```bash
cp .env.example .env
```

### Step 3: Run Backend Locally
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run migrations and seed deterministic dataset
alembic upgrade head
python app/database_seed.py

# Start backend server
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
Backend API docs: `http://localhost:8000/docs`  
Backend health check: `http://localhost:8000/api/health`

### Step 4: Run Frontend Locally
In another terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend UI: `http://localhost:5173`

---

## 5. Docker Production Setup

To run the complete production stack (PostgreSQL + FastAPI + Nginx Frontend):

```bash
# Build and launch all services
docker compose up --build -d

# Check running status
docker compose ps

# View service logs
docker compose logs -f

# Verify production health
curl http://localhost/api/health
```

The application is accessible on:
- Single Domain: `http://localhost/`
- API Endpoints: `http://localhost/api/`
- Swagger Docs: `http://localhost/docs`
- Healthcheck: `http://localhost/api/health`

To stop:
```bash
docker compose down
```

---

## 6. AI & Heuristic Models

TraceVASP implements **Explainable AI (XAI)** based on graph theory and algorithmic intelligence rather than black-box models, ensuring full evidentiary transparency for court proceedings:

1. **5-Signal Attribution Scoring (`backend/app/attribution/engine.py`):**
   - **Address / Cluster Match (30%):** Direct deposit address matching to known VASP hot wallets.
   - **Interaction Strength (25%):** Number and density of corroborating transactions.
   - **Hop Distance Proximity (20%):** Shortest path length in directed graph ($1/d$).
   - **Volume Parity (15%):** Flow volume arriving at VASP relative to initial outflow.
   - **Temporal Pattern (10%):** Transaction cadence and velocity.
2. **Obfuscation & Risk Engine (`backend/app/risk/engine.py`):**
   - Calculates risk scores (0-100) using mixer exposure, bridge exposure, fund velocity, and layering complexity.
3. **Typology Recognition Engine (`backend/app/typology/engine.py`):**
   - Multi-hop layering chains ($A \to B \to C \to D$).
   - Rapid movement (< 120 minutes liquidation window).
   - Fan-out disbursements and fan-in aggregation.
   - Privacy mixer and cross-chain bridge gateway interactions.
   - Peel chain residual diversion patterns.

**Model Weight Requirement:** Zero large external weight files required. The algorithms run deterministically using Python and NetworkX, guaranteeing high-speed inference (< 50ms) with minimal memory footprint (< 150MB RAM).

---

## 7. Key REST API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service and database health | No |
| `POST` | `/api/auth/login` | JWT login with email/password | No |
| `GET` | `/api/auth/me` | Fetch active user profile | Yes |
| `GET` | `/api/dashboard` | KPI metrics and alert summary | Yes |
| `GET` | `/api/cases` | List all investigation cases | Yes |
| `POST` | `/api/cases` | Create a new investigation case | Yes |
| `POST` | `/api/wallets/analyze` | Run 9-step attribution pipeline | Yes |
| `GET` | `/api/wallets/{addr}/graph` | NetworkX graph data for React Flow | Yes |
| `GET` | `/api/wallets/{addr}/attribution` | Explainable candidate VASP scores | Yes |
| `GET` | `/api/wallets/{addr}/risk` | Risk category and signal details | Yes |
| `GET` | `/api/vasps` | Directory of verified VASPs | Yes |
| `POST` | `/api/reports` | Compile 16-section PDF report | Yes |
| `GET` | `/api/reports/{id}/download` | Stream PDF forensic dossier | Yes |
| `GET` | `/api/reports/{id}/package` | Download court-ready ZIP package | Yes |
| `POST` | `/api/evidence/verify` | Verify SHA-256 evidence integrity | Yes |
| `POST` | `/api/sahyog/disclosure-request`| Issue Section 91 CrPC notice | Yes |
| `POST` | `/api/sahyog/freeze-request`| Issue Section 102 CrPC freeze | Yes |
| `GET` | `/api/audit-logs` | Query immutable audit ledger | Yes |

---

## 8. Demo Credentials

| Role | Email | Password | Badge Number |
| :--- | :--- | :--- | :--- |
| **Investigator** | `investigator@tracevasp.demo` | `Demo@12345` | `LEA-KA-5419` |
| **Supervisor** | `supervisor@tracevasp.demo` | `Supervisor@12345` | `LEA-DIR-102` |
| **Admin** | `admin@tracevasp.demo` | `Admin@12345` | `SEC-SYS-01` |

---

## 9. Continuous Integration & Deployment

### GitHub Workflow
1. Working branch: `main`
2. All secrets stored in GitHub Repository Secrets (never committed to code).
3. Push to `main` triggers automated build and deployment.

### Single-Container Deployment (e.g. Render, Railway, Cloud Run, VPS)
The `backend/Dockerfile` includes a multi-stage build that compiles the frontend and packages it directly into the Python container. Running the container binds to `${PORT}` and serves both the frontend SPA and backend API on a single port without needing a separate proxy.

### Multi-Container Deployment (e.g. EC2, DigitalOcean, self-hosted Docker)
`docker-compose up --build -d` runs PostgreSQL, the FastAPI backend, and Nginx. Nginx routes `/` to the compiled React bundle and `/api/` to FastAPI.

---

## 10. Future Enhancements & Roadmap
- Integration with live Indian LEA SSO / CCTNS gateway.
- Graph neural network (GNN) embeddings for unsupervised entity resolution.
- Real-time mempool WebSocket monitoring for pending VASP deposits.
- Expansion to Monero / Zcash zero-knowledge privacy tracing heuristics.
