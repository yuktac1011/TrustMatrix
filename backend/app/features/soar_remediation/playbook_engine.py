# backend/app/features/soar_remediation/playbook_engine.py

import uuid
from datetime import datetime
from typing import Dict, List

from app.features.soar_remediation.schemas import (
    ActionStatus,
    BlockIPRequest,
    ForceMFARequest,
    IsolateHostRequest,
    LockUserRequest,
    PlaybookLog,
    QuarantineFileRequest,
    RemediationAction,
    RemediationResult,
    RevokeTokensRequest,
)


# ---------------------------------------------------------------------------
# In-memory Audit Log (Replace with PostgreSQL in production)
# ---------------------------------------------------------------------------

_audit_log: Dict[str, PlaybookLog] = {}


def _log_action(result: RemediationResult) -> None:
    """Persists a remediation result to the in-memory audit log."""
    _audit_log[result.audit_log_id] = PlaybookLog(
        audit_log_id=result.audit_log_id,
        action=result.action.value,
        target=result.target,
        analyst=result.analyst,
        incident_id=result.triggered_by_incident,
        executed_at=result.executed_at,
        status=result.status.value,
        notes=result.notes,
    )


def get_audit_log() -> List[PlaybookLog]:
    """Returns all audit log entries sorted by newest first."""
    return sorted(_audit_log.values(), key=lambda r: r.executed_at, reverse=True)


# ---------------------------------------------------------------------------
# Playbook Engine
# ---------------------------------------------------------------------------

