from datetime import datetime, timedelta
from typing import List
from app.features.log_ingestor.schemas import RawLogIngest
from app.features.threat_simulator.schemas import SimulationScenarioRequest, SimulationReport


class SyntheticThreatGenerator:
    """
    Generates synthetic log streams simulating various insider threat profiles.
    """

    @staticmethod
    def run_simulation(request: SimulationScenarioRequest) -> SimulationReport:
        scenario = request.scenario_type.upper()
        user = request.target_username
        device = request.source_device
        
        if scenario == "EXFILTRATION":
            raw_logs = SyntheticThreatGenerator._generate_exfiltration_logs(user, device)
        elif scenario == "PRIVILEGE_ESCALATION":
            raw_logs = SyntheticThreatGenerator._generate_privilege_escalation_logs(user, device)
        elif scenario == "CREDENTIAL_STUFFING":
            raw_logs = SyntheticThreatGenerator._generate_credential_stuffing_logs(user, device)
        else:
            raise ValueError(f"Unknown scenario type: {scenario}. Available types: 'EXFILTRATION', 'PRIVILEGE_ESCALATION', 'CREDENTIAL_STUFFING'")

        return SimulationReport(
            scenario=scenario,
            target_username=user,
            total_logs_generated=len(raw_logs),
            generated_raw_logs=raw_logs
        )

    @staticmethod
    def _generate_exfiltration_logs(user: str, device: str) -> List[RawLogIngest]:
        """
        Simulates a user harvesting data and uploading a large file volume.
        """
        base_time = datetime.utcnow() - timedelta(minutes=30)
        logs = []

        # Step 1: Successful login to a secure data repository
        logs.append(RawLogIngest(
            source_type="windows",
            raw_payload={
                "EventID": 4624,
                "TimeCreated": (base_time + timedelta(minutes=1)).isoformat() + "Z",
                "TargetUserName": user,
                "IpAddress": "192.168.10.150",
                "Computer": device,
                "Location": "Office-HQ"
            }
        ))

        # Step 2: File reading actions
        logs.append(RawLogIngest(
            source_type="windows",
            raw_payload={
                "EventID": 4688,
                "TimeCreated": (base_time + timedelta(minutes=5)).isoformat() + "Z",
                "TargetUserName": user,
                "NewProcessName": "explorer.exe",
                "Computer": device,
                "Service": "payroll_db_backup.zip"
            }
        ))

        # Step 3: Massive VPN out-transfer event
        logs.append(RawLogIngest(
            source_type="vpn",
            raw_payload={
                "timestamp": (base_time + timedelta(minutes=15)).isoformat() + "Z",
                "username": user,
                "source_ip": "192.168.10.150",
                "action": "connect",
                "bytes_sent": 8589934592,  # 8 GB data payload
                "bytes_received": 1048576,
                "geo_location": "External Cloud Node",
                "is_admin": False
            }
        ))

        return logs

    @staticmethod
    def _generate_privilege_escalation_logs(user: str, device: str) -> List[RawLogIngest]:
        """
        Simulates late-night execution of administrative tools.
        """
        # Late-night timestamp (3:00 AM)
        base_time = datetime.utcnow().replace(hour=3, minute=0, second=0, microsecond=0)
        logs = []

        # Step 1: Login
        logs.append(RawLogIngest(
            source_type="windows",
            raw_payload={
                "EventID": 4624,
                "TimeCreated": (base_time + timedelta(minutes=2)).isoformat() + "Z",
                "TargetUserName": user,
                "IpAddress": "192.168.10.151",
                "Computer": device,
                "Location": "Remote-VPN"
            }
        ))

        # Step 2: Execute administrative PowerShell scripting
        logs.append(RawLogIngest(
            source_type="windows",
            raw_payload={
                "EventID": 4688,
                "TimeCreated": (base_time + timedelta(minutes=5)).isoformat() + "Z",
                "TargetUserName": user,
                "NewProcessName": "powershell.exe",
                "ParentProcessName": "cmd.exe",
                "Computer": device,
                "Service": "vssadmin.exe delete shadows /all"
            }
        ))

        # Step 3: Execute user database modification
        logs.append(RawLogIngest(
            source_type="windows",
            raw_payload={
                "EventID": 4688,
                "TimeCreated": (base_time + timedelta(minutes=8)).isoformat() + "Z",
                "TargetUserName": user,
                "NewProcessName": "net.exe",
                "ParentProcessName": "powershell.exe",
                "Computer": device,
                "Service": "net user /add back_door_admin AdminPassword123"
            }
        ))

        return logs

    @staticmethod
    def _generate_credential_stuffing_logs(user: str, device: str) -> List[RawLogIngest]:
        """
        Simulates multiple failed logins followed by a single successful login.
        """
        base_time = datetime.utcnow() - timedelta(minutes=15)
        logs = []

        # Steps 1-4: Failed logins (Event 4625)
        for i in range(4):
            logs.append(RawLogIngest(
                source_type="windows",
                raw_payload={
                    "EventID": 4625,
                    "TimeCreated": (base_time + timedelta(minutes=i)).isoformat() + "Z",
                    "TargetUserName": user,
                    "IpAddress": "203.0.113.120",
                    "Computer": device,
                    "Location": "Untrusted Public IP"
                }
            ))

        # Step 5: Successful login (Event 4624)
        logs.append(RawLogIngest(
            source_type="windows",
            raw_payload={
                "EventID": 4624,
                "TimeCreated": (base_time + timedelta(minutes=6)).isoformat() + "Z",
                "TargetUserName": user,
                "IpAddress": "203.0.113.120",
                "Computer": device,
                "Location": "Untrusted Public IP"
            }
        ))

        return logs