
from fastapi import APIRouter, HTTPException
from app.features.threat_simulator.schemas import SimulationScenarioRequest, SimulationReport
from app.features.threat_simulator.generator import SyntheticThreatGenerator

router = APIRouter(prefix="/simulator", tags=["Threat Simulator Engine"])


@router.post("/inject", response_model=SimulationReport)
async def inject_threat_scenario(payload: SimulationScenarioRequest):
    """
    Injects synthetic telemetry streams for specified threat scenarios.
    """
    try:
        report = SyntheticThreatGenerator.run_simulation(payload)
        return report
    except Exception as e:
        raise HTTPException(
            status_code=400, 
            detail=f"Simulation injector execution failed: {str(e)}"
        )