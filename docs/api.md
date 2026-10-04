# TraceVASP — REST API Reference

All protected endpoints require the HTTP header:
```http
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

---

## 1. Authentication

### `POST /api/auth/login`
Authenticates investigator and returns a signed JWT access token.
```json
// Request
{
  "email": "investigator@tracevasp.demo",
  "password": "Demo@12345"
}

// Response
{
  "access_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "investigator@tracevasp.demo",
    "username": "investigator_rajesh",
    "full_name": "Insp. Rajesh Kumar",
    "agency": "Cyber Crime Investigation Cell (CCIC)",
    "badge_number": "LEA-KA-5419",
    "role": "INVESTIGATOR",
    "is_active": true
  }
}
```

### `GET /api/auth/me`
Retrieves current authenticated officer profile.

---

## 2. Dashboard Analytics

### `GET /api/dashboard`
Returns active case counts, wallets analyzed, blockchain distribution, risk profile, and recent alerts.

---

## 3. Case Management

### `GET /api/cases`
Query parameters: `status_filter`, `priority_filter`.

### `POST /api/cases`
Registers a new official law enforcement case file.

### `GET /api/cases/{case_id}`
Retrieves case docket detail and suspect wallets list.

### `PUT /api/cases/{case_id}`
Updates case priority, status (`OPEN`, `UNDER_ANALYSIS`, `REVIEW`, `CLOSED`), or investigator notes.

### `POST /api/cases/{case_id}/wallets`
Appends a suspect wallet to the case docket.

---

## 4. Wallet Investigation & Attribution

### `POST /api/wallets/analyze`
Executes end-to-end multi-hop graph traversal, VASP candidate matching, and risk analysis.
```json
// Request
{
  "wallet_address": "0x742d35cc6634c0532925a3b844bc454e4438f44e",
  "blockchain": "ethereum",
  "max_hops": 3,
  "case_id": "CASE-DEMO-182",
  "data_source": "AUTO"
}
```

### `GET /api/wallets/{address}/graph`
Returns NetworkX nodes and edges formatted for React Flow visualization.

### `GET /api/wallets/{address}/attribution`
Returns ranked list of candidate VASPs with 5-signal explainable score breakdowns.

### `GET /api/wallets/{address}/risk`
Returns risk score (0-100), risk level (`CRITICAL`), and identified analytical indicators.

### `GET /api/wallets/{address}/typologies`
Detects patterns consistent with Layering, Rapid Movement, Fan-Out, Mixer Interaction, and Peel Chains.

---

## 5. Reports & Evidence

### `POST /api/reports`
Compiles an official 16-section forensic investigation PDF with ReportLab.

### `GET /api/reports/{report_id}/download`
Downloads binary PDF dossier.

### `GET /api/reports/{report_id}/package`
Downloads digital evidence package `.zip` containing all JSON models and `manifest.json`.

### `POST /api/evidence/verify`
Validates bit-level tamper integrity against stored SHA-256 digest.

---

## 6. SAHYOG Integration

### `POST /api/sahyog/disclosure-request`
Transmits formal Section 91 CrPC Information Disclosure notice to VASP compliance desk.

### `POST /api/sahyog/freeze-request`
Dispatches Section 102 CrPC / PMLA Section 17 Emergency Asset Restraint direction.

---

## 7. System & Health

### `GET /health`
Returns daemon health, database connection status, build version, and SAHYOG mode.
