# backend/app/features/cert_evaluator/evaluator.py

import numpy as np
from typing import List, Tuple, Dict

from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import MinMaxScaler

from app.features.cert_evaluator.schemas import (
    BenchmarkRequest,
    BenchmarkReport,
    CERTLogEntry,
    ModelBenchmarkResult,
    TDRAtThreshold,
)


# ---------------------------------------------------------------------------
# Feature Extraction
# ---------------------------------------------------------------------------

FEATURE_COLUMNS = [
    "login_count",
    "logoff_count",
    "failed_login_count",
    "after_hours_access",
    "file_access_count",
    "bytes_transferred",
    "usb_events",
    "email_sent_count",
    "http_visits",
    "admin_commands",
    "new_device_flag",
]


def _entries_to_matrix(entries: List[CERTLogEntry]) -> np.ndarray:
    """Converts a list of CERT log entries to a numerical feature matrix."""
    rows = []
    for e in entries:
        rows.append([
            float(e.login_count),
            float(e.logoff_count),
            float(e.failed_login_count),
            float(e.after_hours_access),
            float(e.file_access_count),
            float(e.bytes_transferred),
            float(e.usb_events),
            float(e.email_sent_count),
            float(e.http_visits),
            float(e.admin_commands),
            float(e.new_device_flag),
        ])
    return np.array(rows, dtype=np.float32)


# ---------------------------------------------------------------------------
# Scoring Helpers
# ---------------------------------------------------------------------------

def _compute_tdr_curve(
    scores: np.ndarray,
    labels: np.ndarray,
    thresholds: List[float],
) -> Tuple[List[TDRAtThreshold], float]:
    """
    Computes True Detection Rate (TDR) at each top-N% threshold.
    Mirrors the evaluation methodology from Kim et al. (2019).

    Args:
        scores:     Anomaly scores for each record (higher = more anomalous).
        labels:     Ground truth boolean array (True = malicious).
        thresholds: List of top-N% values (e.g. [1.0, 5.0, 10.0]).

    Returns:
        (tdr_curve, auc_approximation)
    """
    total = len(scores)
    total_malicious = int(np.sum(labels))
    sorted_indices = np.argsort(scores)[::-1]  # descending by score
    sorted_labels = labels[sorted_indices]

    tdr_curve: List[TDRAtThreshold] = []
    tdr_values: List[float] = []

    for pct in thresholds:
        n_inspect = max(1, int(np.ceil(total * pct / 100.0)))
        true_pos = int(np.sum(sorted_labels[:n_inspect]))
        tdr = true_pos / total_malicious if total_malicious > 0 else 0.0
        tdr_curve.append(TDRAtThreshold(
            threshold_percent=pct,
            true_positives=true_pos,
            total_malicious=total_malicious,
            true_detection_rate=round(tdr, 4),
        ))
        tdr_values.append(tdr)

    # Trapezoidal AUC approximation over threshold axis
    x = [t / 100.0 for t in thresholds]
    auc = float(np.trapz(tdr_values, x=x)) if len(tdr_values) > 1 else 0.0

    return tdr_curve, round(auc, 4)


def _autoencoder_proxy_scores(X_scaled: np.ndarray) -> np.ndarray:
    """
    Lightweight autoencoder-proxy using PCA reconstruction error.
    Full PyTorch autoencoder would require model training time; this gives
    equivalent anomaly signal via low-rank reconstruction error — fast enough
    for a benchmark run while replicating the paper's PCA model.
    """
    from sklearn.decomposition import PCA

    n_components = min(3, X_scaled.shape[1], X_scaled.shape[0] - 1)
    if n_components < 1:
        return np.zeros(X_scaled.shape[0])

    pca = PCA(n_components=n_components)
    X_reduced = pca.fit_transform(X_scaled)
    X_reconstructed = pca.inverse_transform(X_reduced)
    reconstruction_errors = np.mean((X_scaled - X_reconstructed) ** 2, axis=1)
    return reconstruction_errors


# ---------------------------------------------------------------------------
# Main Evaluator Class
# ---------------------------------------------------------------------------

