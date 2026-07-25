from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from app.features.websocket_alerts.manager import alert_manager

router = APIRouter(prefix="/ws", tags=["Real-Time Alerts"])


class ManualAlertPayload(BaseModel):
    """
    Test payload for manually triggering alert broadcasts.
    """
    alert_type: str
    target_username: str
    severity: str
    description: str


@router.websocket("/alerts")
async def websocket_alerts_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time security consoles.
    """
    await alert_manager.connect(websocket)
    try:
        # Keep connection open and listen for client heartbeats/messages
        while True:
            data = await websocket.receive_text()
            # Respond to echo heartbeats from clients to keep the socket alive
            await websocket.send_text(f"ACK: {data}")
    except WebSocketDisconnect:
        alert_manager.disconnect(websocket)
    except Exception:
        alert_manager.disconnect(websocket)


@router.post("/broadcast-test")
async def manual_broadcast_alert(payload: ManualAlertPayload):
    """
    REST API endpoint to trigger a manual alert broadcast to all connected WebSocket clients.
    """
    alert_data = {
        "event": "CRITICAL_ALERT",
        "alert_type": payload.alert_type,
        "username": payload.target_username,
        "severity": payload.severity,
        "description": payload.description,
        "timestamp": payload.description
    }
    await alert_manager.broadcast(alert_data)
    return {"status": "broadcasted", "recipients": len(alert_manager.active_connections)}