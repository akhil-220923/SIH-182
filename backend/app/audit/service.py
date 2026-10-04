from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
from backend.app.models.audit import AuditLog

def log_audit(
    db: Session,
    action: str,
    username: str,
    user_id: Optional[int] = None,
    case_id: Optional[str] = None,
    details: Optional[Dict[str, Any]] = None,
    ip_address: str = "127.0.0.1",
    user_agent: Optional[str] = None
) -> AuditLog:
    log_entry = AuditLog(
        user_id=user_id,
        username=username,
        action=action,
        case_id=case_id,
        ip_address=ip_address,
        user_agent=user_agent,
        details=details or {}
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    return log_entry
