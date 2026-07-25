# backend/app/features/soar_remediation/schemas.py

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum


class ActionStatus(str, Enum):
    EXECUTED = "EXECUTED"
    PENDING = "PENDING"
    FAILED = "FAILED"
    ALREADY_APPLIED = "ALREADY_APPLIED"


class RemediationAction(str, Enum):
    ISOLATE_HOST = "isolate_host"
    LOCK_USER = "lock_user"
    REVOKE_TOKENS = "revoke_tokens"
    FORCE_MFA = "force_mfa"
    TERMINATE_SESSIONS = "terminate_sessions"
    BLOCK_IP = "block_ip"
    QUARANTINE_FILE = "quarantine_file"


# ── Request Schemas ───────────────────────────────────────────────────────────

class IsolateHostRequest(BaseModel):
    hostname: str = Field(..., description="Hostname or device ID to isolate from the network.")
    reason: str = Field(..., description="Analyst-provided reason for isolation.")
    triggered_by_incident: Optional[str] = Field(None, description="Incident ID that triggered this action.")
    analyst: Optional[str] = Field(default="SOC_SYSTEM", description="Analyst username performing the action.")


class LockUserRequest(BaseModel):
    username: str = Field(..., description="Username of the account to lock.")
    reason: str = Field(..., description="Reason for locking the account.")
    triggered_by_incident: Optional[str] = Field(None, description="Incident ID that triggered this action.")
    analyst: Optional[str] = Field(default="SOC_SYSTEM", description="Analyst username performing the action.")
    lock_duration_hours: Optional[int] = Field(
        default=None,
        description="Optional lock duration in hours. None = indefinite lock."
    )


class RevokeTokensRequest(BaseModel):
    username: str = Field(..., description="User whose OAuth/session tokens should be revoked.")
    reason: str = Field(..., description="Reason for revocation.")
    triggered_by_incident: Optional[str] = Field(None, description="Incident ID that triggered this action.")
    analyst: Optional[str] = Field(default="SOC_SYSTEM")


class ForceMFARequest(BaseModel):
    username: str = Field(..., description="User to force step-up MFA challenge on next login.")
    mfa_level: str = Field(default="TOTP", description="MFA method: TOTP, SMS, HARDWARE_KEY, etc.")
    reason: str = Field(..., description="Reason for enforcing step-up MFA.")
    triggered_by_incident: Optional[str] = Field(None)
    analyst: Optional[str] = Field(default="SOC_SYSTEM")


class BlockIPRequest(BaseModel):
    ip_address: str = Field(..., description="IP address to block at the network perimeter.")
    reason: str = Field(..., description="Reason for the block.")
    triggered_by_incident: Optional[str] = Field(None)
    analyst: Optional[str] = Field(default="SOC_SYSTEM")


class QuarantineFileRequest(BaseModel):
    file_path: str = Field(..., description="Full path to the file to quarantine.")
    hostname: str = Field(..., description="Hostname where the file resides.")
    reason: str = Field(..., description="Reason for quarantine.")
    triggered_by_incident: Optional[str] = Field(None)
    analyst: Optional[str] = Field(default="SOC_SYSTEM")


# ── Response Schema ───────────────────────────────────────────────────────────

class RemediationResult(BaseModel):
    """Standardized response for all SOAR remediation actions."""
    action: RemediationAction
    status: ActionStatus
    target: str = Field(..., description="The primary target of the action (host, user, IP, file).")
    triggered_by_incident: Optional[str]
    analyst: str
    executed_at: datetime = Field(default_factory=datetime.utcnow)
    playbook_steps: List[str] = Field(
        ...,
        description="Ordered list of steps executed (or that would be executed in production)."
    )
    audit_log_id: str = Field(..., description="Unique identifier for this remediation action in the audit log.")
    notes: str = Field(..., description="Human-readable summary of the action taken.")
    integration_targets: List[str] = Field(
        default=[],
        description="Downstream systems that would be called in production (e.g. Active Directory, EDR, SIEM)."
    )


class PlaybookLog(BaseModel):
    """Audit record stored in-memory for each executed remediation."""
    audit_log_id: str
    action: str
    target: str
    analyst: str
    incident_id: Optional[str]
    executed_at: datetime
    status: str
    notes: str


class PlaybookLogList(BaseModel):
    total: int
    logs: List[PlaybookLog]
