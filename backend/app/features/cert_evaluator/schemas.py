# backend/app/features/cert_evaluator/schemas.py

from typing import List, Optional, Dict
from pydantic import BaseModel, Field


# ── Input Schemas ─────────────────────────────────────────────────────────────

class CERTLogEntry(BaseModel):
    """
    Represents a single row from a CERT R6.2-style dataset.
    Maps directly to the daily-summary feature format described in Kim et al. (2019).
    """
    user: str = Field(..., description="User identifier (e.g., 'CDE1846').")
    date: str = Field(..., description="ISO date string (YYYY-MM-DD).")
    role: Optional[str] = Field(None, description="User role or department (e.g., 'IT Admin', 'Salesman').")

    # Core behavioral features
    login_count: int = Field(default=0, description="Total login events on this day.")
    logoff_count: int = Field(default=0, description="Total logoff events on this day.")
    failed_login_count: int = Field(default=0, description="Failed login attempts.")
    after_hours_access: int = Field(default=0, description="Activity count outside 9am–6pm window.")
    file_access_count: int = Field(default=0, description="File read/write operations.")
    bytes_transferred: float = Field(default=0.0, description="Total bytes uploaded/downloaded (MB).")
    usb_events: int = Field(default=0, description="USB insertion/removal events.")
    email_sent_count: int = Field(default=0, description="Number of emails sent.")
    http_visits: int = Field(default=0, description="Number of distinct HTTP destination visits.")
    admin_commands: int = Field(default=0, description="Admin/privileged command executions.")
    new_device_flag: int = Field(default=0, description="1 if a new device was used today, else 0.")

    # Ground truth label
    is_malicious: bool = Field(default=False, description="True if this record is a known insider threat event.")


class BenchmarkRequest(BaseModel):
    """Request body to run a benchmark evaluation on a set of CERT-style log entries."""
    log_entries: List[CERTLogEntry] = Field(
        ...,
        description="List of CERT-style log entries (both normal and labeled anomalous).",
        min_length=10
    )
    top_percent_thresholds: List[float] = Field(
        default=[1.0, 5.0, 10.0, 15.0, 20.0, 25.0, 30.0],
        description="Percentile thresholds (%) at which to compute True Detection Rate."
    )
    contamination: float = Field(
        default=0.05,
        ge=0.01,
        le=0.5,
        description="Expected fraction of anomalies in the dataset for IsolationForest."
    )


# ── Output Schemas ────────────────────────────────────────────────────────────

class TDRAtThreshold(BaseModel):
    """True Detection Rate at a specific top-N% threshold."""
    threshold_percent: float = Field(..., description="Top-N% of highest-scored records inspected.")
    true_positives: int = Field(..., description="Malicious records found in top-N%.")
    total_malicious: int = Field(..., description="Total malicious records in the dataset.")
    true_detection_rate: float = Field(..., description="Fraction detected = true_positives / total_malicious.")


class ModelBenchmarkResult(BaseModel):
    """Benchmark results for one anomaly detection model."""
    model_name: str
    tdr_curve: List[TDRAtThreshold] = Field(..., description="TDR computed at each threshold.")
    auc_approximation: float = Field(..., description="Area Under TDR Curve (trapezoidal approximation).")


class BenchmarkReport(BaseModel):
    """Full benchmark evaluation report across all models."""
    total_records: int
    total_malicious: int
    malicious_rate_percent: float

    # Per-model results
    isolation_forest: ModelBenchmarkResult
    autoencoder_proxy: ModelBenchmarkResult
    ensemble: ModelBenchmarkResult

    # Overall summary
    best_model: str = Field(..., description="Model with the highest AUC approximation.")
    best_auc: float
    summary: str = Field(..., description="Plain-English summary of benchmark findings.")

    # Per-record scores for detailed inspection
    scored_records: List[Dict] = Field(
        default=[],
        description="Each record with its anomaly score and ground truth label."
    )
