from typing import List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.features.peer_analysis.schemas import PeerGroupMember, PeerDeviationResult
from app.features.peer_analysis.analyzer import PeerGroupAnalyzer

router = APIRouter(prefix="/peer", tags=["Peer Group Analysis"])


class PeerAnalysisPayload(BaseModel):
    """
    Unified payload schema for running peer cohort comparisons.
    """
    target_username: str
    cohort: List[PeerGroupMember]


@router.post("/evaluate", response_model=PeerDeviationResult)
async def evaluate_peer_deviation(payload: PeerAnalysisPayload):
    """
    Compares a user's activity metrics against their department cohorts.
    """
    try:
        result = PeerGroupAnalyzer.calculate_peer_deviations(
            target_username=payload.target_username,
            cohort=payload.cohort
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Peer analysis execution failure: {str(e)}"
        )