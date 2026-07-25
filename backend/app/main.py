
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.features.log_ingestor.router import router as ingest_router
from app.features.baseline_engine.router import router as baseline_router
from app.features.anomaly_detector.router import router as anomaly_router
from app.features.soc_copilot.router import router as copilot_router
from app.features.risk_engine.router import router as risk_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Scalable User and Entity Behavior Analytics Platform using Machine Learning & AI.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(ingest_router, prefix=settings.API_V1_STR)
app.include_router(baseline_router, prefix=settings.API_V1_STR)
app.include_router(anomaly_router, prefix=settings.API_V1_STR)
app.include_router(copilot_router, prefix=settings.API_V1_STR)
app.include_router(risk_router, prefix=settings.API_V1_STR)


@app.get("/health", tags=["System Health"])
async def health_check():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "features_loaded": [
            "log_ingestion", 
            "universal_normalization", 
            "behavioral_baselining",
            "ai_anomaly_detection",
            "ai_soc_copilot",
            "threat_correlation_risk_engine"
        ]
    }