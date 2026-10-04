# SIH-182: TraceVASP — Blockchain Intelligence & VASP Attribution Platform

> **Smart India Hackathon (SIH) — Problem Statement 182**  
> **Automated Attribution of Unknown Cryptocurrency Wallets to Nearest Virtual Asset Service Providers (VASPs) through Blockchain Intelligence APIs**

---

## Project Overview

**TraceVASP** is an institutional-grade digital forensics and cryptocurrency intelligence platform engineered specifically for cybercrime investigators, intelligence analysts, and judicial prosecution teams.

When law enforcement identifies an unknown suspect cryptocurrency wallet involved in illicit transactions, **TraceVASP** automatically analyzes multi-hop fund-flow topologies across multiple blockchain ledgers (Ethereum, Bitcoin, BNB Chain, Polygon, TRON, and Solana). It traverses intermediary layering pathways, identifies peeling chains and mixer interactions, computes transparent attribution scores to destination Virtual Asset Service Providers (VASPs), generates court-admissible Section 65B forensic PDF dossiers with cryptographic SHA-256 manifests, and provides an integration adapter for the Indian Cyber Crime Coordination Centre / SAHYOG portal.

---

## Architecture

TraceVASP is architected for single-domain, production-ready reliability:

```
Internet / Investigator Browser
               │
               ▼
   HTTPS Reverse Proxy / Nginx (Port 80 / 443)
               │
      ┌────────┴──────────────────────────┐
      ▼                                   ▼
Frontend SPA (/)                  Backend API (/api/)
• React 18 + TypeScript           • FastAPI (Python 3.11+)
• Interactive React Flow Canvas   • 5-Signal Explainable AI
• Recharts Analytics Dashboards   • ReportLab 16-Section PDF
• Mobile Responsive Layout        • Multi-Chain RPC Connectors
                                          │
                                          ▼
                                Database (PostgreSQL / SQLite)
                                          │
                                          ▼
                                SHA-256 Evidence Vault & ZIP Packager
```

### Fund-Flow Pipeline
1. **Wallet Validation:** Validates address format and checksum across supported blockchains.
2. **Transaction Collection:** Queries live blockchain nodes/APIs with automatic fallback to deterministic forensic fixtures.
3. **Graph Construction:** Builds a multi-layer directed graph using NetworkX.
4. **Multi-Hop Traversal:** Executes BFS depth-pruned traversal identifying intermediaries, mixers, and bridges.
5. **Entity Attribution:** Identifies known VASP deposit clusters and cold/hot storage addresses.
6. **Explainable AI Scoring:** Calculates transparent attribution confidence based on 5 weighted heuristic signals.
7. **Typology Recognition:** Detects laundering patterns including layering, rapid movement, mixer exposure, and peel chains.
8. **Digital Evidence Manifest:** Cryptographically hashes all evidence artifacts with SHA-256.
9. **Forensic Report Generation:** Generates 16-section Section 65B Indian Evidence Act compliant PDF reports and digital evidence packages.
10. **SAHYOG Gateway:** Prepares Section 91 CrPC Information Disclosure and Section 102 CrPC Asset Freeze directives.

---

## Features

- **Multi-Blockchain Intelligence:** Unified data model covering Ethereum, Bitcoin, BNB Chain, Polygon, TRON, and Solana.
- **Interactive React Flow Canvas:** Full-screen graph exploration with color-coded nodes (Suspect Wallet, Intermediaries, Mixers, Bridges, and VASP Gateways).
- **Explainable 5-Signal Attribution Scoring:**
  - Address / Cluster Match (30%)
  - Interaction Strength (25%)
  - Hop Distance Proximity (20%)
  - Volume Parity Similarity (15%)
  - Temporal Cadence (10%)
- **Automated Typology Recognition:** Identifies Layering, Rapid Fund Movement, Mixer Exposure, Bridge Gateway hops, Fan-Out, Fan-In, and Peel Chains.
- **Tamper-Evident SHA-256 Evidence Vault:** Generates digital cryptographic fingerprints for every transaction, case, and attribution record.
- **Courtroom-Ready 16-Section PDF Dossiers:** Automatically generated forensic reports with legal declarations, chain of custody, and digital evidence ZIP packages.
- **SAHYOG Interoperability Adapter:** Automated drafting and dispatch of Section 91 CrPC disclosure requests and Section 102 CrPC asset freeze orders.
- **Role-Based Access Control (RBAC):** Granular access control for Investigators, Supervisors, and Platform Administrators with immutable audit logging.
- **Mobile Responsive Console:** Works across mobile phones (360px, 390px, 412px), tablets, and desktop browsers.

---

## Technology Stack

### Frontend
- **Framework:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS (Dark institutional theme)
- **Graph Engine:** `@xyflow/react` (React Flow)
- **Visualizations:** Recharts, Lucide React
- **State & Networking:** TanStack Query, Axios

