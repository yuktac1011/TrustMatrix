# backend/app/features/log_ingestor/router.py

from typing import List
from fastapi import APIRouter, HTTPException, BackgroundTasks, status
from app.features.log_ingestor.schemas import RawLogIngest, NormalizedEvent
from app.features.log_ingestor.normalizer import NormalizationEngine

router = APIRouter(prefix="/ingest", tags=["Log Ingestion"])


async def process_batch_logs(batch: List[RawLogIngest]):
    """
    Background worker simulating publication to streaming pipelines (Kafka, PubSub, or ClickHouse).
    """
    for item in batch:
        try:
            normalized: NormalizedEvent = NormalizationEngine.normalize(item)
            # In production, we yield this normalized event to ClickHouse or an AMQP queue.
            # print(f"Successfully processed event for user: {normalized.user} - type: {normalized.event_type}")
        except Exception as err:
            # Prevent logging processing errors from stopping pipeline operations
            # print(f"Error normalising log entry: {str(err)}")
            pass


@router.post("/", status_code=status.HTTP_202_ACCEPTED)
async def ingest_logs(payload: List[RawLogIngest], background_tasks: BackgroundTasks):
    """
    High-performance endpoint accepting batch telemetry formats.
    """
    if not payload:
        raise HTTPException(status_code=400, detail="Log ingest batch payload empty")
    
    # Offload processing tasks from client HTTP connection context
    background_tasks.add_task(process_batch_logs, payload)
    
    return {"status": "accepted", "records_received": len(payload)}