from typing import List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.features.log_ingestor.schemas import NormalizedEvent
from app.features.graph_intelligence.schemas import LateralMovementAlert
from app.features.graph_intelligence.detector import GraphLateralMovementDetector

router = APIRouter(prefix="/graph", tags=["Graph Intelligence & Pivoting"])


class GraphAnalysisPayload(BaseModel):
    """
    Standard request payload containing event logs and target username to analyze.
    """
    target_username: str
    events: List[NormalizedEvent]


@router.post("/analyze", response_model=LateralMovementAlert)
async def analyze_graph_paths(payload: GraphAnalysisPayload):
    """
    Processes event logs to construct a relationship graph and scan for lateral pivot chains.
    """
    try:
        detector = GraphLateralMovementDetector()
        # Build the graph from the logs
        detector.build_graph_from_logs(payload.events)
        # Analyze lateral path risk
        alert = detector.analyze_lateral_paths(payload.target_username)
        return alert
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Graph path analytics failure: {str(e)}"
        )