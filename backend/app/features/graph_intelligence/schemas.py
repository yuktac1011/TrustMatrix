from datetime import datetime
from typing import List, Dict, Any
from pydantic import BaseModel, Field


class GraphNode(BaseModel):
    id: str = Field(..., description="Unique identifier for the entity node (e.g. username or IP)")
    type: str = Field(..., description="Category: 'USER', 'DEVICE', or 'RESOURCE'")


class GraphEdge(BaseModel):
    source: str
    target: str
    relation_type: str = Field(..., description="Action connecting them: e.g. RDP, SSH, AUTH, ACCESS")
    timestamp: datetime


class LateralMovementAlert(BaseModel):
    is_threat_detected: bool = Field(..., description="True if a suspicious multi-hop path is found")
    risk_score: float = Field(..., description="Calculated hazard score [0-100]")
    path_taken: List[str] = Field(..., description="The sequence of hops representing the pivot path")
    trigger_reason: str = Field(..., description="Descriptive indicator of the threat pattern")