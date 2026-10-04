# TraceVASP — System Architecture Document

## 1. System Overview

TraceVASP is structured as a decoupled micro-architecture combining a responsive React/TypeScript client with an asynchronous FastAPI intelligence daemon and high-performance graph processing engine.

```mermaid
flowchart TD
    subgraph Frontend ["Frontend (React 18 + TypeScript + Vite)"]
        UI[Law Enforcement UI Console]
        RF[React Flow Graph Canvas]
        Charts[Recharts Analytics]
        Axios[API Client + JWT Interceptors]
    end

    subgraph Gateway ["Nginx / API Gateway"]
        Proxy[Reverse Proxy :80 / :5173]
    end

    subgraph Backend ["Backend Daemon (FastAPI)"]
        Auth[JWT & RBAC Controller]
        Cases[Case Management Service]
        Wallets[Wallet Investigation Engine]
        GraphEng[NetworkX Multi-Hop Graph Traversal]
        AttrEng[5-Signal Attribution Engine]
        RiskEng[Analytical Risk & Typology Engine]
        RepGen[ReportLab 16-Section PDF Engine]
        Evid[SHA-256 Tamper-Evident Package Service]
        Sahyog[SAHYOG Portal Adapter]
    end

    subgraph Adapters ["Blockchain Intelligence Adapters"]
        Eth[Ethereum Adapter - Etherscan / RPC]
        Btc[Bitcoin Adapter - Blockstream / Legacy / SegWit]
        Bnb[BNB Chain Adapter - BscScan]
        Poly[Polygon Adapter - PolygonScan]
        Trx[TRON Adapter - TronGrid]
        Sol[Solana Adapter - Solana RPC]
    end

    subgraph Storage ["Persistence Layer"]
        DB[(PostgreSQL / SQLite Database)]
        Reports[(Encrypted Evidence & PDF Vault)]
    end

    UI --> Proxy
    Proxy --> Auth
    Proxy --> Cases
    Proxy --> Wallets
    Proxy --> Sahyog
    Proxy --> RepGen
    Wallets --> GraphEng
    GraphEng --> Adapters
    Wallets --> AttrEng
    Wallets --> RiskEng
    AttrEng --> DB
    RiskEng --> DB
    RepGen --> Reports
    Evid --> Reports
    Cases --> DB
    Auth --> DB
```

## 2. Multi-Hop Attribution Algorithm

The VASP Attribution Engine employs a 5-signal weighted heuristic model:

$$\text{Confidence} = w_1 S_{\text{cluster}} + w_2 S_{\text{interaction}} + w_3 S_{\text{hop}} + w_4 S_{\text{volume}} + w_5 S_{\text{temporal}}$$

Where:
- $w_1 = 30\%$: Address cluster match (Direct deposit wallet vs hot wallet pool).
- $w_2 = 25\%$: Interaction strength (Corroborating edge frequency).
- $w_3 = 20\%$: Hop distance proximity (Inversely proportional to traversal depth).
- $w_4 = 15\%$: Volume parity ratio ($V_{\text{dest}} / V_{\text{target}}$).
- $w_5 = 10\%$: Temporal velocity (Execution window tightness).

## 3. Cryptographic Chain-of-Custody (Section 65B Compliance)

Every analyzed artifact generates a canonical JSON serialization:
$$\text{Digest} = \text{SHA256}(\text{CanonicalJSON}(\text{Payload}))$$

Digital Evidence Packages export all intermediate states alongside a signed `manifest.json` containing SHA-256 digests for verifiable evidentiary integrity.