class CERTBenchmarkEvaluator:
    """
    Benchmarks the TrustMatrix anomaly detection models on CERT R6.2-style data.

    Runs 3 models:
      1. Isolation Forest  (as used in TrustMatrix baseline engine)
      2. PCA Autoencoder Proxy  (simulates deep autoencoder reconstruction error)
      3. Ensemble  (50/50 weighted average of the two)

    Reports True Detection Rate (TDR) at multiple top-N% thresholds to allow
    the user to evaluate performance before committing analyst review time.
    """

    def run_benchmark(self, request: BenchmarkRequest) -> BenchmarkReport:
        entries = request.log_entries
        labels = np.array([e.is_malicious for e in entries], dtype=bool)
        total_malicious = int(np.sum(labels))
        total = len(entries)
        malicious_rate = round((total_malicious / total) * 100, 2) if total > 0 else 0.0

        # ── 1. Feature matrix ────────────────────────────────────────────────
        X_raw = _entries_to_matrix(entries)
        scaler = MinMaxScaler()
        X_scaled = scaler.fit_transform(X_raw)

        # ── 2. Isolation Forest scores ───────────────────────────────────────
        iso = IsolationForest(
            n_estimators=100,
            contamination=request.contamination,
            random_state=42,
        )
        iso.fit(X_scaled)
        # decision_function: lower = more anomalous → negate to get "higher = worse"
        iso_scores = -iso.decision_function(X_scaled)
        iso_scores_norm = self._minmax_normalize(iso_scores)

        # ── 3. PCA Autoencoder proxy scores ──────────────────────────────────
        ae_scores = _autoencoder_proxy_scores(X_scaled)
        ae_scores_norm = self._minmax_normalize(ae_scores)

        # ── 4. Ensemble scores (equal weight) ────────────────────────────────
        ensemble_scores = (iso_scores_norm * 0.5) + (ae_scores_norm * 0.5)

        # ── 5. TDR curves for each model ─────────────────────────────────────
        thresholds = request.top_percent_thresholds
        iso_curve, iso_auc = _compute_tdr_curve(iso_scores_norm, labels, thresholds)
        ae_curve, ae_auc = _compute_tdr_curve(ae_scores_norm, labels, thresholds)
        ens_curve, ens_auc = _compute_tdr_curve(ensemble_scores, labels, thresholds)

        # ── 6. Determine best model ───────────────────────────────────────────
        auc_map = {
            "Isolation Forest": iso_auc,
            "PCA Autoencoder": ae_auc,
            "Ensemble (IF + AE)": ens_auc,
        }
        best_model = max(auc_map, key=lambda k: auc_map[k])
        best_auc = auc_map[best_model]

        # ── 7. Build scored records list for UI display ───────────────────────
        scored_records: List[Dict] = []
        for i, entry in enumerate(entries):
            scored_records.append({
                "user": entry.user,
                "date": entry.date,
                "role": entry.role or "Unknown",
                "is_malicious": entry.is_malicious,
                "isolation_forest_score": round(float(iso_scores_norm[i]), 4),
                "autoencoder_score": round(float(ae_scores_norm[i]), 4),
                "ensemble_score": round(float(ensemble_scores[i]), 4),
            })

        # Sort by ensemble score descending for display
        scored_records.sort(key=lambda r: r["ensemble_score"], reverse=True)

        # ── 8. Build human-readable summary ──────────────────────────────────
        best_ens_5pct = next((t.true_detection_rate for t in ens_curve if t.threshold_percent == 5.0), 0.0)
        summary = (
            f"Evaluated {total} records ({total_malicious} malicious, {malicious_rate}% base rate). "
            f"Best model: {best_model} (AUC: {best_auc:.2%}). "
            f"Ensemble detects {best_ens_5pct:.0%} of threats in the top 5% of alerts — "
            f"{'strong' if best_ens_5pct >= 0.5 else 'moderate'} insider threat detection capability."
        )

        return BenchmarkReport(
            total_records=total,
            total_malicious=total_malicious,
            malicious_rate_percent=malicious_rate,
            isolation_forest=ModelBenchmarkResult(
                model_name="Isolation Forest",
                tdr_curve=iso_curve,
                auc_approximation=iso_auc,
            ),
            autoencoder_proxy=ModelBenchmarkResult(
                model_name="PCA Autoencoder Proxy",
                tdr_curve=ae_curve,
                auc_approximation=ae_auc,
            ),
            ensemble=ModelBenchmarkResult(
                model_name="Ensemble (IF + AE)",
                tdr_curve=ens_curve,
                auc_approximation=ens_auc,
            ),
            best_model=best_model,
            best_auc=best_auc,
            summary=summary,
            scored_records=scored_records,
        )

    @staticmethod
    def _minmax_normalize(arr: np.ndarray) -> np.ndarray:
        """Normalizes an array to [0, 1] range."""
        mn, mx = arr.min(), arr.max()
        if mx == mn:
            return np.zeros_like(arr)
        return (arr - mn) / (mx - mn)


# Module-level singleton
cert_evaluator = CERTBenchmarkEvaluator()
