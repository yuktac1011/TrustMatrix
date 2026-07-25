# backend/app/features/soc_copilot/router.py

from fastapi import APIRouter, HTTPException
from app.features.soc_copilot.schemas import (
    AlertExplanationRequest, 
    AlertExplanationResponse,
    IncidentInvestigationRequest,
    IncidentInvestigationReport,
    NaturalLanguageQueryRequest,
    NaturalLanguageQueryResponse
)
from app.features.soc_copilot.copilot_service import SOCCopilotService

router = APIRouter(prefix="/copilot", tags=["AI SOC Copilot"])


@router.post("/explain", response_model=AlertExplanationResponse)
async def explain_alert_endpoint(payload: AlertExplanationRequest):
    """
    Accepts alert characteristics and returns a descriptive analysis.
    """
    try:
        response = SOCCopilotService.explain_alert(payload)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- Feature 1 Endpoint: AI Incident Investigator ---
@router.post("/investigate", response_model=IncidentInvestigationReport)
async def investigate_incident_endpoint(payload: IncidentInvestigationRequest):
    """
    Performs an automated AI investigation on a correlated incident timeline.
    """
    try:
        report = SOCCopilotService.investigate_incident(payload.incident_id)
        return report
    except ValueError as val_err:
        raise HTTPException(status_code=404, detail=str(val_err))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Incident investigation failed: {str(e)}")


# --- Feature 2 Endpoint: Natural Language Query ---
@router.post("/query", response_model=NaturalLanguageQueryResponse)
async def query_system_state_endpoint(payload: NaturalLanguageQueryRequest):
    """
    Enables natural language queries to search active system statuses.
    """
    try:
        response = SOCCopilotService.query_system_state(payload.query)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")