### Backend
- **Framework:** Python 3.11+, FastAPI, Uvicorn
- **Graph & Algorithms:** NetworkX
- **Data & ORM:** SQLAlchemy 2.0, Alembic, PostgreSQL (`psycopg2-binary`), SQLite
- **Forensic PDF:** ReportLab
- **Security:** PyJWT, Bcrypt, Python-dotenv, Pydantic v2
- **Testing:** Pytest

### DevOps & Infrastructure
- **Containerization:** Docker, Docker Compose
- **Web Server & Reverse Proxy:** Nginx (Alpine)

---

## Project Structure

```
SIH-182/
├── .dockerignore                 # Excludes caches, venvs, and node_modules
├── .env.example                  # Documented environment variables template
├── .gitignore                    # Production gitignore
├── docker-compose.yml            # Multi-service production orchestration
├── README.md                     # Project documentation
├── backend/                      # FastAPI Python Application
│   ├── Dockerfile                # Multi-stage production container
│   ├── requirements.txt          # Python dependencies
│   ├── alembic/                  # Database schema migrations
│   ├── app/                      # Application source code
│   │   ├── api/                  # REST endpoint routers
│   │   ├── attribution/          # 5-Signal scoring engine
│   │   ├── audit/                # Immutable audit service
│   │   ├── auth/                 # JWT security & RBAC
│   │   ├── blockchain/           # Multi-chain RPC adapters
│   │   ├── graph/                # NetworkX traversal engine
│   │   ├── models/               # SQLAlchemy ORM models
│   │   ├── reports/              # 16-Section ReportLab PDF generator
│   │   ├── risk/                 # Obfuscation risk engine
│   │   ├── sahyog/               # Cybercrime portal adapter
│   │   ├── schemas/              # Pydantic v2 schemas
│   │   ├── services/             # Evidence service & ZIP packager
│   │   ├── typology/             # Money laundering pattern engine
│   │   ├── config.py             # Application settings
│   │   ├── database.py           # Database connection & session
│   │   ├── database_seed.py      # Demo case & dataset seeder
│   │   └── main.py               # FastAPI entry point & SPA router
│   └── tests/                    # Automated test suite
├── frontend/                     # React 18 Application
│   ├── Dockerfile                # Nginx production container
│   ├── nginx.conf                # Nginx reverse proxy configuration
│   ├── package.json              # NPM dependencies & scripts
│   ├── tsconfig.json             # TypeScript configuration
│   ├── vite.config.ts            # Vite bundler configuration
│   └── src/                      # React source code
├── data/                         # Data fixtures
├── database/                     # Database seed configuration
├── docs/                         # Technical documentation
│   ├── api.md                    # API reference
│   ├── architecture.md           # Architecture blueprint
│   ├── demo.md                   # Demo script
│   ├── setup.md                  # Setup guide
│   └── DEVELOPMENT.md            # Developer & Antigravity agent guide
└── reports/                      # Forensic PDF report storage
```

---

## Requirements

- **For Docker Deployment:** Docker 20+ and Docker Compose v2+ (no local Python or Node required).
- **For Local Development:** Python 3.11+, Node.js 20+, npm 10+.

---

## Local Development

### 1. Clone the Repository
```bash
git clone <repository>
cd SIH-182
```

### 2. Configure Environment
```bash
cp .env.example .env
```

### 3. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run migrations and seed deterministic dataset
alembic upgrade head
python app/database_seed.py

# Start FastAPI server
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
Backend available at: `http://localhost:8000`  
Swagger API Docs: `http://localhost:8000/docs`  
Health Check: `http://localhost:8000/api/health`

### 4. Frontend Setup
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend available at: `http://localhost:5173`

---

## Docker Setup

Run the entire platform with one command:

```bash
git clone <repository>
cd SIH-182
cp .env.example .env
docker compose up --build -d
```

### Verify Running Containers
```bash
docker compose ps
```

### Monitor Logs
```bash
docker compose logs -f
```

### Stop Containers
```bash
docker compose down
```

---

## Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PROJECT_NAME` | Application name | `"TraceVASP"` |
| `ENVIRONMENT` | Environment (`development` / `production`) | `"production"` |
| `DEBUG` | Enable debug logs | `false` |
| `HOST` | Server bind host | `0.0.0.0` |
| `PORT` | Server bind port | `8000` |
| `DATABASE_URL` | Database connection string | `postgresql://postgres:postgres@postgres:5432/tracevasp` |
| `JWT_SECRET` | Secret key for JWT signing | Strong random string |
| `JWT_ALGORITHM` | JWT hashing algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime | `480` |
| `CORS_ORIGINS` | Permitted CORS origins | `*` |
| `VITE_API_URL` | Frontend API base path | `/api` |
| `SAHYOG_MOCK_MODE` | Simulate SAHYOG portal integration | `true` |
| `REPORT_DIR` | Forensic PDF output storage path | `/app/reports` |
| `ETHEREUM_API_KEY` | Optional Etherscan API key | (Optional) |

