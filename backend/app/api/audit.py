from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from backend.app.database import get_db
from backend.app.auth.dependencies import get_current_user
from backend.app.models.user import User
from backend.app.models.audit import AuditLog

router = APIRouter(prefix="/audit-logs", tags=["Audit Logging"])

@router.get("")
def list_audit_logs(
    action: Optional[str] = None,
    case_id: Optional[str] = None,
    limit: int = Query(default=50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(AuditLog)
    if action:
        query = query.filter(AuditLog.action == action)
    if case_id:
        query = query.filter(AuditLog.case_id == case_id)

    logs = query.order_by(AuditLog.timestamp.desc()).limit(limit).all()
    return [
        {
            "id": l.id,
            "user_id": l.user_id,
            "username": l.username,
            "action": l.action,
            "case_id": l.case_id,
            "ip_address": l.ip_address,
            "user_agent": l.user_agent,
            "details": l.details,
            "timestamp": l.timestamp.isoformat() if l.timestamp else None
        }
        for l in logs
    ]
