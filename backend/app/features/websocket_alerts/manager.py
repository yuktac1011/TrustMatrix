import json
from typing import List
from fastapi import WebSocket


class WebSocketConnectionManager:
    """
    Manages active WebSocket connections to broadcast security alerts in real time.
    """
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        """
        Accepts a connection and registers it in the active tracking pool.
        """
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        """
        Removes a connection from the tracking pool when a client disconnects.
        """
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        """
        Asynchronously broadcasts a JSON payload to all active connections.
        """
        disconnected_sockets = []
        for connection in self.active_connections:
            try:
                # Send text-based JSON message
                await connection.send_text(json.dumps(message))
            except Exception:
                # Record disconnected sockets to clean up resources
                disconnected_sockets.append(connection)
                
        # Clean up any dead connections
        for connection in disconnected_sockets:
            self.disconnect(connection)


# Global singleton instance to access across other platform features
alert_manager = WebSocketConnectionManager()