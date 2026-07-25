from datetime import datetime, timedelta
from typing import Dict, Optional
from app.features.log_ingestor.schemas import NormalizedEvent
from app.features.shadow_accounts.schemas import UserAccountState, ShadowAccountAlert


class ShadowAccountDetector:
    """
    Monitors account activity intervals to detect shadow or dormant account activations.
    """
    # In-memory database of last login states (to be backed by PostgreSQL or Redis in later phases)
    _states_db: Dict[str, UserAccountState] = {}
    
    # Configure threshold representing dormancy (standard is 90 days)
    DORMANCY_DAYS_LIMIT = 90

    @classmethod
    def seed_account_state(cls, username: str, last_active: datetime, is_admin: bool = False):
        """
        Seeds baseline states for accounts during platform setup.
        """
        now = datetime.utcnow()
        days_diff = (now - last_active).days
        status = "DORMANT" if days_diff >= cls.DORMANCY_DAYS_LIMIT else "ACTIVE"
        
        cls._states_db[username] = UserAccountState(
            username=username,
            last_active_at=last_active,
            status=status,
            is_admin=is_admin
        )

    @classmethod
    def evaluate_activity(cls, event: NormalizedEvent) -> Optional[ShadowAccountAlert]:
        """
        Evaluates a fresh login event against the user's historical state.
        """
        username = event.user
        event_time = event.timestamp
        
        # If no historical record exists, establish the initial state and return None
        if username not in cls._states_db:
            cls._states_db[username] = UserAccountState(
                username=username,
                last_active_at=event_time,
                status="ACTIVE",
                is_admin=event.is_admin_action
            )
            return None

        state = cls._states_db[username]
        
        # Calculate how long the account has been inactive
        inactive_delta = event_time - state.last_active_at
        days_inactive = inactive_delta.days

        # Trigger an alert if the account was dormant or exceeded the inactivity limit
        is_activation_event = False
        if state.status == "DORMANT" or days_inactive >= cls.DORMANCY_DAYS_LIMIT:
            is_activation_event = True

        # Update the account's state to reflect the new activity
        old_last_active = state.last_active_at
        state.last_active_at = event_time
        state.status = "ACTIVE"
        cls._states_db[username] = state

        if is_activation_event:
            # Escalated severity if the shadow account has administrative privileges
            severity = 5 if state.is_admin else 4
            remediation = (
                f"IMMEDIATE ACTION REQUIRED: Revoke sessions and lock shadow account '{username}'. "
                "Verify HR/IAM lifecycle logs to confirm if this account should be retired."
            )

            return ShadowAccountAlert(
                is_compromise_suspected=True,
                username=username,
                days_dormant=max(days_inactive, 0),
                alert_severity=severity,
                last_active_before_activation=old_last_active,
                activation_timestamp=event_time,
                remediation_guideline=remediation
            )

        return None

    @classmethod
    def get_account_state(cls, username: str) -> Optional[UserAccountState]:
        return cls._states_db.get(username)