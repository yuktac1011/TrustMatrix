import math
from typing import List, Dict
from app.features.peer_analysis.schemas import PeerGroupMember, PeerDeviationResult


class PeerGroupAnalyzer:
    """
    Evaluates individual activities against peer group cohorts to isolate contextual anomalies.
    """

    @staticmethod
    def calculate_peer_deviations(
        target_username: str, 
        cohort: List[PeerGroupMember]
    ) -> PeerDeviationResult:
        """
        Calculates how far a user's behavior deviates from their department peer average.
        """
        if not cohort:
            return PeerDeviationResult(
                username=target_username,
                department="Unknown",
                deviation_score=0.0,
                is_peer_anomaly=False,
                peer_group_average=0.0,
                user_value=0.0
            )

        # 1. Isolate target user and identify their department
        target_member = next((m for m in cohort if m.username == target_username), None)
        if not target_member:
            raise ValueError(f"Target user '{target_username}' not found in the provided cohort database.")

        dept = target_member.department
        dept_members = [m for m in cohort if m.department == dept]
        
        # 2. Calculate average baseline metrics for the department
        values = [m.individual_activity_score for m in dept_members]
        count = len(values)
        
        avg_value = sum(values) / count if count > 0 else 0.0
        
        # Calculate standard deviation
        variance = sum((x - avg_value) ** 2 for x in values) / count if count > 0 else 0.0
        std_dev = math.sqrt(variance) if variance > 0 else 1.0

        user_val = target_member.individual_activity_score
        
        # 3. Determine deviation score (Z-Score metric scaled to 0-100)
        z_score = (user_val - avg_value) / std_dev if std_dev > 0 else 0.0
        
        # Map Z-Score to anomaly percentage (Z-Score >= 2.5 represents deviation threshold)
        is_anomaly = z_score >= 2.5
        deviation_percentage = min(100.0, max(0.0, (z_score / 3.5) * 100.0))

        return PeerDeviationResult(
            username=target_username,
            department=dept,
            deviation_score=round(deviation_percentage, 2),
            is_peer_anomaly=is_anomaly,
            peer_group_average=round(avg_value, 2),
            user_value=round(user_val, 2)
        )