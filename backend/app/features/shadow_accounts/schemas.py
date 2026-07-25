# backend/app/features/shadow_accounts/schemas.py

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class UserAccountState(BaseModel):
    """
    Tracks the historical login activity and status of a user credential.
    """
    username: str
    last_active_at: datetime
    status: str = Field(default="ACTIVE", description="Options: 'ACTIVE', 'DORMANT'")
    is_admin: bool = Field(default=False)


class ShadowAccountAlert(BaseModel):
    """
    Alert triggered when a dormant user credential is activated.
    """
    is_compromise_suspected: bool = Field(..., description="True if a dormant account is activated")
    username: str
    days_dormant: int = Field(..., description="Total days the account remained completely inactive")
    alert_severity: int = Field(default=1, ge=1, le=5)
    last_active_before_activation: datetime
    activation_timestamp: datetime
    remediation_guideline: str