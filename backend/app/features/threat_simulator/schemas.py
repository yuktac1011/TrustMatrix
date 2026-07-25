from typing import List, Dict, Any
from pydantic import BaseModel, Field
from app.features.log_ingestor.schemas import RawLogIngest


class SimulationScenarioRequest(BaseModel):
    """
    Input schema to request an attack simulation run.
    """
    scenario_type: str = Field(..., description="Options: 'EXFILTRATION', 'PRIVILEGE_ESCALATION', 'CREDENTIAL_STUFFING'")
    target_username: str = Field(default="malicious_user")
    source_device: str = Field(default="SIM-HOST-01")


class SimulationReport(BaseModel):
    """
    Output report returning the generated synthetic telemetry logs.
    """
    scenario: str
    target_username: str
    total_logs_generated: int
    generated_raw_logs: List[RawLogIngest] = Field(..., description="The sequence of generated raw logs")