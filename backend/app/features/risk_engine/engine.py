# backend/app/features/risk_engine/engine.py

import uuid
from datetime import datetime, timedelta
from typing import List, Dict
from app.features.anomaly_detector.schemas import AnomalyAnalysisResponse
from app.features.risk_engine.schemas import SecurityIncident, ThreatAlert, EntityRiskOverview


class RiskCorrelationEngine:
    """
    Correlates individual events into unified multi-stage incidents and calculates user risk.
    """
    # In-memory incident and profile stores (to be linked to databases in later phases)
    _incidents: Dict[str, SecurityIncident] = {}
    _user_risk_cache: Dict[str, float] = {}

    @classmethod
    def process_anomaly_alert(cls, username: str, anomaly: AnomalyAnalysisResponse, event_summary: str) -> SecurityIncident:
        """
        Correlates a incoming anomaly into an existing or new incident, and updates the risk score.
        """
        now = datetime.utcnow()
        time_window = timedelta(hours=24)
        
        # Determine the primary contributor from the anomaly details
        primary_contributor = "Unknown indicator"
        if anomaly.feature_contributions:
            primary_contributor = anomaly.feature_contributions[0].feature_name
            
        new_alert = ThreatAlert(
            timestamp=anomaly.timestamp,
            anomaly_score=anomaly.anomaly_score,
            primary_contributor=primary_contributor,
            event_summary=event_summary
        )

        # 1. Search for an open, active incident for this user within the time window
        matched_incident: SecurityIncident = None
        for inc in cls._incidents.values():
            if (inc.username == username and 
                not inc.is_mitigated and 
                (now - inc.last_updated) <= time_window):
                matched_incident = inc
                break

        # 2. Correlate to existing incident or create a new one
        if matched_incident:
            matched_incident.alerts.append(new_alert)
            matched_incident.last_updated = now
            # Recalculate global risk score
            matched_incident.global_risk_score = cls._calculate_aggregate_risk(matched_incident.alerts)
            cls._incidents[matched_incident.incident_id] = matched_incident
            return matched_incident
        else:
            new_id = str(uuid.uuid4())
            new_incident = SecurityIncident(
                incident_id=new_id,
                username=username,
                global_risk_score=anomaly.anomaly_score,
                created_at=now,
                last_updated=now,
                alerts=[new_alert]
            )
            cls._incidents[new_id] = new_incident
            return new_incident

    @classmethod
    def _calculate_aggregate_risk(cls, alerts: List[ThreatAlert]) -> float:
        """
        Calculates an aggregate risk score using exponential compounding to reflect 
        the added risk of multiple distinct events.
        """
        if not alerts:
            return 0.0
            
        scores = [a.anomaly_score for a in alerts]
        max_score = max(scores)
        
        # Compound risk multiplier for additional alerts
        additional_alerts_count = len(scores) - 1
        compounding_factor = min(30.0, additional_alerts_count * 8.5)
        
        # Cap the final compounded risk score at 100
        return float(min(100.0, max_score + compounding_factor))

    @classmethod
    def get_entity_risk(cls, username: str) -> EntityRiskOverview:
        """
        Calculates the user's aggregate risk status based on active incidents.
        """
        active_incidents = [
            inc for inc in cls._incidents.values() 
            if inc.username == username and not inc.is_mitigated
        ]
        
        if not active_incidents:
            return EntityRiskOverview(
                username=username,
                current_risk_score=0.0,
                active_incidents_count=0,
                risk_level="Low"
            )
            
        highest_score = max(inc.global_risk_score for inc in active_incidents)
        
        # Categorize risk levels
        if highest_score >= 85.0:
            level = "Critical"
        elif highest_score >= 70.0:
            level = "High"
        elif highest_score >= 40.0:
            level = "Medium"
        else:
            level = "Low"

        return EntityRiskOverview(
            username=username,
            current_risk_score=round(highest_score, 2),
            active_incidents_count=len(active_incidents),
            risk_level=level
        )

    @classmethod
    def list_all_incidents(cls) -> List[SecurityIncident]:
        return list(cls._incidents.values())