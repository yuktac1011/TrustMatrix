from datetime import datetime
from fastapi import APIRouter, HTTPException
from typing import Optional
from pydantic import BaseModel, Field
from app.features.log_ingestor.schemas import NormalizedEvent
from app.features.shadow_accounts.schemas import UserAccountState, ShadowAccountAlert
from app.features.shadow_accounts.detector import ShadowAccountDetector

router = APIRouter(prefix="/shadow-detector", tags=["AD Shadow Account Detection"])


class SeedAccountPayload(BaseModel):
    username: str
    last_active_at: datetime
    is_admin: bool = Field(default=False)


@router.post("/seed", status_code=201)
async def seed_historical_state(payload: SeedAccountPayload):
    """
    Seeds historical login baselines for testing dormant state tracking.
    """
    try:
        ShadowAccountDetector.seed_account_state(
            username=payload.username,
            last_active=payload.last_active_at,
            is_admin=payload.is_admin
        )
        return {"status": "seeded", "username": payload.username}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/evaluate", response_model=Optional[ShadowAccountAlert])
async def evaluate_login_activity(event: NormalizedEvent):
    """
    Evaluates a fresh login event to check for shadow account activation.
    """
    try:
        alert = ShadowAccountDetector.evaluate_activity(event)
        return alert
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Shadow evaluation failed: {str(e)}")


@router.get("/state/{username}", response_model=UserAccountState)
async def get_user_status(username: str):
    """
    Retrieves the tracked login status (ACTIVE/DORMANT) of an account.
    """
    state = ShadowAccountDetector.get_account_state(username)
    if not state:
        raise HTTPException(status_code=404, detail=f"No tracked records found for user '{username}'")
    return state