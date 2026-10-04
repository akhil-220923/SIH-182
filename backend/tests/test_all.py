import pytest
import os
from backend.app.blockchain import get_blockchain_adapter, detect_blockchain
from backend.app.auth.security import hash_password, verify_password, create_access_token, decode_access_token
from backend.app.database import SessionLocal
from backend.app.graph.engine import TransactionGraphEngine
from backend.app.attribution.engine import AttributionEngine
from backend.app.risk.engine import RiskEngine
from backend.app.typology.engine import TypologyEngine
from backend.app.services.evidence import EvidenceService
from backend.app.reports.generator import ReportGenerator

def test_password_hashing_and_jwt():
    pwd = "SecurePassword@123"
    hashed = hash_password(pwd)
    assert verify_password(pwd, hashed)
    assert not verify_password("WrongPassword", hashed)

    token = create_access_token({"sub": "42", "email": "test@tracevasp.demo", "role": "INVESTIGATOR"})
    payload = decode_access_token(token)
    assert payload is not None
    assert payload["sub"] == "42"
    assert payload["email"] == "test@tracevasp.demo"

def test_blockchain_adapters_validation():
    eth = get_blockchain_adapter("ethereum")
    assert eth.validate_address("0x742d35cc6634c0532925a3b844bc454e4438f44e")
    assert not eth.validate_address("0xinvalidaddress")

    btc = get_blockchain_adapter("bitcoin")
    assert btc.validate_address("bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq")
    assert btc.validate_address("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa")
    assert not btc.validate_address("0x742d35cc6634c0532925a3b844bc454e4438f44e")

    tron = get_blockchain_adapter("tron")
    assert tron.validate_address("TNDdHk7hPzN7g6i5Ff6eR9f7N8n3h6m8k2")
    assert not tron.validate_address("invalidtron")

    sol = get_blockchain_adapter("solana")
    assert sol.validate_address("7EYnhQoR9YM3N7UoaKRoA44Uy8JeaTue3qysPN27abm7")

    assert detect_blockchain("0x742d35cc6634c0532925a3b844bc454e4438f44e") == "ethereum"
    assert detect_blockchain("bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq") == "bitcoin"

def test_graph_and_attribution_engines():
    db = SessionLocal()
    target_wallet = "0x742d35cc6634c0532925a3b844bc454e4438f44e"
    try:
        # Test Graph Engine
        graph_engine = TransactionGraphEngine(db)
        res = graph_engine.build_graph(target_wallet=target_wallet, max_hops=4)
        assert len(res["nodes"]) >= 5
        assert len(res["edges"]) >= 5
        assert res["metrics"]["total_nodes"] >= 5

        # Test Attribution Engine
        attr_engine = AttributionEngine(db)
        candidates = attr_engine.calculate_attributions(wallet_address=target_wallet, max_hops=4)
        assert len(candidates) >= 1
        top = candidates[0]
        assert "confidence" in top
        assert top["confidence"] >= 60.0
        assert "score_breakdown" in top
        assert "address_cluster_match" in top["score_breakdown"]
        assert len(top["evidence"]) > 0

        # Test Risk Engine
        risk_engine = RiskEngine(db)
        risk = risk_engine.assess_risk(target_wallet)
        assert risk["risk_score"] > 50.0
        assert risk["risk_level"] in ["HIGH", "CRITICAL"]
        assert len(risk["signals"]) > 0

        # Test Typology Engine
        typology_engine = TypologyEngine(db)
        typos = typology_engine.detect_typologies(target_wallet)
        assert len(typos) >= 2
        pattern_names = [t["pattern_type"] for t in typos]
        assert "LAYERING" in pattern_names or "MIXER_INTERACTION" in pattern_names

    finally:
        db.close()

