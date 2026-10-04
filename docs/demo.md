# TraceVASP — Smart India Hackathon 2026 Jury Demonstration Script

## Demonstration Objective

Showcase an automated end-to-end cybercrime intelligence investigation tracing an unknown suspect cryptocurrency address through multi-hop layering pathways to identify the nearest VASP, evaluate money-laundering typologies, compile a Section 65B forensic report, and dispatch a simulated Section 91 CrPC notice via SAHYOG.

---

## Step-by-Step Presentation Walkthrough

### Step 1: Officer Authentication & Role Authorization
1. Navigate to `http://localhost:5173/login`.
2. Notice the law enforcement login console.
3. Click the quick-role button **Investigator** (`investigator@tracevasp.demo` / `Demo@12345`).
4. Click **Access Intelligence Console**.

### Step 2: Overview Dashboard
1. The **Cybercrime Intelligence Dashboard** displays:
   - 6 KPI metric cards: Active Cases, Wallets Analyzed, Tx Processed, VASP Attributions, High Risk Cases, Reports Generated.
   - Interactive charts: Transactions by Blockchain, Investigations by Risk Level, VASP Attribution Frequency.
   - Live Analytical Alerts feed.

### Step 3: Trigger Demo Investigation (CASE-DEMO-182)
1. Click the glowing button **Load Demo Case (CASE-DEMO-182)** in the top banner.
2. The system transitions to the **Wallet Analysis** workflow:
   - Target Wallet: `0x742d35cc6634c0532925a3b844bc454e4438f44e`
   - Ledger: `Ethereum (ETH)`
   - Max Traversal Hops: `3 Hops`
   - Data Source: `Deterministic Demo Dataset`
3. Observe the live 9-step progress animation displaying:
   - *Validating wallet address format...*
   - *Querying blockchain transaction records...*
   - *Constructing directed counterparty graph...*
   - *Matching candidate VASP clusters...*
   - *Computing explainable attribution scores...*
4. Analysis completes and presents:
   - Risk Score: **94.5 / 100 (CRITICAL)**
   - Primary Candidate VASP: **Demo Exchange Alpha (91.4% Confidence, 3 Hops)**
   - Corroborating graph evidence bullets.

### Step 4: Interactive Graph Canvas
1. Click **Interactive Graph View**.
2. The full-screen React Flow canvas renders:
   - **Suspect Target Wallet** (Red glowing node)
   - Intermediary Wallets (Hop 1 & Hop 2)
   - Privacy Mixer node (**DemoMixer Cash** in purple)
   - Cross-Chain Bridge node (**DemoBridge Protocol** in amber)
   - Destination VASP Deposit Cluster & Hot Wallet (**Demo Exchange Alpha** in cyan)
3. Click on any node to view entity attributes, risk score, and monitored status in the right drawer.
4. Click on an edge between nodes to inspect the underlying transaction hash, transferred amount, gas fee, and timestamp.
5. Use the filter pills (`VASPS`, `MIXERS`, `BRIDGES`, `HIGH_RISK`) to dynamically prune the graph.

### Step 5: Explainable Attribution Scoring
1. Click **Attribution Breakdown** from the navigation sidebar.
2. Review the transparent 5-signal breakdown for **Demo Exchange Alpha (91.4%)**:
   - Address / Cluster Match: **28.5 / 30%**
   - Interaction Strength: **24.0 / 25%**
   - Hop Distance Proximity: **18.0 / 20%**
   - Volume Parity Similarity: **12.5 / 15%**
   - Temporal Pattern: **8.4 / 10%**
3. Review secondary candidates (e.g. **Demo Exchange Beta at 64.2%** via peel chain).

### Step 6: Risk & Typology Analysis
1. Navigate to **Risk & Typology**.
2. Review the 0-100 risk gauge and identified typologies:
   - **Layering:** Sequential multi-hop transfers designed to obscure fund origin.
   - **Rapid Movement:** Complete traversal executed within 60 minutes.
   - **Mixer Interaction:** Direct deposit to privacy mixer contract.
   - **Bridge Interaction:** Cross-chain transfer to bridge gateway.
   - **Peel Chain:** Residual amount diverted while primary trunk was routed to exchange.

### Step 7: Forensic Report Generation & Cryptographic Verification
1. Navigate to **Reports**.
2. Click **Generate Report Dossier**.
3. ReportLab builds a comprehensive 16-section PDF document.
4. Click **Download PDF** to inspect the rendered legal dossier complete with headers, footers, tables, and SHA-256 hash.
5. Click **Export Evidence ZIP** to download the courtroom package with signed `manifest.json`.
6. Navigate to **Evidence Vault** and click **Verify Integrity** on any artifact to demonstrate real-time bit-level SHA-256 validation.

### Step 8: SAHYOG Law Enforcement Notice Transmission
1. Navigate to **SAHYOG Integration**.
2. Under **Information Disclosure Notice (Sec 91 CrPC)**:
   - Form is auto-populated with Target VASP (Demo Exchange Alpha) and Case ID.
   - Select requisite records: KYC Dossier, IP Login Logs, Bank Accounts.
   - Click **Transmit Requisition via SAHYOG Adapter**.
3. A formal receipt is generated with reference number `SAHYOG-2026-DISC-...` and 48-hour compliance SLA.
4. Switch to **Emergency Asset Restraint Notice** to simulate a Section 102 CrPC asset freeze direction for 31.8 ETH.

### Step 9: Chain-of-Custody Audit Verification
1. Navigate to **Audit Logs**.
2. Show that every single action executed during the demo—login, wallet analysis, report generation, evidence verification, and SAHYOG requisition—has been immutably recorded with officer name, IP address, and timestamp.
