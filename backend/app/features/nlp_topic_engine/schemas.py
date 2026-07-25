# backend/app/features/nlp_topic_engine/schemas.py

from typing import List, Optional
from pydantic import BaseModel, Field


class TextSample(BaseModel):
    """A single text document to analyze (file name, email subject, log message, etc.)"""
    text: str = Field(..., description="The raw text content to analyze for topic modeling.")
    source_label: Optional[str] = Field(None, description="Optional label e.g. 'filename', 'email_subject', 'log_message'.")


class TopicAnalysisRequest(BaseModel):
    """
    Request payload for LDA topic anomaly analysis.
    Provide a target user's recent documents/filenames and optionally the corpus of normal docs.
    """
    username: str = Field(..., description="The user whose documents are being analyzed.")
    target_documents: List[str] = Field(
        ...,
        description="List of recent text documents (file names, email subjects) to score for topic anomaly.",
        min_length=1
    )
    corpus_documents: Optional[List[str]] = Field(
        None,
        description="Optional list of 'normal' reference documents to train the LDA model on. If not provided, target_documents are used as the corpus."
    )
    n_topics: int = Field(default=10, ge=2, le=50, description="Number of LDA topics to extract.")


class TopicVector(BaseModel):
    """Represents the topic distribution for a single document."""
    document: str = Field(..., description="The original document text (truncated).")
    topic_distribution: List[float] = Field(..., description="Probability distribution across all N topics.")
    dominant_topic: int = Field(..., description="Index of the topic with highest probability.")
    dominant_topic_probability: float = Field(..., description="Probability of the dominant topic.")


class TopicAnomalyResult(BaseModel):
    """Full result of a topic anomaly detection run."""
    username: str
    n_topics: int
    corpus_size: int = Field(..., description="Number of documents used to train the LDA model.")
    topic_keywords: List[List[str]] = Field(..., description="Top keywords for each discovered topic.")
    document_vectors: List[TopicVector] = Field(..., description="Topic distribution for each target document.")
    anomalous_documents: List[str] = Field(
        ...,
        description="Documents flagged as anomalous — their dominant topic does not appear in the normal baseline."
    )
    anomaly_score: float = Field(..., description="Fraction of target documents that are anomalous (0.0 to 1.0).")
    is_topic_anomaly: bool = Field(..., description="True if anomaly_score exceeds the configured threshold.")
    baseline_topics: List[int] = Field(..., description="List of topic indices observed in normal corpus.")
    flagged_topics: List[int] = Field(..., description="List of new topic indices not present in the baseline.")
