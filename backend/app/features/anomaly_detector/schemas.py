# backend/app/features/anomaly_detector/schemas.py

from datetime import datetime
from typing import Dict, Any, List
from pydantic import BaseModel, Field


class AnomalyExplanation(BaseModel):
    """
    Detailed explanation showing which features contributed most to the anomaly.
    """
    feature_name: str
    contribution_percentage: float
    actual_value: float


class AnomalyAnalysisResponse(BaseModel):
    """
    Response schema returning anomaly assessments from the ensemble models.
    """
    username: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    anomaly_score: float = Field(..., description="Unified anomaly score from 0 to 100")
    is_anomaly: bool = Field(..., description="Boolean flag if score exceeds threshold")
    
    # Broken-down model metrics
    isolation_forest_score: float = Field(..., description="Normalized score [0-100] from Isolation Forest")
    autoencoder_score: float = Field(..., description="Normalized score [0-100] from Autoencoder PyTorch model")
    
    feature_contributions: List[AnomalyExplanation] = Field(default_factory=list)