
from typing import List
from app.features.log_ingestor.schemas import NormalizedEvent
from app.features.baseline_engine.schemas import UserActivityFeatures


class FeatureExtractor:
    """
    Transforms sequence data or collections of events into structured behavioral vectors.
    """

    @staticmethod
    def extract_instant_features(event: NormalizedEvent, historical_events: List[NormalizedEvent]) -> UserActivityFeatures:
        """
        Derives real-time context by analyzing a fresh event against a sliding window of recent history.
        """
        user_events = [e for e in historical_events if e.user == event.user]
        total_events = len(user_events) + 1
        
        # Calculate login metrics
        logins = [e for e in user_events if e.event_type in ["LOGIN_SUCCESS", "LOGIN_FAILURE"]]
        if event.event_type in ["LOGIN_SUCCESS", "LOGIN_FAILURE"]:
            logins.append(event)
            
        total_logins = len(logins)
        failed_logins = len([l for l in logins if l.event_type == "LOGIN_FAILURE"])
        failed_ratio = (failed_logins / total_logins) if total_logins > 0 else 0.0
        
        # Aggregate data consumption
        total_bytes = sum(e.bytes_transferred or 0 for e in user_events) + (event.bytes_transferred or 0)
        
        # Calculate system/admin commands
        admin_actions = len([e for e in user_events if e.is_admin_action])
        if event.is_admin_action:
            admin_actions += 1
            
        # Uniqueness metrics
        unique_ips = set(e.ip for e in user_events if e.ip)
        if event.ip:
            unique_ips.add(event.ip)
            
        unique_locs = set(e.location for e in user_events if e.location)
        if event.location:
            unique_locs.add(event.location)

        return UserActivityFeatures(
            username=event.user,
            login_hour=event.timestamp.hour,
            login_weekday=event.timestamp.weekday(),
            failed_login_count=failed_logins,
            total_logins=total_logins,
            failed_login_ratio=failed_ratio,
            bytes_transferred=total_bytes,
            admin_commands_count=admin_actions,
            unique_devices_used=max(1, len(unique_ips)),
            unique_locations_visited=max(1, len(unique_locs))
        )