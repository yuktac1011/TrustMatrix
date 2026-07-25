# backend/app/features/log_ingestor/schemas.py

from datetime import datetime
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field, IPvAnyAddress


class RawLogIngest(BaseModel):
    """
    Schema for raw ingested logs arriving from collectors (Fluent Bit, Logstash, etc.).
    """
    source_type: str = Field(..., description="Type of source log, e.g., 'windows', 'linux', 'vpn', 'ad'")
    raw_payload: Dict[str, Any] = Field(..., description="The unparsed raw log payload")
    received_at: datetime = Field(default_factory=datetime.utcnow)


class NormalizedEvent(BaseModel):
    """
    The Universal Schema every log is mapped into for the analytics engine.
    """
    timestamp: datetime = Field(..., description="Timestamp of the security event")
    user: str = Field(..., description="The user/actor associated with the event (normalized identifier)")
    entity: str = Field(..., description="Target entity/resource, e.g., service name, DB name, system file path")
    location: Optional[str] = Field(None, description="Country/City name extracted or resolved")
    ip: Optional[str] = Field(None, description="Associated IP address (IPv4 or IPv6)")
    device: str = Field(..., description="Source device hostname or identifier")
    event_type: str = Field(..., description="Standardized event action: e.g., LOGIN_SUCCESS, FILE_READ, PRIV_ELEV")
    severity: int = Field(default=1, ge=1, le=5, description="Normalized severity level from 1 (Low) to 5 (Critical)")
    
    # Contextual fields required for Downstream AI Feature Extraction
    bytes_transferred: Optional[int] = Field(0, description="Network bytes or file download payload in bytes")
    is_admin_action: bool = Field(False, description="Flag indicating privilege usage or administrative tool execution")
    process_name: Optional[str] = Field(None, description="Executed binary or process name")
    parent_process_name: Optional[str] = Field(None, description="Parent process context if applicable")
    
    # Dynamic dictionary for raw preservation and edge-case attributes
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Arbitrary Key-Value pairs for audit preservation")