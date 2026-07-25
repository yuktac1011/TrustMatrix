# backend/app/features/anomaly_detector/router.py

from typing import List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.features.baseline_engine.schemas import UserActivityFeatures
from app.features.anomaly_detector.schemas import AnomalyAnalysisResponse
from app.features.anomaly_detector.detector import EnsembleAnomalyDetector

router = APIRouter(prefix="/anomaly", tags=["AI Anomaly Detector"])


class AnomalyPayload(BaseModel):
    """
    Input schema containing current activity details and a list of historical benchmarks.
    """
    current_features: UserActivityFeatures
    historical_features: List[UserActivityFeatures] = Field(default_factory=list)


@router.post("/analyze", response_model=AnomalyAnalysisResponse)
async def analyze_activity(payload: AnomalyPayload):
    """
    Evaluates current user activity against historical metrics using an ML ensemble.
    """
    try:
        detector = EnsembleAnomalyDetector()
        analysis = detector.analyze_event(
            current=payload.current_features,
            history=payload.historical_features
        )
        return analysis
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Anomaly evaluation execution failure: {str(e)}"
        )