---

## Database Setup

TraceVASP supports dual database backends:
1. **PostgreSQL (Production / Docker):** Managed automatically through Docker Compose with health checks and persistent volume storage.
2. **SQLite (Local Standalone):** Default zero-config fallback (`tracevasp.db`).

### Schema Initialization & Migrations
On startup, `backend/app/main.py` automatically initializes all database tables via `Base.metadata.create_all` and seeds the demonstration dataset if the database is unpopulated.

To run migrations manually:
```bash
cd backend
alembic upgrade head
python app/database_seed.py
```

---

## AI/ML Model Setup

TraceVASP utilizes **Transparent Explainable AI (XAI)** heuristic graph algorithms implemented with NetworkX. 

- **No bulky binary model downloads required:** No `.pt`, `.pth`, `.safetensors`, or external GPU dependencies.
- **Fast Execution:** Sub-second BFS pathfinding and scoring on standard CPU architectures.
- **Low Memory Footprint:** Operates efficiently within 256MB RAM.
- **Evidentiary Compliance:** 100% deterministic, explainable calculations admissible under Section 65B of the Indian Evidence Act.

---

## API Documentation

Interactive Swagger documentation is available at:
`http://localhost:8000/docs` (or `http://localhost/docs` in Docker)

Key routes:
- `GET /api/health` — System & database health status
- `POST /api/auth/login` — Authentication & JWT acquisition
- `GET /api/dashboard` — Analytical intelligence metrics
- `POST /api/wallets/analyze` — Run wallet attribution and risk pipeline
- `GET /api/wallets/{address}/graph` — NetworkX fund-flow graph data
- `GET /api/wallets/{address}/attribution` — Explainable VASP attribution scores
- `POST /api/reports` — Generate 16-section legal PDF dossier
- `GET /api/reports/{id}/package` — Download courtroom-ready ZIP package

---

## Production Deployment

### Single-Container Deployment (Render / Cloud Run / Railway / VPS)
The `backend/Dockerfile` uses a multi-stage build that compiles the frontend SPA and embeds it directly into the Python container. Setting `PORT` allows the entire application to be served from a single port without an external proxy.

### Multi-Container Deployment (Docker Compose / EC2 / K8s)
Use the included `docker-compose.yml` to spin up PostgreSQL, the FastAPI backend, and the Nginx frontend reverse proxy.

---

## GitHub Repository

```bash
git remote add origin https://github.com/<USERNAME>/SIH-182.git
git branch -M main
git push -u origin main
```

---

## Health Check

Verify that the platform is operational:

```bash
curl -f http://localhost/api/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "SIH-182 backend",
  "database": "connected",
  "version": "1.0.0",
  "environment": "production",
  "sahyog_mode": "PROTOTYPE_SIMULATION"
}
```

---

## Demonstration Credentials

| Role | Email | Password | Badge Number | Agency |
| :--- | :--- | :--- | :--- | :--- |
| **Investigator** | `investigator@tracevasp.demo` | `Demo@12345` | `LEA-KA-5419` | Cyber Crime Investigation Cell |
| **Supervisor** | `supervisor@tracevasp.demo` | `Supervisor@12345` | `LEA-DIR-102` | State Cyber Operations Directorate |
| **Admin** | `admin@tracevasp.demo` | `Admin@12345` | `SEC-SYS-01` | Platform Operations |

**Primary Demonstration Case:** `CASE-DEMO-182`  
**Suspect Target Wallet:** `0x742d35cc6634c0532925a3b844bc454e4438f44e` (Ethereum)

---

## Troubleshooting

1. **Port Conflicts:** Ensure ports `80`, `5173`, `8000`, and `5432` are available before running Docker Compose. You can customize ports in `docker-compose.yml`.
2. **Missing Database Tables:** Run `alembic upgrade head` followed by `python backend/app/database_seed.py`.
3. **Frontend API Communication:** The frontend defaults to `/api`. If deploying frontend and backend to distinct origins, set `VITE_API_URL` to your backend URL.
4. **Report Storage Permissions:** Ensure the directory specified in `REPORT_DIR` has write permissions.

---

## Team / SIH Information

- **Competition:** Smart India Hackathon (SIH) 2026
- **Problem Statement ID:** SIH26182 (SIH-182)
- **Domain:** Blockchain Forensics, Cybercrime Investigation, Law Enforcement Intelligence
- **Organization:** Ministry of Home Affairs (MHA) / Indian Cyber Crime Coordination Centre (I4C)
