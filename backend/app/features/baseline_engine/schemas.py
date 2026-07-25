# backend/app/features/baseline_engine/schemas.py

from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class UserActivityFeatures(BaseModel):
    """
    Representation of parsed statistical variables from user log history.
    """
    username: str
    login_hour: int
    login_weekday: int
    failed_login_count: int
    total_logins: int
    failed_login_ratio: float = 0.0
    bytes_transferred: int = 0
    admin_commands_count: int = 0
    unique_devices_used: int = 1
    unique_locations_visited: int = 1


class UserBehaviorProfile(BaseModel):
    """
    The baseline profile containing standard historical boundaries of a user/entity.
    """
    username: str
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    
    # Baseline statistical ranges
    typical_working_hours: List[int] = Field(default_factory=list, description="Hours of day user normally operates")
    allowed_locations: List[str] = Field(default_factory=list, description="Common geographic regions")
    allowed_devices: List[str] = Field(default_factory=list, description="Identified standard assets")
    avg_daily_bytes: float = Field(0.0, description="Moving average of daily data transfers")
    max_daily_bytes_threshold: float = Field(0.0, description="Calculated standard deviation threshold limit")
    frequent_applications: List[str] = Field(default_factory=list, description="Commonly run tools/services")
    
    # Statistical baseline update variables
    profile_score_version: int = 1