def test_evidence_and_report_generation():
    db = SessionLocal()
    target_wallet = "0x742d35cc6634c0532925a3b844bc454e4438f44e"
    case_id = "CASE-DEMO-182"
    try:
        # Create evidence item
        ev = EvidenceService.create_evidence_item(
            db=db,
            evidence_id="EVD-TEST-001",
            case_id=case_id,
            wallet_address=target_wallet,
            evidence_type="TRANSACTION_FLOW",
            description="Test evidence node flow",
            payload={"source": target_wallet, "amount": 45.5, "unit": "ETH"}
        )
        assert ev.sha256_hash is not None

        # Verify integrity
        verif = EvidenceService.verify_integrity(ev)
        assert verif["is_valid"] is True
        assert verif["status"] == "VALID_TAMPER_EVIDENT"

        # Test PDF Report Generation
        pdf_res = ReportGenerator.generate_investigation_report(
            case_id=case_id,
            wallet_address=target_wallet,
            case_data={"title": "Test Title", "status": "OPEN", "priority": "CRITICAL"},
            attributions=[{"vasp_name": "Demo Exchange Alpha", "confidence": 91.4, "hop_distance": 3, "interaction_count": 14, "total_volume": 31.8, "evidence": ["Path match"]}],
            risk_data={"risk_score": 94.5, "risk_level": "CRITICAL", "signals": ["Layering detected"]},
            typologies=[{"pattern_type": "LAYERING", "confidence": 93.0, "explanation": "Observed layering"}],
            transactions=[{"transaction_hash": "0x123", "from_address": "0xaaa", "to_address": "0xbbb", "amount": 10.0, "token_symbol": "ETH", "transaction_type": "TRANSFER"}]
        )
        assert os.path.exists(pdf_res["file_path"])
        assert pdf_res["size_bytes"] > 1000
        assert len(pdf_res["sha256_hash"]) == 64

        # Test Digital Evidence Package Zip
        zip_buf = EvidenceService.generate_digital_evidence_package(db, case_id, target_wallet)
        assert zip_buf.getbuffer().nbytes > 100

    finally:
        db.close()

def test_api_endpoints(client, auth_headers):
    # Health check
    h = client.get("/health")
    assert h.status_code == 200
    assert h.json()["status"] == "healthy"

    api_h = client.get("/api/health")
    assert api_h.status_code == 200
    assert api_h.json()["status"] == "ok"
    assert api_h.json()["service"] == "SIH-182 backend"

    # Dashboard
    dash = client.get("/api/dashboard", headers=auth_headers)
    assert dash.status_code == 200
    assert "metrics" in dash.json()
    assert dash.json()["metrics"]["active_cases"] >= 1

    # Cases
    cases = client.get("/api/cases", headers=auth_headers)
    assert cases.status_code == 200
    assert len(cases.json()) >= 1

    # Wallet Analysis
    analyze_resp = client.post("/api/wallets/analyze", json={
        "wallet_address": "0x742d35cc6634c0532925a3b844bc454e4438f44e",
        "blockchain": "ethereum",
        "max_hops": 3,
        "case_id": "CASE-DEMO-182"
    }, headers=auth_headers)
    assert analyze_resp.status_code == 200
    res_data = analyze_resp.json()
    assert res_data["wallet"]["address"] == "0x742d35cc6634c0532925a3b844bc454e4438f44e"
    assert len(res_data["attributions"]) >= 1
    assert res_data["attributions"][0]["candidate"] == "Demo Exchange Alpha"

    # SAHYOG Disclosure Request
    sahyog_resp = client.post("/api/sahyog/disclosure-request", json={
        "case_id": "CASE-DEMO-182",
        "vasp_id": "VASP-ALPHA",
        "vasp_name": "Demo Exchange Alpha",
        "wallet_address": "0x742d35cc6634c0532925a3b844bc454e4438f44e",
        "reason": "Section 91 CrPC Inquiry into crypto fraud",
        "requested_info": ["KYC Documents", "Deposit Transaction Timestamps"],
        "supporting_evidence": ["0xaa02020202020202020202020202020202020202020202020202020202020202"]
    }, headers=auth_headers)
    assert sahyog_resp.status_code == 201
    assert "reference_number" in sahyog_resp.json()

    # Audit Logs
    audit = client.get("/api/audit-logs", headers=auth_headers)
    assert audit.status_code == 200
    assert len(audit.json()) >= 1
