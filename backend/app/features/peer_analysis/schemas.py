from typing import List, Dict
from pydantic import BaseModel, Field


class PeerGroupMember(BaseModel):
    username: str
    department: str
    individual_activity_score: float = Field(..., description="Calculated aggregate activity scale")


class PeerDeviationResult(BaseModel):
    username: str
    department: str
    deviation_score: float = Field(..., description="Percentage representing deviation from peer average [0-100]")
    is_peer_anomaly: bool = Field(..., description="True if user significantly outperforms group threshold")
    peer_group_average: float
    user_value: float