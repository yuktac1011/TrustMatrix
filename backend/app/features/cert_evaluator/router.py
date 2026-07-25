# backend/app/features/cert_evaluator/router.py

import random
from fastapi import APIRouter, HTTPException
from app.features.cert_evaluator.schemas import (
    BenchmarkRequest,
    BenchmarkReport,
    CERTLogEntry,
)
from app.features.cert_evaluator.evaluator import cert_evaluator

router = APIRouter(prefix="/benchmark", tags=["CERT R6.2 Benchmark Evaluator"])


@router.post(
    "/evaluate",
    response_model=BenchmarkReport,
    summary="Run benchmark evaluation on CERT-style log data",
    description=(
        "Accepts a list of CERT R6.2-style daily user activity records "
        "(with ground truth `is_malicious` labels) and runs three anomaly detection "
        "models (Isolation Forest, PCA Autoencoder, and Ensemble). "
        "Returns True Detection Rate (TDR) curves at multiple top-N% thresholds — "
        "as described in Kim et al. (2019, MDPI Applied Sciences)."
    )
)
async def run_benchmark(request: BenchmarkRequest) -> BenchmarkReport:
    """
    Evaluates insider threat detection accuracy against labeled CERT data.
    The `is_malicious` flag in each log entry serves as the ground truth label.
    """
    try:
        return cert_evaluator.run_benchmark(request)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Benchmark evaluation failed: {str(e)}"
        )


@router.get(
    "/demo",
    response_model=BenchmarkReport,
    summary="Run demo benchmark with built-in synthetic CERT data",
    description=(
        "Runs the benchmark evaluator using a built-in 200-record synthetic dataset "
        "that mirrors the CERT R6.2 structure. 5 records are labeled as malicious insiders. "
        "Use this endpoint to quickly demonstrate TDR curves without uploading real data."
    )
)
async def run_demo_benchmark() -> BenchmarkReport:
    """
    Runs the CERT benchmark with a synthetic demo dataset.
    Generates 195 normal + 5 malicious records with realistic feature distributions.
    """
    rng = random.Random(42)
    entries = []

    # ── Normal users: 195 records ────────────────────────────────────────────
    roles = ["IT Admin", "Salesman", "Electrical Engineer", "Finance", "HR"]
    for i in range(195):
        entries.append(CERTLogEntry(
            user=f"USR{1000 + i}",
            date=f"2026-01-{(i % 28) + 1:02d}",
            role=roles[i % len(roles)],
            login_count=rng.randint(1, 5),
            logoff_count=rng.randint(1, 5),
            failed_login_count=rng.randint(0, 1),
            after_hours_access=rng.randint(0, 2),
            file_access_count=rng.randint(5, 30),
            bytes_transferred=rng.uniform(10.0, 500.0),
            usb_events=rng.randint(0, 1),
            email_sent_count=rng.randint(5, 20),
            http_visits=rng.randint(10, 80),
            admin_commands=rng.randint(0, 2),
            new_device_flag=0,
            is_malicious=False,
        ))

    # ── Malicious insiders: 5 records with highly anomalous behavior ─────────
    malicious_profiles = [
        # Data exfiltration: massive bytes transfer at night
        CERTLogEntry(
            user="CDE1846", date="2026-01-15", role="Salesman",
            login_count=1, logoff_count=1, failed_login_count=0,
            after_hours_access=8, file_access_count=250,
            bytes_transferred=8192.0,  # 8 GB
            usb_events=3, email_sent_count=45, http_visits=120,
            admin_commands=0, new_device_flag=1, is_malicious=True,
        ),
        # Privilege escalation: many admin commands late at night
        CERTLogEntry(
            user="HIS1706", date="2026-01-20", role="IT Admin",
            login_count=2, logoff_count=1, failed_login_count=5,
            after_hours_access=12, file_access_count=10,
            bytes_transferred=200.0,
            usb_events=0, email_sent_count=2, http_visits=15,
            admin_commands=35, new_device_flag=1, is_malicious=True,
        ),
        # Credential stuffing: many failed logins then success
        CERTLogEntry(
            user="CMP2946", date="2026-01-22", role="Finance",
            login_count=1, logoff_count=1, failed_login_count=22,
            after_hours_access=0, file_access_count=3,
            bytes_transferred=50.0,
            usb_events=0, email_sent_count=1, http_visits=5,
            admin_commands=0, new_device_flag=1, is_malicious=True,
        ),
        # Slow exfiltration: slightly elevated every day
        CERTLogEntry(
            user="MRT3101", date="2026-01-25", role="HR",
            login_count=3, logoff_count=3, failed_login_count=0,
            after_hours_access=4, file_access_count=95,
            bytes_transferred=1500.0,
            usb_events=2, email_sent_count=12, http_visits=60,
            admin_commands=0, new_device_flag=0, is_malicious=True,
        ),
        # Shadow account activation: dormant account suddenly active
        CERTLogEntry(
            user="SHD9001", date="2026-01-28", role="IT Admin",
            login_count=8, logoff_count=2, failed_login_count=0,
            after_hours_access=6, file_access_count=180,
            bytes_transferred=3000.0,
            usb_events=4, email_sent_count=0, http_visits=200,
            admin_commands=28, new_device_flag=1, is_malicious=True,
        ),
    ]
    entries.extend(malicious_profiles)

    request = BenchmarkRequest(
        log_entries=entries,
        top_percent_thresholds=[1.0, 5.0, 10.0, 15.0, 20.0, 25.0, 30.0],
        contamination=0.05,
    )

    try:
        return cert_evaluator.run_benchmark(request)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Demo benchmark failed: {str(e)}"
        )
