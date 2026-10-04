import hashlib
import json
import os
import zipfile
from io import BytesIO
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from backend.app.models.evidence import Evidence
from backend.app.models.transaction import Transaction
from backend.app.models.attribution import Attribution
from backend.app.models.risk import RiskAssessment
from backend.app.models.case import Case

class EvidenceService:
    @staticmethod
    def calculate_sha256(data: bytes) -> str:
        return hashlib.sha256(data).hexdigest()

    @staticmethod
    def create_evidence_item(
        db: Session,
        evidence_id: str,
        case_id: str,
        wallet_address: str,
        evidence_type: str,
        description: str,
        payload: Dict[str, Any],
        created_by: str = "investigator@tracevasp.demo",
        tx_hash: Optional[str] = None
    ) -> Evidence:
        canonical_json = json.dumps(payload, sort_keys=True).encode('utf-8')
        digest = hashlib.sha256(canonical_json).hexdigest()

        existing = db.query(Evidence).filter(Evidence.evidence_id == evidence_id).first()
        if existing:
            return existing

        evidence = Evidence(
            evidence_id=evidence_id,
            case_id=case_id,
            wallet_address=wallet_address,
            transaction_hash=tx_hash,
            evidence_type=evidence_type,
            source="TraceVASP Intelligence Engine",
            description=description,
            data_payload=payload,
            sha256_hash=digest,
            created_by=created_by
        )
        db.add(evidence)
        db.commit()
        db.refresh(evidence)
        return evidence

    @staticmethod
    def verify_integrity(evidence_item: Evidence) -> Dict[str, Any]:
        """Verifies if the current payload matches the stored SHA-256 hash."""
        if not evidence_item.data_payload:
            return {"verified": False, "reason": "No data payload attached to evidence record"}
        canonical_json = json.dumps(evidence_item.data_payload, sort_keys=True).encode('utf-8')
        computed_hash = hashlib.sha256(canonical_json).hexdigest()
        is_valid = (computed_hash.lower() == evidence_item.sha256_hash.lower())
        return {
            "evidence_id": evidence_item.evidence_id,
            "stored_hash": evidence_item.sha256_hash,
            "computed_hash": computed_hash,
            "is_valid": is_valid,
            "status": "VALID_TAMPER_EVIDENT" if is_valid else "CORRUPTED_OR_TAMPERED"
        }

    @staticmethod
    def generate_digital_evidence_package(db: Session, case_id: str, wallet_address: str) -> BytesIO:
        """
        Creates a zip archive containing:
        - case.json
        - transactions.json
        - attribution.json
        - risk_analysis.json
        - graph.json
        - manifest.json (SHA-256 hashes of all artifacts)
        """
        case = db.query(Case).filter(Case.case_id == case_id).first()
        txs = db.query(Transaction).all()
        attributions = db.query(Attribution).filter(Attribution.wallet_address == wallet_address).all()
        risk = db.query(RiskAssessment).filter(RiskAssessment.wallet_address == wallet_address).first()

        artifacts: Dict[str, bytes] = {}

        # 1. case.json
        case_data = {
            "case_id": case.case_id if case else case_id,
            "title": case.title if case else "TraceVASP Investigation",
            "status": case.status.value if case else "OPEN",
            "priority": case.priority.value if case else "HIGH",
            "suspect_wallets": case.suspect_wallets if case else [wallet_address],
            "exported_at": datetime.now(timezone.utc).isoformat()
        }
        artifacts["case.json"] = json.dumps(case_data, indent=2).encode('utf-8')

        # 2. transactions.json
        tx_data = [
            {
                "hash": t.transaction_hash,
                "chain": t.chain,
                "from": t.from_address,
                "to": t.to_address,
                "amount": t.amount,
                "token": t.token_symbol,
                "timestamp": t.timestamp.isoformat() if t.timestamp else None,
                "type": t.transaction_type,
                "status": t.status,
                "source": t.source
            }
            for t in txs
        ]
        artifacts["transactions.json"] = json.dumps(tx_data, indent=2).encode('utf-8')

        # 3. attribution.json
        attr_data = [
            {
                "vasp_id": a.vasp_id,
                "vasp_name": a.vasp_name,
                "confidence": a.confidence,
                "hop_distance": a.hop_distance,
                "score_breakdown": a.score_breakdown,
                "evidence": a.evidence_list
            }
            for a in attributions
        ]
        artifacts["attribution.json"] = json.dumps(attr_data, indent=2).encode('utf-8')

        # 4. risk_analysis.json
        risk_data = {
            "wallet_address": wallet_address,
            "risk_score": risk.risk_score if risk else 0.0,
            "risk_level": risk.risk_level if risk else "UNKNOWN",
            "signals": risk.signals if risk else [],
            "details": risk.details if risk else {}
        }
        artifacts["risk_analysis.json"] = json.dumps(risk_data, indent=2).encode('utf-8')

        # 5. manifest.json
        manifest = {
            "package_title": f"TraceVASP Digital Evidence Package — {case_id}",
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "sha256_manifest": {
                name: hashlib.sha256(content).hexdigest()
                for name, content in artifacts.items()
            }
        }
        artifacts["manifest.json"] = json.dumps(manifest, indent=2).encode('utf-8')

        # Build in-memory zip
        zip_buffer = BytesIO()
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
            for fname, fbytes in artifacts.items():
                zf.writestr(fname, fbytes)

        zip_buffer.seek(0)
        return zip_buffer
