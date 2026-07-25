# backend/app/features/soar_remediation/router.py

from typing import List
from fastapi import APIRouter, HTTPException
from app.features.soar_remediation.schemas import (
    BlockIPRequest,
    ForceMFARequest,
    IsolateHostRequest,
    LockUserRequest,
    PlaybookLog,
    PlaybookLogList,
    QuarantineFileRequest,
    RemediationResult,
    RevokeTokensRequest,
)
from app.features.soar_remediation.playbook_engine import soar_engine, get_audit_log

router = APIRouter(prefix="/remediation", tags=["SOAR Remediation Playbooks"])


# ── 1. Isolate Host ────────────────────────────────────────────────────────────

@router.post(
    "/isolate-host",
    response_model=RemediationResult,
    summary="Isolate a compromised host from the network",
    description=(
        "Executes the Host Isolation playbook — simulates network quarantine of a compromised "
        "workstation or server. In production this calls CrowdStrike Falcon EDR and Cisco ISE NAC APIs."
    )
)
async def isolate_host(request: IsolateHostRequest) -> RemediationResult:
    try:
        return soar_engine.isolate_host(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Host isolation playbook failed: {str(e)}")


# ── 2. Lock User Account ───────────────────────────────────────────────────────

@router.post(
    "/lock-user",
    response_model=RemediationResult,
    summary="Lock a user account across all identity providers",
    description=(
        "Executes the Account Lockout playbook — disables the user account in Active Directory / Okta, "
        "revokes all active session tokens, and enforces an optional timed lock duration."
    )
)
async def lock_user(request: LockUserRequest) -> RemediationResult:
    try:
        return soar_engine.lock_user(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"User lock playbook failed: {str(e)}")


# ── 3. Revoke OAuth Tokens ─────────────────────────────────────────────────────

@router.post(
    "/revoke-tokens",
    response_model=RemediationResult,
    summary="Revoke all active OAuth tokens and browser sessions for a user",
    description=(
        "Forces a full session invalidation. Calls OAuth revocation endpoint, "
        "Microsoft 365 AzureAD session revocation, and Google Workspace Admin SDK."
    )
)
async def revoke_tokens(request: RevokeTokensRequest) -> RemediationResult:
    try:
        return soar_engine.revoke_tokens(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Token revocation playbook failed: {str(e)}")


# ── 4. Force Step-Up MFA ───────────────────────────────────────────────────────

@router.post(
    "/force-mfa",
    response_model=RemediationResult,
    summary="Enforce step-up MFA challenge for a suspicious user",
    description=(
        "Updates the user's MFA policy to require a step-up challenge on next login. "
        "Integrates with Okta, Duo Security, and Azure AD Conditional Access policies."
    )
)
async def force_mfa(request: ForceMFARequest) -> RemediationResult:
    try:
        return soar_engine.force_mfa(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Force MFA playbook failed: {str(e)}")


# ── 5. Block IP Address ────────────────────────────────────────────────────────

@router.post(
    "/block-ip",
    response_model=RemediationResult,
    summary="Block a suspicious IP address at the network perimeter",
    description=(
        "Pushes a DENY rule to the perimeter firewall, AWS Security Groups, and Cloudflare WAF. "
        "Terminates all existing connections from the blocked IP."
    )
)
async def block_ip(request: BlockIPRequest) -> RemediationResult:
    try:
        return soar_engine.block_ip(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"IP block playbook failed: {str(e)}")


# ── 6. Quarantine File ─────────────────────────────────────────────────────────

@router.post(
    "/quarantine-file",
    response_model=RemediationResult,
    summary="Quarantine a suspicious file on an endpoint",
    description=(
        "Connects to the endpoint via EDR Real-Time Response (RTR), computes the file hash for "
        "evidence preservation, moves the file to quarantine, and revokes all permissions."
    )
)
async def quarantine_file(request: QuarantineFileRequest) -> RemediationResult:
    try:
        return soar_engine.quarantine_file(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File quarantine playbook failed: {str(e)}")


# ── Audit Log ──────────────────────────────────────────────────────────────────

@router.get(
    "/audit-log",
    response_model=PlaybookLogList,
    summary="View all executed remediation playbook actions",
    description="Returns the complete audit trail of all SOAR remediation actions executed in this session."
)
async def view_audit_log() -> PlaybookLogList:
    logs = get_audit_log()
    return PlaybookLogList(total=len(logs), logs=logs)
