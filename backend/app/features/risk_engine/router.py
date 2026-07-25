# backend/app/features/risk_engine/router.py

from typing import List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.features.risk_engine.schemas import SecurityIncident, EntityRiskOverview
from app.features.risk_engine.engine import RiskCorrelationEngine
from app.features.anomaly_detector.schemas import AnomalyAnalysisResponse

router = APIRouter(prefix="/risk", tags=["Risk Engine & Correlation"])


class CorrelationPayload(BaseModel):
    """
    Unified payload body containing the anomaly response and the event's raw summary context.
    """
    anomaly: AnomalyAnalysisResponse
    event_summary: str


@router.post("/correlate/{username}", response_model=SecurityIncident)
async def correlate_event(username: str, payload: CorrelationPayload):
    """
    Submits an anomaly alert to the correlation engine to evaluate or append to active incidents.
    """
    try:
        incident = RiskCorrelationEngine.process_anomaly_alert(
            username=username,
            anomaly=payload.anomaly,
            event_summary=payload.event_summary
        )
        return incident
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Incident correlation calculation failure: {str(e)}"
        )


@router.get("/entity/{username}", response_model=EntityRiskOverview)
async def get_user_risk_overview(username: str):
    """
    Retrieves the aggregate risk status and risk level categorization for a user.
    """
    return RiskCorrelationEngine.get_entity_risk(username)


@router.get("/incidents", response_model=List[SecurityIncident])
async def list_incidents():
    """
    Lists all correlated security incidents across the entire platform.
    """
    return RiskCorrelationEngine.list_all_incidents()