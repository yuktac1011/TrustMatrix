# backend/app/features/nlp_topic_engine/analyzer.py

import re
import numpy as np
from typing import List, Set, Tuple

from sklearn.decomposition import LatentDirichletAllocation
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer

from app.features.nlp_topic_engine.schemas import (
    TopicAnalysisRequest,
    TopicAnomalyResult,
    TopicVector,
)


# ---------------------------------------------------------------------------
# Text preprocessing helpers
# ---------------------------------------------------------------------------

_STOP_WORDS = {
    "the", "a", "an", "and", "or", "of", "in", "to", "for", "is",
    "it", "on", "at", "by", "from", "with", "this", "that", "was",
    "are", "be", "as", "has", "its", "we", "you", "he", "she", "they",
    "file", "doc", "document", "pdf", "txt", "zip", "csv", "xlsx",
    "exe", "dll", "log", "tmp", "bak", "cfg", "conf", "ini",
    "com", "net", "org", "www", "http", "https",
}

def _tokenize(text: str) -> str:
    """
    Normalizes a text string (file name, email subject, log message) into
    space-separated lowercase tokens for TF-IDF / CountVectorizer input.
    - Splits camelCase / PascalCase: "payrollDbBackup" → "payroll db backup"
    - Strips file extensions and path separators
    - Removes stopwords
    """
    # 1. Replace common separators with spaces
    text = re.sub(r"[\\\/\-_\.\,\:\;\(\)\[\]\{\}@#\$\%\^\&\*\+\=\|<>\"\']+", " ", text)

    # 2. Split camelCase / PascalCase sequences
    text = re.sub(r"([a-z])([A-Z])", r"\1 \2", text)

    # 3. Lowercase and split
    tokens = text.lower().split()

    # 4. Remove stopwords, numbers, and very short tokens
    filtered = [
        tok for tok in tokens
        if tok not in _STOP_WORDS and len(tok) > 2 and not tok.isdigit()
    ]

    return " ".join(filtered) if filtered else text.lower()


# ---------------------------------------------------------------------------
# Core LDA Topic Analyzer
# ---------------------------------------------------------------------------

class LDATopicAnalyzer:
    """
    Implements Latent Dirichlet Allocation-based topic anomaly detection for
    file names, email subjects, and log messages — as described in Kim et al. (2019).

    Detection logic:
      1. Train LDA on a 'corpus' of normal documents.
      2. Extract the set of 'baseline topic indices' that appear in the corpus.
      3. Score each target document; flag it if its dominant topic is NOT
         in the baseline set (i.e., it belongs to a topic the user never touched).
    """

    # Class-level threshold: fraction of anomalous docs to trigger an alert
    ANOMALY_RATIO_THRESHOLD: float = 0.25  # >25% of docs anomalous → flagged

    # Minimum number of keywords to extract per topic for display
    N_TOP_WORDS: int = 8

    def analyze(self, request: TopicAnalysisRequest) -> TopicAnomalyResult:
        """
        Runs the full LDA pipeline on the request and returns the structured result.
        """
        n_topics = request.n_topics

        # ── 1. Prepare corpus ────────────────────────────────────────────────
        corpus_raw = request.corpus_documents or request.target_documents
        corpus_processed = [_tokenize(doc) for doc in corpus_raw]
        target_processed = [_tokenize(doc) for doc in request.target_documents]

        # Guard: LDA needs at least as many docs as topics
        actual_topics = min(n_topics, max(2, len(corpus_processed)))

        # ── 2. Vectorize corpus with CountVectorizer (LDA uses raw term counts)
        corpus_size = len(corpus_processed)
        vectorizer = CountVectorizer(
            max_features=500,
            min_df=1,
            stop_words=None  # We already removed stopwords above
        )
        try:
            corpus_matrix = vectorizer.fit_transform(corpus_processed)
        except ValueError:
            # Fallback if vocabulary is empty after tokenization
            return self._empty_result(request, n_topics)

        # ── 3. Train LDA on corpus ───────────────────────────────────────────
        lda = LatentDirichletAllocation(
            n_components=actual_topics,
            max_iter=20,
            learning_method="online",
            random_state=42,
            n_jobs=-1,
        )
        lda.fit(corpus_matrix)

        # ── 4. Extract topic keywords ────────────────────────────────────────
        feature_names = vectorizer.get_feature_names_out()
        topic_keywords = []
        for topic_vec in lda.components_:
            top_indices = topic_vec.argsort()[: -self.N_TOP_WORDS - 1 : -1]
            topic_keywords.append([feature_names[i] for i in top_indices])

        # ── 5. Build baseline topic set from corpus ──────────────────────────
        corpus_topic_matrix = lda.transform(corpus_matrix)
        baseline_topics: Set[int] = set(
            int(np.argmax(row)) for row in corpus_topic_matrix
        )

        # ── 6. Score each target document ────────────────────────────────────
        target_matrix = vectorizer.transform(target_processed)
        target_topic_matrix = lda.transform(target_matrix)

        document_vectors: List[TopicVector] = []
        anomalous_documents: List[str] = []
        flagged_topics: Set[int] = set()

        for i, row in enumerate(target_topic_matrix):
            dominant = int(np.argmax(row))
            distribution = [round(float(p), 4) for p in row]

            document_vectors.append(
                TopicVector(
                    document=request.target_documents[i][:120],
                    topic_distribution=distribution,
                    dominant_topic=dominant,
                    dominant_topic_probability=round(float(row[dominant]), 4),
                )
            )

            # Flag if dominant topic never appeared in normal corpus
            if dominant not in baseline_topics:
                anomalous_documents.append(request.target_documents[i][:120])
                flagged_topics.add(dominant)

        # ── 7. Compute aggregate anomaly score ───────────────────────────────
        total = len(request.target_documents)
        anomaly_ratio = len(anomalous_documents) / total if total > 0 else 0.0
        is_anomaly = anomaly_ratio >= self.ANOMALY_RATIO_THRESHOLD

        return TopicAnomalyResult(
            username=request.username,
            n_topics=actual_topics,
            corpus_size=corpus_size,
            topic_keywords=topic_keywords,
            document_vectors=document_vectors,
            anomalous_documents=anomalous_documents,
            anomaly_score=round(anomaly_ratio, 4),
            is_topic_anomaly=is_anomaly,
            baseline_topics=sorted(baseline_topics),
            flagged_topics=sorted(flagged_topics),
        )

    # ── Helpers ──────────────────────────────────────────────────────────────

    def _empty_result(self, request: TopicAnalysisRequest, n_topics: int) -> TopicAnomalyResult:
        """Returns a safe empty result when the vocabulary is too sparse for LDA."""
        return TopicAnomalyResult(
            username=request.username,
            n_topics=n_topics,
            corpus_size=0,
            topic_keywords=[],
            document_vectors=[],
            anomalous_documents=[],
            anomaly_score=0.0,
            is_topic_anomaly=False,
            baseline_topics=[],
            flagged_topics=[],
        )


# Module-level singleton
lda_analyzer = LDATopicAnalyzer()
