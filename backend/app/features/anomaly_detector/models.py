# backend/app/features/anomaly_detector/models.py

import torch
import torch.nn as nn


class PyTorchAutoencoder(nn.Module):
    """
    A Deep Learning Autoencoder for tabular feature reconstruction.
    """
    def __init__(self, input_dim: int = 7):
        super(PyTorchAutoencoder, self).__init__()
        
        # Encoder Network (Compressing features down)
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, 16),
            nn.ReLU(),
            nn.Linear(16, 8),
            nn.ReLU(),
            nn.Linear(8, 4)  # Latent representation bottleneck
        )
        
        # Decoder Network (Reconstructing raw parameters)
        self.decoder = nn.Sequential(
            nn.Linear(4, 8),
            nn.ReLU(),
            nn.Linear(8, 16),
            nn.ReLU(),
            nn.Linear(16, input_dim),
            nn.Sigmoid()  # Restricts numerical scales back to [0, 1] range
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        latent = self.encoder(x)
        reconstruction = self.decoder(latent)
        return reconstruction