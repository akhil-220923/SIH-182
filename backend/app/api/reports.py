import os
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone

from backend.app.database import get_db
from backend.app.auth.dependencies import get_current_user
from backend.app.models.user import User
from backend.app.models.report import Report
from backend.app.models.case import Case
from backend.app.models.attribution import Attribution
from backend.app.models.risk import RiskAssessment
from backend.app.models.typology import TypologyDetection
from backend.app.models.transaction import Transaction
from backend.app.schemas.report import ReportCreate, ReportResponse
from backend.app.reports.generator import ReportGenerator
from backend.app.services.evidence import EvidenceService
from backend.app.audit.service import log_audit
from backend.app.config import settings

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("", response_model=List[ReportResponse])
def list_reports(
    case_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Report)
    if case_id:
        query = query.filter(Report.case_id == case_id)
    return query.order_by(Report.created_at.desc()).all()

@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def generate_report(
    req: ReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    case = db.query(Case).filter(Case.case_id == req.case_id).first()
    clean_addr = req.wallet_address.strip().lower()

    # Query all intelligence artifacts
    attributions = db.query(Attribution).filter(Attribution.wallet_address == clean_addr).order_by(Attribution.confidence.desc()).all()
    risk = db.query(RiskAssessment).filter(RiskAssessment.wallet_address == clean_addr).first()
    typologies = db.query(TypologyDetection).filter(TypologyDetection.wallet_address == clean_addr).all()
    txs = db.query(Transaction).all()

    report_id = f"RPT-{req.case_id}-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}"
    os.makedirs(settings.REPORT_DIR, exist_ok=True)
    pdf_filename = f"{report_id}.pdf"
    pdf_path = os.path.join(settings.REPORT_DIR, pdf_filename)

    # Format inputs for generator
    case_dict = {
        "title": case.title if case else (req.title or "TraceVASP Attribution Case"),
        "status": case.status.value if case else "UNDER_ANALYSIS",
        "priority": case.priority.value if case else "HIGH",
        "notes": req.notes or (case.notes if case else "Formal evidence package for regulatory and legal disclosure.")
    }

    attr_list = [
        {
            "vasp_name": a.vasp_name,
            "confidence": a.confidence,
            "hop_distance": a.hop_distance,
            "interaction_count": a.interaction_count,
            "total_volume": a.total_volume,
            "evidence": a.evidence_list
        }
        for a in attributions
    ]

    risk_dict = {
        "risk_score": risk.risk_score if risk else 50.0,
        "risk_level": risk.risk_level if risk else "MEDIUM",
        "signals": risk.signals if risk else ["Standard analytical risk check completed."]
    }

    typo_list = [
        {
            "pattern_type": t.pattern_type,
            "confidence": t.confidence,
            "explanation": t.explanation
        }
        for t in typologies
    ]

    tx_list = [
        {
            "transaction_hash": t.transaction_hash,
            "from_address": t.from_address,
            "to_address": t.to_address,
            "amount": t.amount,
            "token_symbol": t.token_symbol,
            "transaction_type": t.transaction_type
        }
        for t in txs
    ]

    # Generate PDF
    gen_result = ReportGenerator.generate_investigation_report(
        case_id=req.case_id,
        wallet_address=req.wallet_address,
        case_data=case_dict,
        attributions=attr_list,
        risk_data=risk_dict,
        typologies=typo_list,
        transactions=tx_list,
        investigator_name=current_user.full_name,
        agency=current_user.agency,
        output_path=pdf_path
    )

    report = Report(
        report_id=report_id,
        case_id=req.case_id,
        wallet_address=clean_addr,
        title=req.title or f"Attribution Analysis — {req.case_id}",
        summary=f"Automated intelligence report generated for wallet {clean_addr} with {len(attr_list)} VASP candidates.",
        file_path=pdf_path,
        sha256_hash=gen_result["sha256_hash"],
        metadata_json={
            "top_candidate": attr_list[0]["vasp_name"] if attr_list else "Unknown",
            "top_confidence": attr_list[0]["confidence"] if attr_list else 0.0,
            "risk_score": risk_dict["risk_score"]
        },
        generated_by=current_user.username
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    log_audit(
        db=db,
        action="REPORT_GENERATED",
        username=current_user.username,
        user_id=current_user.id,
        case_id=req.case_id,
        details={"report_id": report_id, "sha256_hash": gen_result["sha256_hash"]}
    )

    return report

@router.get("/{report_id}", response_model=ReportResponse)
def get_report(
    report_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rep = db.query(Report).filter(Report.report_id == report_id).first()
    if not rep:
        raise HTTPException(status_code=404, detail="Report not found")
    return rep

@router.get("/{report_id}/download")
def download_report_pdf(
    report_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rep = db.query(Report).filter(Report.report_id == report_id).first()
    if not rep or not rep.file_path or not os.path.exists(rep.file_path):
        raise HTTPException(status_code=404, detail="PDF report file not found on disk")
    return FileResponse(
        path=rep.file_path,
        media_type="application/pdf",
        filename=f"{rep.report_id}.pdf"
    )

@router.get("/{report_id}/package")
def download_digital_evidence_package(
    report_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rep = db.query(Report).filter(Report.report_id == report_id).first()
    if not rep:
        raise HTTPException(status_code=404, detail="Report not found")

    zip_io = EvidenceService.generate_digital_evidence_package(
        db=db,
        case_id=rep.case_id,
        wallet_address=rep.wallet_address
    )

    log_audit(
        db=db,
        action="EVIDENCE_EXPORTED",
        username=current_user.username,
        user_id=current_user.id,
        case_id=rep.case_id,
        details={"report_id": report_id, "package_type": "ZIP_WITH_MANIFEST"}
    )

    return StreamingResponse(
        zip_io,
        media_type="application/zip",
        headers={"Content-Disposition": f"attachment; filename=TraceVASP_Evidence_{rep.case_id}.zip"}
    )