class SOARPlaybookEngine:
    """
    Security Orchestration, Automation and Response (SOAR) Playbook Engine.

    Implements mock remediation playbooks for the 6 most critical SOC actions.
    In production, each playbook step would call real integrations:
      - Active Directory API (lock user, force MFA)
      - EDR platform API (isolate host)
      - Firewall / NAC API (block IP)
      - IAM / OAuth server API (revoke tokens)
      - Antivirus / Endpoint API (quarantine file)
    """

    # Track isolated hosts and locked users to detect duplicate actions
    _isolated_hosts: Dict[str, datetime] = {}
    _locked_users: Dict[str, datetime] = {}
    _blocked_ips: Dict[str, datetime] = {}
    _mfa_enforced: Dict[str, datetime] = {}

    # ── 1. Isolate Host ───────────────────────────────────────────────────────

    @classmethod
    def isolate_host(cls, req: IsolateHostRequest) -> RemediationResult:
        """
        Simulates network isolation of a compromised workstation or server.

        Production integrations:
          - CrowdStrike Falcon → Network Containment API
          - Microsoft Defender for Endpoint → Isolation Action
          - Cisco ISE → Dynamic VLAN quarantine
        """
        already_isolated = req.hostname in cls._isolated_hosts
        status = ActionStatus.ALREADY_APPLIED if already_isolated else ActionStatus.EXECUTED

        if not already_isolated:
            cls._isolated_hosts[req.hostname] = datetime.utcnow()

        playbook_steps = [
            f"[SOAR-1] Received isolation request for host '{req.hostname}' — Reason: {req.reason}",
            f"[SOAR-2] Querying asset inventory for '{req.hostname}' → Found: Active Workstation",
            f"[SOAR-3] Pushing network containment policy to EDR agent on '{req.hostname}'",
            f"[SOAR-4] Host '{req.hostname}' VLAN changed to QUARANTINE-VLAN-999",
            f"[SOAR-5] All active TCP/UDP sessions on '{req.hostname}' forcefully terminated",
            f"[SOAR-6] Alert pushed to SOC dashboard and SIEM (incident: {req.triggered_by_incident or 'N/A'})",
            f"[SOAR-7] Audit log entry created — Analyst: {req.analyst}",
        ]

        if already_isolated:
            playbook_steps = [f"[SOAR-SKIP] Host '{req.hostname}' is already isolated. No duplicate action taken."]

        result = RemediationResult(
            action=RemediationAction.ISOLATE_HOST,
            status=status,
            target=req.hostname,
            triggered_by_incident=req.triggered_by_incident,
            analyst=req.analyst or "SOC_SYSTEM",
            playbook_steps=playbook_steps,
            audit_log_id=str(uuid.uuid4()),
            notes=(
                f"Host '{req.hostname}' {'is already in quarantine' if already_isolated else 'successfully isolated from the network'}. "
                f"Reason: {req.reason}."
            ),
            integration_targets=["CrowdStrike Falcon EDR", "Cisco ISE NAC", "SIEM (Splunk / Sentinel)"],
        )
        _log_action(result)
        return result

    # ── 2. Lock User Account ──────────────────────────────────────────────────

    @classmethod
    def lock_user(cls, req: LockUserRequest) -> RemediationResult:
        """
        Simulates locking a user account in Active Directory / IAM.

        Production integrations:
          - Microsoft Active Directory → Disable-ADAccount
          - Okta IAM → Suspend User API
          - Azure AD → Revoke Sign-in Sessions
        """
        already_locked = req.username in cls._locked_users
        status = ActionStatus.ALREADY_APPLIED if already_locked else ActionStatus.EXECUTED

        if not already_locked:
            cls._locked_users[req.username] = datetime.utcnow()

        duration_note = (
            f"Lock duration: {req.lock_duration_hours}h."
            if req.lock_duration_hours else "Lock duration: Indefinite (manual unlock required)."
        )

        playbook_steps = [
            f"[SOAR-1] Received lock request for account '{req.username}' — Reason: {req.reason}",
            f"[SOAR-2] Looking up account in Active Directory / Okta IAM...",
            f"[SOAR-3] Setting account status to DISABLED on all directory services",
            f"[SOAR-4] Revoking all active session tokens for '{req.username}'",
            f"[SOAR-5] Pushing SSO invalidation to all federated identity providers",
            f"[SOAR-6] {duration_note}",
            f"[SOAR-7] Sending automated notification email to IT Security team",
            f"[SOAR-8] Audit log entry created — Analyst: {req.analyst}",
        ]

        if already_locked:
            playbook_steps = [f"[SOAR-SKIP] Account '{req.username}' is already locked. No duplicate action taken."]

        result = RemediationResult(
            action=RemediationAction.LOCK_USER,
            status=status,
            target=req.username,
            triggered_by_incident=req.triggered_by_incident,
            analyst=req.analyst or "SOC_SYSTEM",
            playbook_steps=playbook_steps,
            audit_log_id=str(uuid.uuid4()),
            notes=(
                f"Account '{req.username}' {'is already locked' if already_locked else 'has been locked across all identity providers'}. "
                f"{duration_note} Reason: {req.reason}."
            ),
            integration_targets=["Microsoft Active Directory", "Okta IAM", "Azure AD", "SIEM"],
        )
        _log_action(result)
        return result

    # ── 3. Revoke OAuth / Session Tokens ─────────────────────────────────────

    @classmethod
    def revoke_tokens(cls, req: RevokeTokensRequest) -> RemediationResult:
        """
        Simulates revoking all active OAuth tokens and browser sessions for a user.

        Production integrations:
          - OAuth 2.0 Authorization Server → Revoke Token endpoint
          - Google Workspace → Admin SDK Sessions API
          - Microsoft 365 → Revoke-AzureADUserAllRefreshToken
        """
        playbook_steps = [
            f"[SOAR-1] Received token revocation request for '{req.username}' — Reason: {req.reason}",
            f"[SOAR-2] Enumerating all active OAuth refresh tokens for '{req.username}'",
            f"[SOAR-3] Calling OAuth server revocation endpoint for {3} discovered tokens",
            f"[SOAR-4] Invalidating all browser session cookies across federated services",
            f"[SOAR-5] Triggering Microsoft 365 session revocation (Revoke-AzureADUserAllRefreshToken)",
            f"[SOAR-6] User '{req.username}' will be prompted to re-authenticate on next access",
            f"[SOAR-7] Audit log entry created — Analyst: {req.analyst}",
        ]

        result = RemediationResult(
            action=RemediationAction.REVOKE_TOKENS,
            status=ActionStatus.EXECUTED,
            target=req.username,
            triggered_by_incident=req.triggered_by_incident,
            analyst=req.analyst or "SOC_SYSTEM",
            playbook_steps=playbook_steps,
            audit_log_id=str(uuid.uuid4()),
            notes=f"All OAuth tokens and session cookies for '{req.username}' have been revoked. Reason: {req.reason}.",
            integration_targets=["OAuth 2.0 Auth Server", "Microsoft 365", "Google Workspace", "SIEM"],
        )
        _log_action(result)
        return result

    # ── 4. Force Step-Up MFA ──────────────────────────────────────────────────

    @classmethod
    def force_mfa(cls, req: ForceMFARequest) -> RemediationResult:
        """
        Simulates enforcing a step-up MFA challenge for a suspicious user.

        Production integrations:
          - Okta → Policy Update API
          - Duo Security → Force MFA on Next Login
          - Azure AD Conditional Access → Step-up policy
        """
        already_enforced = req.username in cls._mfa_enforced
        status = ActionStatus.ALREADY_APPLIED if already_enforced else ActionStatus.EXECUTED

        if not already_enforced:
            cls._mfa_enforced[req.username] = datetime.utcnow()

        playbook_steps = [
            f"[SOAR-1] Received MFA enforcement request for '{req.username}' (Method: {req.mfa_level})",
            f"[SOAR-2] Updating Okta / Azure AD Conditional Access policy for '{req.username}'",
            f"[SOAR-3] Setting MFA requirement to ALWAYS (overrides 'remember device' flags)",
            f"[SOAR-4] MFA method configured: {req.mfa_level}",
            f"[SOAR-5] User will be challenged with {req.mfa_level} on next sign-in attempt",
            f"[SOAR-6] Policy will remain active until manually removed by an admin",
            f"[SOAR-7] Audit log entry created — Analyst: {req.analyst}",
        ]

        result = RemediationResult(
            action=RemediationAction.FORCE_MFA,
            status=status,
            target=req.username,
            triggered_by_incident=req.triggered_by_incident,
            analyst=req.analyst or "SOC_SYSTEM",
            playbook_steps=playbook_steps,
            audit_log_id=str(uuid.uuid4()),
            notes=(
                f"Step-up MFA ({req.mfa_level}) {'already enforced' if already_enforced else 'enforced'} "
                f"for '{req.username}'. Reason: {req.reason}."
            ),
            integration_targets=["Okta IAM", "Duo Security", "Azure AD Conditional Access"],
        )
        _log_action(result)
        return result

    # ── 5. Block IP Address ───────────────────────────────────────────────────

    @classmethod
    def block_ip(cls, req: BlockIPRequest) -> RemediationResult:
        """
        Simulates blocking an IP address at the network perimeter.

        Production integrations:
          - Palo Alto NGFW → Security Policy Block Rule
          - AWS Security Groups → Revoke ingress/egress
          - Cloudflare WAF → IP Block Rule
        """
        already_blocked = req.ip_address in cls._blocked_ips
        status = ActionStatus.ALREADY_APPLIED if already_blocked else ActionStatus.EXECUTED

        if not already_blocked:
            cls._blocked_ips[req.ip_address] = datetime.utcnow()

        playbook_steps = [
            f"[SOAR-1] Received IP block request for '{req.ip_address}' — Reason: {req.reason}",
            f"[SOAR-2] IP reputation lookup: checking against threat intelligence feeds",
            f"[SOAR-3] Pushing DENY rule to perimeter firewall for {req.ip_address}",
            f"[SOAR-4] Updating AWS Security Groups to revoke traffic from {req.ip_address}",
            f"[SOAR-5] Adding {req.ip_address} to Cloudflare WAF block list",
            f"[SOAR-6] Existing connections from {req.ip_address} forcefully terminated (RST packet sent)",
            f"[SOAR-7] Audit log entry created — Analyst: {req.analyst}",
        ]

        result = RemediationResult(
            action=RemediationAction.BLOCK_IP,
            status=status,
            target=req.ip_address,
            triggered_by_incident=req.triggered_by_incident,
            analyst=req.analyst or "SOC_SYSTEM",
            playbook_steps=playbook_steps,
            audit_log_id=str(uuid.uuid4()),
            notes=f"IP '{req.ip_address}' {'already blocked' if already_blocked else 'blocked at network perimeter'}. Reason: {req.reason}.",
            integration_targets=["Palo Alto NGFW", "AWS Security Groups", "Cloudflare WAF", "SIEM"],
        )
        _log_action(result)
        return result

    # ── 6. Quarantine File ────────────────────────────────────────────────────

    @classmethod
    def quarantine_file(cls, req: QuarantineFileRequest) -> RemediationResult:
        """
        Simulates moving a suspicious file into an isolated quarantine location.

        Production integrations:
          - CrowdStrike Falcon → RTR (Real-Time Response) delete/quarantine
          - Microsoft Defender for Endpoint → Initiate Investigation
          - Symantec DLP → File Quarantine Policy
        """
        playbook_steps = [
            f"[SOAR-1] Received quarantine request for '{req.file_path}' on '{req.hostname}'",
            f"[SOAR-2] Connecting to EDR agent on '{req.hostname}' via Real-Time Response (RTR)",
            f"[SOAR-3] Computing SHA-256 hash of '{req.file_path}' for evidence preservation",
            f"[SOAR-4] Moving file to isolated quarantine directory: /var/quarantine/trustmatrix/",
            f"[SOAR-5] Revoking all read/write/execute permissions on original path",
            f"[SOAR-6] Uploading file hash to threat intelligence platform for enrichment",
            f"[SOAR-7] Evidence package created for forensic analysis",
            f"[SOAR-8] Audit log entry created — Analyst: {req.analyst}",
        ]

        result = RemediationResult(
            action=RemediationAction.QUARANTINE_FILE,
            status=ActionStatus.EXECUTED,
            target=f"{req.hostname}:{req.file_path}",
            triggered_by_incident=req.triggered_by_incident,
            analyst=req.analyst or "SOC_SYSTEM",
            playbook_steps=playbook_steps,
            audit_log_id=str(uuid.uuid4()),
            notes=(
                f"File '{req.file_path}' on '{req.hostname}' quarantined and permissions revoked. "
                f"SHA-256 hash preserved for forensic evidence. Reason: {req.reason}."
            ),
            integration_targets=["CrowdStrike Falcon RTR", "Microsoft Defender", "Symantec DLP", "SIEM"],
        )
        _log_action(result)
        return result


# Module-level singleton
soar_engine = SOARPlaybookEngine()
