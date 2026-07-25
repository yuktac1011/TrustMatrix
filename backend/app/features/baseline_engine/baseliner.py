# backend/app/features/baseline_engine/baseliner.py

import math
from datetime import datetime
from typing import List, Dict, Optional
from app.features.log_ingestor.schemas import NormalizedEvent
from app.features.baseline_engine.schemas import UserBehaviorProfile


class BehavioralBaselineEngine:
    """
    Constructs and adapts baseline behavior profiles for users over time.
    """
    
    # Mock database to hold profiles in-memory (to be replaced with database integrations later)
    _profile_db: Dict[str, UserBehaviorProfile] = {}

    @classmethod
    def get_or_create_profile(cls, username: str) -> UserBehaviorProfile:
        if username not in cls._profile_db:
            cls._profile_db[username] = UserBehaviorProfile(
                username=username,
                typical_working_hours=[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], # default standard working hours
                allowed_locations=[],
                allowed_devices=[],
                avg_daily_bytes=100000.0, # default 100KB start
                max_daily_bytes_threshold=500000000.0, # 500MB max default threshold limit
                frequent_applications=[]
            )
        return cls._profile_db[username]

    @classmethod
    def update_profile(cls, username: str, historical_events: List[NormalizedEvent]) -> UserBehaviorProfile:
        """
        Recalculates profile settings using historical telemetry.
        """
        profile = cls.get_or_create_profile(username)
        user_events = [e for e in historical_events if e.user == username]
        
        if not user_events:
            return profile
            
        # Update working hour patterns
        hours = [e.timestamp.hour for e in user_events]
        if hours:
            # Simple unique count tracking
            hour_counts = {}
            for h in hours:
                hour_counts[h] = hour_counts.get(h, 0) + 1
            # Keep hours that account for more than 5% of interactions
            threshold = max(1, len(hours) * 0.05)
            profile.typical_working_hours = [h for h, count in hour_counts.items() if count >= threshold]
            
        # Update geographic origins and endpoints used
        locations = set(e.location for e in user_events if e.location)
        if locations:
            profile.allowed_locations = list(locations)
            
        devices = set(e.device for e in user_events if e.device)
        if devices:
            profile.allowed_devices = list(devices)
            
        # Calculate download volumes using a moving average
        daily_volumes = {}
        for e in user_events:
            date_key = e.timestamp.date().isoformat()
            daily_volumes[date_key] = daily_volumes.get(date_key, 0) + (e.bytes_transferred or 0)
            
        volumes_list = list(daily_volumes.values())
        if volumes_list:
            avg_volume = sum(volumes_list) / len(volumes_list)
            profile.avg_daily_bytes = avg_volume
            
            # Simple standard deviation estimate for anomaly detection
            variance = sum((x - avg_volume) ** 2 for x in volumes_list) / len(volumes_list)
            std_dev = math.sqrt(variance) if variance > 0 else 500000.0
            
            # Threshold set to average + 3 standard deviations
            profile.max_daily_bytes_threshold = avg_volume + (3 * std_dev)

        # Update process names run
        apps = set(e.process_name for e in user_events if e.process_name)
        if apps:
            profile.frequent_applications = list(apps)
            
        profile.last_updated = datetime.utcnow()
        profile.profile_score_version += 1
        
        # Save change back to memory store
        cls._profile_db[username] = profile
        return profile