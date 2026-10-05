# SIH-182 TraceVASP — Permanent Production Cloud Deployment Guide

## 1. Executive Summary & Architecture

This guide provides complete, production-grade instructions to deploy **TraceVASP (SIH-182)** permanently to the cloud.

### The Problem With Ephemeral Quick Tunnels
Previously, the application was intermittently served through a temporary Cloudflare Quick Tunnel (`trycloudflare.com`). Quick tunnels are ephemeral, debugging utilities created by running `cloudflared` on a local machine without authentication:
- When your local computer, Windows host, WSL, VS Code, terminal, or Docker Desktop is shut down or goes to sleep, the local tunnel process terminates.
- Cloudflare immediately de-registers the ephemeral domain, causing `DNS_PROBE_FINISHED_NXDOMAIN` ("Hmmm... can't reach this page") from any external device or network.

### Permanent Production Architecture
To make the platform accessible from **any device, any network, 24/7/365** without depending on any local workstation:

```
                                  INTERNET
                                      │
                                      ▼
                      HTTPS Public Production Domain
              (e.g., https://sih-182-tracevasp.onrender.com
                     or https://tracevasp.yourdomain.com)
                                      │
                                      ▼
                     Cloud Edge / Cloudflare CDN Proxy
                                      │
                                      ▼
                       Cloud Production Server (Docker)
                                      │
                ┌─────────────────────┴─────────────────────┐
                │                                           │
                ▼                                           ▼
       Frontend SPA UI                                /api Endpoints
     (Vite + React + Tailwind)                    (FastAPI + Uvicorn)
                │                                           │
                │                                           ▼
                │                                 Graph Intelligence
                │                                 & Attribution Engine
                │                                           │
                └─────────────────────┬─────────────────────┘
                                      │
                                      ▼
                                Database Layer
                     (SQLite Volume or Managed PostgreSQL)
```

Both frontend assets and backend APIs are bundled into a unified multi-stage production Docker container:
- **Port:** Bind dynamically via `${PORT:-8000}`.
- **Frontend SPA Routing:** Direct navigation (e.g., `/login`, `/cases`, `/investigate`) and browser refreshes are routed through the SPA fallback without 404 errors.
- **Backend APIs:** Accessible under `/api/...` on the same domain, eliminating CORS preflight overhead and cross-origin blockers.
- **Health Check:** `GET /api/health` and `GET /health` return `{"status": "ok", "service": "SIH-182 backend"}`.

---

## 2. Cloud Provider Selection & Hardware Requirements

### Workload Analysis
- **AI/ML & Graph Processing:** The intelligence engines (Attribution Engine, Risk Engine, Typology Detection) use algorithmic graph models built on NetworkX and SQLAlchemy. They execute in sub-second inference time without requiring multi-gigabyte GPU or binary checkpoint files (`.pth`, `.pt`, `.onnx`).
- **RAM Footprint:** ~150 MB baseline, spikes to ~300 MB under heavy concurrent graph traversal.
- **CPU Footprint:** 0.5 to 1 vCPU is more than sufficient for real-time analysis.
- **Storage:** ~250 MB for the container image, < 50 MB for the initial dataset.

### Recommended Providers
| Platform | Tier | Monthly Cost | Machine Specs | Suitability |
| :--- | :--- | :--- | :--- | :--- |
| **Render (Recommended)** | Free / Starter | Free or $7/mo | 512 MB - 1 GB RAM, 1 vCPU | **Best Choice**: Instant 1-click GitHub deployment via `render.yaml`, automatic SSL, 24/7 uptime, automated build-on-push. |
| **Railway** | Hobby | ~$5/mo | 512 MB RAM, 1 vCPU | Excellent Dockerfile support, instant rollback, managed PostgreSQL plugins. |
| **Fly.io** | Hobby | Free / ~$5/mo | 256 - 512 MB RAM | Global edge deployment via `fly.toml`. |
| **Cloud VPS (DigitalOcean / Hetzner / AWS / GCP)** | Basic Droplet / EC2 | $4 - $6/mo | 1 GB RAM, 1 vCPU, 25 GB SSD | Full control over Docker Compose multi-container stack (Nginx + FastAPI + Postgres). |

---

## 3. Deployment Steps

### Option A: Render Cloud Deployment (Recommended)

