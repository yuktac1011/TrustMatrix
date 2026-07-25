# backend/app/features/baseline_engine/router.py

from typing import List
from fastapi import APIRouter, HTTPException, BackgroundTasks, status
from app.features.baseline_engine.schemas import UserBehaviorProfile
from app.features.baseline_engine.baseliner import BehavioralBaselineEngine
from app.features.log_ingestor.schemas import NormalizedEvent

router = APIRouter(prefix="/baseline", tags=["Behavioral Baseline"])


@router.get("/{username}", response_model=UserBehaviorProfile)
async def get_user_profile(username: str):
    """
    Returns the current behavioral profile baseline for an identity.
    """
    profile = BehavioralBaselineEngine.get_or_create_profile(username)
    return profile


@router.post("/{username}/recalculate", response_model=UserBehaviorProfile)
async def recalculate_user_baseline(username: str, events: List[NormalizedEvent]):
    """
    Manually triggers profile baseline recalculation using context logs.
    """
    if not events:
        raise HTTPException(status_code=400, detail="Cannot recalculate baseline with empty event payload")
    
    updated_profile = BehavioralBaselineEngine.update_profile(username, events)
    return updated_profile