from datetime import datetime
from typing import List, Dict, Any
from pydantic import BaseModel, Field
from app.features.anomaly_detector.schemas import AnomalyAnalysisResponse


class ThreatAlert(BaseModel):
    """
    Individual anomaly alert representing a correlated component of an incident.
    """
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    anomaly_score: float
    primary_contributor: str
    event_summary: str


class SecurityIncident(BaseModel):
    """
    A correlated group of anomalous events representing a single unified security incident.
    """
    incident_id: str = Field(..., description="Unique ID for the correlation context")
    username: str = Field(..., description="Target user associated with the threat trajectory")
    global_risk_score: float = Field(..., description="Unified risk score [0-100] based on combined indicators")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    alerts: List[ThreatAlert] = Field(default_factory=list, description="Sequence of associated events")
    is_mitigated: bool = Field(default=False)


class EntityRiskOverview(BaseModel):
    """
    Summary view of the threat risk state for a given user or asset.
    """
    username: str
    current_risk_score: float
    active_incidents_count: int
    risk_level: str = Field(..., description="Categorization: Low, Medium, High, or Critical")