1. **Sign Up / Log In:** Go to [https://render.com](https://render.com) and log in using your GitHub account (`akhil-220923`).
2. **Connect Repository:**
   - In Render Dashboard, click **New +** -> **Blueprint**.
   - Select the repository **`akhil-220923/SIH-182`**.
   - Render will automatically detect `render.yaml` in the root directory.
3. **Configure Environment:**
   Render will automatically configure the Web Service (`sih-182-tracevasp`) and the PostgreSQL database (`tracevasp-postgres`) as defined in `render.yaml`.
   Verify the following environment variables:
   - `ENVIRONMENT`: `production`
   - `DEBUG`: `false`
   - `SAHYOG_MOCK_MODE`: `true`
   - `CORS_ORIGINS`: `*`
   - `PORT`: (Managed automatically by Render, usually `10000`)
4. **Deploy:** Click **Apply**.
   - Render builds the multi-stage Docker container (Frontend Vite build + Python backend).
   - Once deployed, Render provides a permanent public HTTPS URL:
     `https://sih-182-tracevasp.onrender.com`
   - This URL is permanent, secure, and functions 24/7 independently of your local computer.

---

### Option B: Railway Deployment

1. Go to [https://railway.app](https://railway.app) and sign in with GitHub.
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select `akhil-220923/SIH-182`.
4. Railway will detect `railway.json` and `Dockerfile`.
5. Under service **Settings** -> **Networking**, click **Generate Domain**.
6. Railway assigns a permanent HTTPS URL: `https://sih-182-production.up.railway.app`.

---

### Option C: Cloud VPS Deployment (Ubuntu 22.04 / 24.04 on AWS, GCP, DigitalOcean, or Hetzner)

If hosting on a dedicated cloud Linux server:

1. **Install Docker & Docker Compose on the VPS:**
   ```bash
   sudo apt-get update
   sudo apt-get install -y ca-certificates curl gnupg
   sudo install -m 0755 -d /etc/apt/keyrings
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
   sudo chmod a+r /etc/apt/keyrings/docker.gpg
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   sudo apt-get update
   sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
   ```

2. **Clone the Repository:**
   ```bash
   git clone https://github.com/akhil-220923/SIH-182.git
   cd SIH-182
   ```

3. **Configure Environment:**
   ```bash
   cp .env.example .env
   # Update JWT_SECRET and credentials if needed
   ```

4. **Launch Multi-Container Stack:**
   ```bash
   docker compose up -d --build
   ```

5. **Verify Running Containers:**
   ```bash
   docker compose ps
   curl http://localhost/api/health
   ```

---

## 4. Custom Domain & Permanent Cloudflare Setup

If using a custom domain (e.g., `tracevasp.yourdomain.com` or `sih182.yourdomain.com`):

### Why Cloudflare DNS Proxy is Different From Quick Tunnels
- **Quick Tunnel (`trycloudflare.com`):** Unauthenticated, temporary reverse SSH socket from your laptop. Dies when the laptop goes to sleep.
- **Cloudflare DNS Proxy (Production):** Cloudflare acts as an enterprise CDN and SSL termination proxy in front of a real cloud server or PaaS. Your laptop is completely out of the loop.

### DNS Configuration
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com).
2. Select your domain zone.
3. Add a **CNAME** record:
   - **Type:** `CNAME`
   - **Name:** `tracevasp` (or `@` for apex domain)
   - **Target:** Your cloud host permanent domain (e.g., `sih-182-tracevasp.onrender.com` or VPS public IP)
   - **Proxy status:** `Proxied` (Orange cloud icon)
4. Under **SSL/TLS Settings**, set encryption mode to **Full** (or Full Strict).
5. In your cloud provider dashboard (e.g., Render or Railway), add the custom domain `tracevasp.yourdomain.com`.
6. Verification will complete automatically in 2-5 minutes.

---

## 5. Automated CI/CD (GitHub Auto-Deployment)

The repository is configured with GitHub Actions (`.github/workflows/ci.yml`).

### Workflow Architecture
```
git push origin main
        │
        ▼
GitHub Actions CI
  ├─ 1. Run Python 3.11 unit tests & pytest suite
  ├─ 2. Build Vite React frontend (type checks + minification)
  └─ 3. Verify Docker multi-stage build
        │
        ▼ (On Success)
Trigger Cloud Deployment
  ├─ Cloud host auto-detects new commit on main branch
  └─ OR triggers secret DEPLOY_WEBHOOK_URL
        │
        ▼
Zero-Downtime Rolling Update on Production Server
```

### Adding a Deploy Webhook (Optional for Instant Triggers)
If using Render or Railway webhooks:
1. In Render, go to **Settings** -> **Deploy Hook** -> Copy webhook URL.
2. In GitHub repository **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**:
   - Name: `DEPLOY_WEBHOOK_URL`
   - Value: `<Pasted Webhook URL>`
3. Future pushes to `main` will automatically trigger the webhook.

---

## 6. Verification Checklist

Test the following endpoints on the deployed public HTTPS URL:

| Test Item | Endpoint / Action | Expected Result |
| :--- | :--- | :--- |
| **Health Check** | `GET /api/health` | `{"status": "ok", "service": "SIH-182 backend"}` (HTTP 200) |
| **Direct Login Page** | `GET /login` | Loads full React UI with login form |
| **Page Refresh** | Refresh `/login` in browser | Page reloads without 404 error |
| **Authentication** | Submit credentials (`investigator@tracevasp.demo` / `Demo@12345`) | Issues JWT, redirects to `/dashboard` |
| **Dashboard Metrics** | `GET /api/dashboard` | Returns active cases, charts, and alerts |
| **Graph Intelligence** | Navigate to `/investigate` and analyze `0x742d35cc6634c0532925a3b844bc454e4438f44e` | Computes interactive graph, multi-hop attribution, and risk score |
| **Power Off Test** | Turn off local PC / disconnect internet | Public URL remains accessible from smartphone / external devices |

---

## 7. Operational Runbook

### Updating the Production Application
Whenever you make updates to the codebase:
```bash
git add .
git commit -m "feat: your feature description"
git push origin main
```
The cloud host will automatically detect the commit, execute the build, run tests, and perform a rolling redeployment.

### Rolling Back a Release
- **In Render / Railway:** Go to the **Deploys** tab, find the previous working build, and click **Rollback to this deploy**.
- **In Git:**
  ```bash
  git revert HEAD
  git push origin main
  ```
