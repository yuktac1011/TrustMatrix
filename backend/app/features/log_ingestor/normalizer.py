# backend/app/features/log_ingestor/normalizer.py

import re
from datetime import datetime
from typing import Any, Dict, Optional
from app.features.log_ingestor.schemas import NormalizedEvent, RawLogIngest


class NormalizationEngine:
    """
    Validates, parses, and normalizes heterogenous incoming logging formats 
    into a standardized format for behavioral analytics.
    """

    @staticmethod
    def normalize(raw_log: RawLogIngest) -> NormalizedEvent:
        source = raw_log.source_type.lower()
        payload = raw_log.raw_payload
        
        if source == "windows":
            return NormalizationEngine._normalize_windows(payload)
        elif source == "linux":
            return NormalizationEngine._normalize_linux(payload)
        elif source == "vpn":
            return NormalizationEngine._normalize_vpn(payload)
        else:
            return NormalizationEngine._normalize_generic(payload, source)

    @staticmethod
    def _normalize_windows(payload: Dict[str, Any]) -> NormalizedEvent:
        """
        Parses Windows Security Event Logs (e.g., Event ID 4624, 4625, 4688)
        """
        event_id = payload.get("EventID") or payload.get("event_id")
        timestamp_str = payload.get("TimeCreated") or payload.get("timestamp")
        
        timestamp = NormalizationEngine._parse_timestamp(timestamp_str)
        user = payload.get("TargetUserName") or payload.get("user") or "unknown_user"
        ip = payload.get("IpAddress") or payload.get("ip_address")
        device = payload.get("Computer") or payload.get("hostname") or "unknown_windows_device"
        
        # Standardizing Events based on IDs
        event_type = "WINDOWS_EVENT"
        severity = 1
        is_admin_action = False
        bytes_transferred = 0
        
        if event_id == 4624:
            event_type = "LOGIN_SUCCESS"
            severity = 1
        elif event_id == 4625:
            event_type = "LOGIN_FAILURE"
            severity = 2
        elif event_id == 4688:
            event_type = "PROCESS_CREATION"
            is_admin_action = any(admin_kw in str(payload.get("NewProcessName")).lower() 
                                  for admin_kw in ["cmd.exe", "powershell.exe", "sc.exe", "vssadmin"])
            severity = 2 if is_admin_action else 1
            
        entity = payload.get("NewProcessName") or payload.get("Service") or "system"
        
        return NormalizedEvent(
            timestamp=timestamp,
            user=user,
            entity=entity,
            location=payload.get("Location") or payload.get("location"),
            ip=ip,
            device=device,
            event_type=event_type,
            severity=severity,
            bytes_transferred=bytes_transferred,
            is_admin_action=is_admin_action,
            process_name=payload.get("NewProcessName"),
            parent_process_name=payload.get("ParentProcessName"),
            metadata=payload
        )

    @staticmethod
    def _normalize_linux(payload: Dict[str, Any]) -> NormalizedEvent:
        """
        Parses Linux Syslog (e.g., auth.log, secure daemon logs)
        """
        timestamp_str = payload.get("timestamp") or payload.get("time")
        timestamp = NormalizationEngine._parse_timestamp(timestamp_str)
        
        message = payload.get("message", "")
        user = "unknown_user"
        ip = None
        event_type = "LINUX_SYSLOG"
        severity = 1
        
        # Simple string heuristics for common SSH logs
        if "Accepted password" in message or "Accepted publickey" in message:
            event_type = "LOGIN_SUCCESS"
            # Extract user
            match_user = re.search(r"for\s+(\S+)", message)
            if match_user:
                user = match_user.group(1)
            # Extract IP
            match_ip = re.search(r"from\s+(\S+)", message)
            if match_ip:
                ip = match_ip.group(1)
        elif "Failed password" in message or "Connection refused" in message:
            event_type = "LOGIN_FAILURE"
            severity = 2
            match_user = re.search(r"invalid user\s+(\S+)|for\s+(\S+)", message)
            if match_user:
                user = match_user.group(1) or match_user.group(2)
            match_ip = re.search(r"from\s+(\S+)", message)
            if match_ip:
                ip = match_ip.group(1)

        device = payload.get("hostname") or payload.get("host") or "unknown_linux_device"
        entity = payload.get("program") or "sshd"
        
        return NormalizedEvent(
            timestamp=timestamp,
            user=user,
            entity=entity,
            location=payload.get("location"),
            ip=ip,
            device=device,
            event_type=event_type,
            severity=severity,
            bytes_transferred=0,
            is_admin_action="sudo" in message.lower() or "root" in message.lower(),
            process_name=payload.get("program"),
            metadata=payload
        )

    @staticmethod
    def _normalize_vpn(payload: Dict[str, Any]) -> NormalizedEvent:
        """
        Parses VPN connections logs
        """
        timestamp_str = payload.get("timestamp")
        timestamp = NormalizationEngine._parse_timestamp(timestamp_str)
        user = payload.get("username") or "unknown_vpn_user"
        ip = payload.get("source_ip")
        device = payload.get("gateway") or "vpn_gateway"
        action = payload.get("action", "").lower()
        
        event_type = "VPN_ACCESS"
        severity = 1
        if "connect" in action:
            event_type = "LOGIN_SUCCESS"
        elif "disconnect" in action:
            event_type = "LOGOUT"
        elif "fail" in action:
            event_type = "LOGIN_FAILURE"
            severity = 2
            
        return NormalizedEvent(
            timestamp=timestamp,
            user=user,
            entity="vpn_service",
            location=payload.get("geo_location") or payload.get("country"),
            ip=ip,
            device=device,
            event_type=event_type,
            severity=severity,
            bytes_transferred=payload.get("bytes_sent", 0) + payload.get("bytes_received", 0),
            is_admin_action=payload.get("is_admin", False),
            metadata=payload
        )

    @staticmethod
    def _normalize_generic(payload: Dict[str, Any], source_type: str) -> NormalizedEvent:
        """
        Fallback parser for unmapped sources
        """
        timestamp_str = payload.get("timestamp") or payload.get("time")
        timestamp = NormalizationEngine._parse_timestamp(timestamp_str)
        
        return NormalizedEvent(
            timestamp=timestamp,
            user=payload.get("user") or payload.get("username") or "unknown_entity",
            entity=payload.get("target") or payload.get("resource") or "unknown_resource",
            location=payload.get("location") or payload.get("country"),
            ip=payload.get("ip") or payload.get("ip_address"),
            device=payload.get("device") or payload.get("hostname") or "unknown_device",
            event_type=f"{source_type.upper()}_EVENT",
            severity=int(payload.get("severity", 1)),
            bytes_transferred=payload.get("bytes", 0),
            is_admin_action=payload.get("admin", False),
            metadata=payload
        )

    @staticmethod
    def _parse_timestamp(ts_val: Any) -> datetime:
        if not ts_val:
            return datetime.utcnow()
        if isinstance(ts_val, datetime):
            return ts_val
        try:
            # ISO timestamp parser
            return datetime.fromisoformat(str(ts_val).replace("Z", "+00:00"))
        except ValueError:
            try:
                # Unix Timestamp epoch fallback
                return datetime.utcfromtimestamp(float(ts_val))
            except (ValueError, TypeError):
                return datetime.utcnow()