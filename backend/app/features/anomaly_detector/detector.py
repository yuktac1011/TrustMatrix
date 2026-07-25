# backend/app/features/anomaly_detector/detector.py

import torch
import torch.nn as nn
import numpy as np
from typing import List, Tuple
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import MinMaxScaler

from app.features.baseline_engine.schemas import UserActivityFeatures
from app.features.anomaly_detector.models import PyTorchAutoencoder
from app.features.anomaly_detector.schemas import AnomalyAnalysisResponse, AnomalyExplanation


class EnsembleAnomalyDetector:
    """
    Combines Isolation Forest and PyTorch Autoencoders into a unified score.
    """
    def __init__(self, feature_dim: int = 7):
        self.feature_dim = feature_dim
        self.scaler = MinMaxScaler()
        
        # Core Models
        self.iso_forest = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
        self.autoencoder = PyTorchAutoencoder(input_dim=feature_dim)
        self.optimizer = torch.optim.Adam(self.autoencoder.parameters(), lr=0.01)
        self.criterion = nn.MSELoss()
        
        # Internal configuration thresholds
        self.anomaly_threshold = 70.0  # Configured limit indicating an anomaly
        self.feature_list = [
            "login_hour", "login_weekday", "failed_login_ratio", 
            "bytes_transferred", "admin_commands_count", 
            "unique_devices_used", "unique_locations_visited"
        ]

    def _prepare_vector(self, feat: UserActivityFeatures) -> np.ndarray:
        """
        Maps a UserActivityFeatures object to a structured numerical array.
        """
        return np.array([
            float(feat.login_hour),
            float(feat.login_weekday),
            float(feat.failed_login_ratio),
            float(feat.bytes_transferred),
            float(feat.admin_commands_count),
            float(feat.unique_devices_used),
            float(feat.unique_locations_visited)
        ], dtype=np.float32)

    def train_models(self, history: List[UserActivityFeatures]):
        """
        Trains both models on historical data to establish standard behavior baselines.
        """
        if len(history) < 5:
            # Not enough data to train. Skip fitting.
            return
            
        vectors = np.array([self._prepare_vector(item) for item in history])
        scaled_vectors = self.scaler.fit_transform(vectors)
        
        # 1. Train Isolation Forest
        self.iso_forest.fit(scaled_vectors)
        
        # 2. Train PyTorch Autoencoder (Mini Epoch cycle)
        tensor_data = torch.tensor(scaled_vectors, dtype=torch.float32)
        self.autoencoder.train()
        
        for epoch in range(150):
            self.optimizer.zero_grad()
            reconstructed = self.autoencoder(tensor_data)
            loss = self.criterion(reconstructed, tensor_data)
            loss.backward()
            self.optimizer.step()

    def analyze_event(self, current: UserActivityFeatures, history: List[UserActivityFeatures]) -> AnomalyAnalysisResponse:
        """
        Analyzes a fresh event vector against historical baselines to generate anomaly scores.
        """
        # Automatically train models if history is available
        if len(history) >= 5:
            self.train_models(history)
            
        current_vec = self._prepare_vector(current).reshape(1, -1)
        
        try:
            scaled_current = self.scaler.transform(current_vec)
        except Exception:
            # Fallback if scaler isn't fitted yet
            scaled_current = np.clip(current_vec / 1000.0, 0, 1)
            
        # 1. Evaluate with Isolation Forest
        # decision_function yields lower values for outliers. Map this to a 0-100 scale.
        try:
            raw_iso_score = self.iso_forest.decision_function(scaled_current)[0]
            # Standard output is roughly [-0.5, 0.5]. Normalise into a 0-100 anomaly metric.
            iso_anomaly_score = np.clip((0.5 - raw_iso_score) * 100, 0, 100)
        except Exception:
            iso_anomaly_score = 10.0  # Safe default value
            
        # 2. Evaluate with PyTorch Autoencoder
        self.autoencoder.eval()
        input_tensor = torch.tensor(scaled_current, dtype=torch.float32)
        with torch.no_grad():
            reconstructed_tensor = self.autoencoder(input_tensor)
            # Calculate mean squared error of reconstruction
            recon_error = self.criterion(reconstructed_tensor, input_tensor).item()
            # Scale loss values (e.g., error rate 0.25 -> 100.0 anomaly score)
            ae_anomaly_score = np.clip(recon_error * 400.0, 0, 100)
            
        # 3. Combine scores into a unified ensemble score
        unified_score = (iso_anomaly_score * 0.5) + (ae_anomaly_score * 0.5)
        is_anomaly_detected = unified_score >= self.anomaly_threshold
        
        # 4. Generate SHAP-like feature contributions
        explanations = []
        diffs = np.abs(scaled_current[0] - reconstructed_tensor.numpy()[0])
        total_diff = np.sum(diffs) if np.sum(diffs) > 0 else 1.0
        
        for idx, feature_name in enumerate(self.feature_list):
            raw_val = float(current_vec[0][idx])
            contribution = float((diffs[idx] / total_diff) * 100.0)
            explanations.append(AnomalyExplanation(
                feature_name=feature_name,
                contribution_percentage=round(contribution, 2),
                actual_value=raw_val
            ))
            
        # Sort features by highest contribution percentage
        explanations.sort(key=lambda x: x.contribution_percentage, reverse=True)

        return AnomalyAnalysisResponse(
            username=current.username,
            anomaly_score=round(unified_score, 2),
            is_anomaly=is_anomaly_detected,
            isolation_forest_score=round(iso_anomaly_score, 2),
            autoencoder_score=round(ae_anomaly_score, 2),
            feature_contributions=explanations
        )